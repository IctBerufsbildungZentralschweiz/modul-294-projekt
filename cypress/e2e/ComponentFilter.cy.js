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

describe('ComponentFilter', () => {

    it('Die Filterbox ist während des Ladens der Einträge nicht sichtbar', () => {
        cy
            .intercept('/projekt/feedback', req => {
                req.reply({
                    delay: 500,
                    body: {
                        data: [feedback()]
                    },
                })
            })
            .as('loadFeedback')

        cy.visit('/')

        cy.get('.filter-box', { timeout: 500 }).should('not.exist')

        // Nach dem Laden der Einträge muss die Filterbox sichtbar sein
        cy.wait('@loadFeedback')

        cy.get('.filter-box').should('exist')
    })

    it('Der aktive Filter wird mit einer `active` Klasse markiert', () => {
        setup([
            feedback({ category: 'A' }),
            feedback({ category: 'B' }),
        ])

        cy.get('.filter-link').first().click()
        cy.get('.filter-link').first().should('have.class', 'active')
    })

    it('Die `Zurücksetzen` Aktion erscheint nur, wenn ein Filter aktiv ist', () => {
        setup([
            feedback({ category: 'Bug' }),
            feedback({ category: 'Feature' }),
            feedback({ category: 'Idee' }),
        ])

        cy.get('#filter-reset').should('not.exist')
        cy.get('.filter-link').first().click()
        cy.get('#filter-reset').should('exist')
    })

    it('Die `Zurücksetzen` Aktion setzt den Filter zurück', () => {
        setup([
            feedback({ category: 'Bug' }),
            feedback({ category: 'Feature' }),
        ])

        cy.get('.filter-link').first().click()
        cy.get('.filter-link').first().should('have.class', 'active')

        cy.get('#filter-reset').click()

        cy.get('.filter-link').first().should('not.have.class', 'active')
    })

    it('Die Listeneinträge werden anhand des aktiven Filters gefiltert', () => {
        setup([
            feedback({ category: 'Bug', comments: [] }),
            feedback({ category: 'Feature', comments: [] }),
            feedback({ category: 'Feature', comments: [] }),
        ])

        cy.get('.filter-link:first').click()
        cy.wait(250)
        cy.get('.feedback-list > .feedback').should('not.have.length', 3)
    })

    it('Die verfügbaren Filter werden basierend auf den vorhandenen Einträgen generiert', () => {
        setup([
            feedback({ category: 'A' }),
            feedback({ category: 'B' }),
            feedback({ category: 'C' }),
        ])

        cy.get('.filter').then(() => {
            cy.get('.filter-link').should('have.length', 3)
            cy.get('.filter').invoke('text').should('eql', `ABC`)
        })
    })
})
