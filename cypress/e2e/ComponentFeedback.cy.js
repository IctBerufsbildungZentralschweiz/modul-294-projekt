import { feedback } from '../support/utils'

const setup = (response) => {
    cy
        .intercept('/projekt/feedback', {
            data: response
        })
        .as('loadFeedback')

    cy.visit('/')
    cy.wait('@loadFeedback')
}

describe('Feedback', () => {
    it('Titel, Text, Votes und Kategorie werden dynamisch angezeigt', () => {
        setup([
            feedback({ title: 'Beispiel A', text: 'Text A', votes: 2 }),
            feedback({ title: 'Beispiel B', text: 'Text B', votes: 8 }),
        ])

        cy.get('.feedback-list .feedback').then(() => {
            cy.get('.feedback-list .feedback:nth-child(1) .feedback__title').invoke('text').should('eql', `Beispiel A`)
            cy.get('.feedback-list .feedback:nth-child(1) .feedback__text').invoke('text').should('match', /Text A/)
            cy.get('.feedback-list .feedback:nth-child(1) .voter__number').invoke('text').should('eql', `2`)

            cy.get('.feedback-list .feedback:nth-child(2) .feedback__title').invoke('text').should('eql', `Beispiel B`)
            cy.get('.feedback-list .feedback:nth-child(2) .feedback__text').invoke('text').should('match', /Text B/)
            cy.get('.feedback-list .feedback:nth-child(2) .voter__number').invoke('text').should('eql', `8`)
        })
    })

    it('Die Anzeige der Anzahl der Kommentare ist dynamisch', () => {
        setup([
            feedback({ comments: [{}, {}] }),
            feedback({ comments: [{}] }),
        ])

        cy.get('.feedback-list .feedback').then(() => {
            cy.get('.feedback-list .feedback:nth-child(1) .feedback__comments-count').invoke('text').should('eql', `2`)
            cy.get('.feedback-list .feedback:nth-child(2) .feedback__comments-count').invoke('text').should('eql', `1`)
        })
    })

    it('Die Kommentare werden als Liste gerendert (erst nach Klick sichtbar)', () => {
        setup([
            feedback({ comments: [{ author: "X" }, { author: "Y" }] }),
            feedback({ comments: [{ author: "X" }] }),
        ])

        cy.get('.feedback-list .feedback').then(() => {
            // Kommentare anzeigen, falls "Collapsed" Ansicht bereits implementiert wurde
            cy.get('.feedback-list .feedback:nth-child(1)').click()
            cy.get('.feedback-list .feedback:nth-child(2)').click()

            cy.get('.feedback-list .feedback:nth-child(1) .comment').should('have.length', 2)
            cy.get('.feedback-list .feedback:nth-child(2) .comment').should('have.length', 1)
        })
    })

    it('Beim Klick auf den `Voter` Button werden die Votes um 1 erhöht angezeigt', () => {
        setup([
            feedback({ votes: 2 }),
        ])

        cy
            .intercept('PATCH', '/projekt/feedback/1', req => {
                req.reply({
                    statusCode: 200,
                    body: { data: [feedback({ votes: 3 })] }
                })
            })
            .as('voteFeedback')

        cy.get('.feedback-list .feedback').then(() => {
            cy.get('.feedback:nth-child(1) .voter').click()
            cy.wait(500)
            cy.get('.feedback:nth-child(1) .voter__number').invoke('text').should('eql', `3`)
        })
    })

    it('Beim Klick auf den `Voter` Button wird der API-Request ans Backend gesendet', () => {
        setup([
            feedback({ votes: 2 }),
        ])

        cy
            .intercept('PATCH', '/projekt/feedback/1', req => {
                req.reply({
                    statusCode: 200,
                    body: {
                        data: [feedback({ votes: 3 })]
                    }
                })
            })
            .as('voteFeedback')

        cy.get('.feedback-list .feedback').then(() => {
            cy.get('.feedback:nth-child(1) .voter').click()
            cy.wait('@voteFeedback')
        })
    })

    it('Schlägt der Vote Request fehl, werden die Votes nicht erhöht', () => {
        cy.intercept('PATCH', '/projekt/feedback/1', req => {
            req.reply({ statusCode: 500, body: { data: {} } })
        }).as('voteFeedback')

        setup([
            feedback({ votes: 2 }),
        ])

        cy.get('.feedback-list .feedback').then(() => {
            cy.get('.feedback:nth-child(1) .voter').click()
            cy.wait('@voteFeedback')
            cy.get('.feedback:nth-child(1) .voter__number').invoke('text').should('eql', `2`)
        })
    })

    it('Im Text werden standardmässig die ersten 20 Wörter des Textes angezeigt, die Kommentare sind nicht sichtbar', () => {
        setup([
            feedback({ text: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21' }),
        ])

        cy.get('.feedback-list .feedback').then(() => {
            cy.get('.feedback__text').invoke('text').should('contain', `20`)
            cy.get('.feedback__text').invoke('text').should('not.contain', `21`)

            cy.get('.feedback__comments').should('not.exist')
        })
    })

    it('Mit einem Klick auf den Eintrag wird zwischen Vorschau- und Voll-Ansicht (Kommenatre + kompletter Text) umgestellt', () => {
        setup([
            feedback({ votes: 2 }),
        ])

        cy.get('.feedback-list .feedback').then(() => {
            cy.get('.feedback-list:nth-child(1) .feedback').click()
            cy.get('.feedback__comments .comment').should('exist').and('be.visible')
        })
    })
})
