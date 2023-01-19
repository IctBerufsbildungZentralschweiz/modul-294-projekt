describe('Listenansicht', () => {

    const setup = (response) => {
        cy.visit('/')

        if (!response) {
            response = [
                {
                    id: 1,
                    title: 'Beispiel A',
                    text: 'Text A',
                    votes: 2,
                    category: 'Bug',
                    comments: [{ text: 'Comment 1', author: 'Author 1' }]
                },
                {
                    id: 2,
                    title: 'Beispiel B',
                    text: 'Text B',
                    votes: 8,
                    category: 'Feature',
                    comments: [{ text: 'Comment 1', author: 'Author 1' }]
                }
            ]
        }

        cy
            .intercept('GET', '/projekt/feedback', { statusCode: 200, body: { data: response, } })
            .as('loadFeedback')
    }

    it('Die Listenansicht ist über `/` zugänglich', () => {
        setup()
        cy.contains('.logo', 'Feedback Hub')
    })

    it('Das Feedback Hub Logo verlinkt auf `/`', () => {
        setup()
        cy.get('#logo').invoke('attr', 'href').should('equal', '/')
    })

    it('Der `Feedback erstellen` Link verweist auf `/form` (nicht `/login`)', () => {
        setup()
        cy.get('.btn-create').invoke('attr', 'href').should('match', /\/form$/)
    })

    it('Die Listeneinträge werden vom Backend geladen und aufgelistet angezeigt', () => {
        setup()

        cy.wait('@loadFeedback').then(() => {
            cy
                .get('.feedback-list > .feedback')
                .should('have.length.at.least', 2)
        })
    })

    it('Während dem Laden der Liste wird ein Spinner angezeigt, die Feedback-Liste ist versteckt', () => {
        setup()
        cy.get('.loader').should('be.visible')
        cy.get('.feedback-list').should('not.exist')
    })

    it('Die gesamte Anzahl von Listeneinträgen wird in der Toolbar angezeigt', () => {
        setup([
            { id: 1, title: 'Beispiel', text: 'ABC', votes: 0, comments: [] },
            { id: 2, title: 'Beispiel', text: 'ABC', votes: 0, comments: [] },
        ])

        cy.wait('@loadFeedback')
        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('.status-label').invoke('text').should('eql', `2 Einträge`)
        })
    })

    it('Das Wort `Einträge` wird bei einem Eintrag zu `Eintrag`', () => {
        setup([
            { id: 1, title: 'Beispiel', text: 'ABC', votes: 0, comments: [] }
        ])

        cy.wait('@loadFeedback')

        cy.get('.feedback-list > .feedback').then(() => {
            cy.get('.status-label').invoke('text').should('match', /\d Eintrag/)
        })
    })

})
