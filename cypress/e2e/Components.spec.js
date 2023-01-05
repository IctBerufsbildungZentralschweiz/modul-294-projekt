const setup = (response) => {
    cy
        .intercept('/projekt/feedback', {
            data: response
        })
        .as('loadFeedback')

    cy.visit('/')
    cy.wait('@loadFeedback')
}

const feedback = (attrs) => ({
    id: 1,
    title: 'Title',
    text: 'Text',
    category: 'Bug',
    votes: 4,
    comments: [
        { text: 'Comment 1', author: 'Author 1' },
    ],
    ...attrs,
})

describe('Feedback', () => {
    it('Die Anzeige der Anzahl der Kommentare ist dynamisch', () => {
        setup([
            feedback({ comments: [{}, {}] }),
            feedback({ comments: [{}] }),
        ])

        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('.feedback-list > .feedback:nth-child(1) .feedback__comments-count').invoke('text').should('eql', `2`)
            cy.get('.feedback-list > .feedback:nth-child(2) .feedback__comments-count').invoke('text').should('eql', `1`)
        })
    })

    it('Titel, Text, Votes und Kategorie werden dynamisch angezeigt', () => {
        setup([
            feedback({ title: 'Beispiel A', text: 'Text A', votes: 2 }),
            feedback({ title: 'Beispiel B', text: 'Text B', votes: 8 }),
        ])

        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('.feedback-list > .feedback:nth-child(1) .feedback__title').invoke('text').should('eql', `Beispiel A`)
            cy.get('.feedback-list > .feedback:nth-child(1) .feedback__text').invoke('text').should('match', /Text A/)
            cy.get('.feedback-list > .feedback:nth-child(1) .voter__number').invoke('text').should('eql', `2`)

            cy.get('.feedback-list > .feedback:nth-child(2) .feedback__title').invoke('text').should('eql', `Beispiel B`)
            cy.get('.feedback-list > .feedback:nth-child(2) .feedback__text').invoke('text').should('match', /Text B/)
            cy.get('.feedback-list > .feedback:nth-child(2) .voter__number').invoke('text').should('eql', `8`)
        })
    })

    it('Im Teaser werden die ersten 20 Wörter des Textes angezeigt', () => {
        setup([
            feedback({ text: '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21' }),
        ])

        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('.feedback__text').invoke('text').should('contain', `20`)
            cy.get('.feedback__text').invoke('text').should('not.contain', `21`)
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

        cy.get('.feedback-list > .feedback').then(() => {
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

        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('.feedback:nth-child(1) .voter').click()
            cy.wait('@voteFeedback')
        })
    })

    it('Schlägt der Request fehl, werden die Votes nicht erhöht', () => {
        cy.intercept('PATCH', '/projekt/feedback/1', req => {
            req.reply({ statusCode: 500, body: { data: {} } })
        }).as('voteFeedback')

        setup([
            feedback({ votes: 2 }),
        ])

        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('.feedback:nth-child(1) .voter').click()
            cy.wait('@voteFeedback')
            cy.wait(100)
            cy.get('.feedback:nth-child(1) .voter__number').invoke('text').should('eql', `2`)
        })
    })

    it('Mit einem Klick auf den Eintrag wird zwischen Vorschau- und Voll-Ansicht (Kommenatre + kompletter Text) umgestellt', () => {
        setup([
            feedback({ votes: 2 }),
        ])

        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('.feedback-list:nth-child(1) .feedback').click()
            cy.get('.feedback__comments .comment').should('exist').and('be.visible')
        })
    })
})

describe('FilterBox', () => {

    it('Die verfügbaren Filter werden basierend auf den vorhandenen Einträgen generiert', () => {
        setup([
            feedback({ category: 'A' }),
            feedback({ category: 'B' }),
            feedback({ category: 'C' }),
        ])

        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('.filter').then(() => {
                cy.get('.filter-link').should('have.length', 3)
                cy.get('.filter').invoke('text').should('eql', `ABC`)
            })
        })
    })

    it('Die `Zurücksetzen` Aktion erscheint nur, wenn ein Filter aktiv ist', () => {
        setup([
            feedback({ category: 'A' }),
            feedback({ category: 'B' }),
            feedback({ category: 'C' }),
        ])

        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('#filter-reset').should('not.exist')
            cy.get('.filter-link').first().click()
            cy.get('#filter-reset').should('exist')
        })
    })

    it('Die `Zurücksetzen` Aktion setzt den Filter zurück', () => {
        setup([
            feedback({ category: 'A' }),
            feedback({ category: 'B' }),
        ])

        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('.feedback-list > .feedback').should('have.length', 2)

            cy.get('.filter-link').first().click()
            cy.get('.feedback-list > .feedback').should('have.length', 1)

            cy.get('#filter-reset').click()
            cy.get('.feedback-list > .feedback').should('have.length', 2)
        })
    })

    it('Der aktive Filter wird mit einer `active` Klasse markiert', () => {
        setup([
            feedback({ category: 'A' }),
            feedback({ category: 'B' }),
        ])

        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('.filter-link').first().click()
            cy.get('.filter-link').first().should('have.class', 'active')
        })
    })

})