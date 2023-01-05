describe('FormView', () => {

    const setup = () => {
        cy.intercept('GET', '/projekt/auth', req => {
            req.reply({ statusCode: 200, body: { user: {} } })
        }).as('checkAuth')

        cy.visit('/form')
    }

    it('Die Formularansicht ist über `/form`  zugänglich', () => {
        setup()

        cy.get('#submit').should('exist')
    })

    it('Der «Zurück zur Übersicht» Button in der `FormView` verweist auf die `/`', () => {
        setup()

        cy.intercept('/projekt/feedback', req => {
            req.reply({ statusCode: 200, body: { data: [] } })
        })

        cy.get('#back-link').click()
        cy.get('.feedback-list').then(() => {
            cy.url().should('match', /\/$/)
        })
    })

    it('Das `Feedback Hub` Logo verlinkt auf `/`', () => {
        setup()

        cy.intercept('/projekt/feedback', req => {
            req.reply({ statusCode: 200, body: { data: [] } })
        })

        cy.get('#logo').invoke('attr', 'href').should('equal', '/')
    })

    it('Beim Klick auf `Feedback erstellen` werden die Formulardaten an das Backend gesendet', () => {
        // Eintrag soll nicht erstellt werden.
        cy.intercept('POST', '/projekt/feedback', req => {
            req.reply({ statusCode: 401 })
        }).as('create')

        setup()

        cy.get('#submit').click()

        cy.wait('@create')
    })

    it('Die Formularfelder `title`, `category` und `text` sind an eine Variable gebunden', () => {
        // Eintrag soll nicht erstellt werden.
        cy.intercept('POST', '/projekt/feedback', req => {
            req.reply({ statusCode: 200, body: { data: {} } })
        }).as('create')

        setup()

        cy.get('#title').type('Title')
        cy.get('#text').type('Text')
        cy.get('#category').select('Bug')
        cy.get('#submit').click()

        cy.get('@create').then(interception => {
            expect(interception.request.body).to.have.property('title', 'Title')
            expect(interception.request.body).to.have.property('text', 'Text')
            expect(interception.request.body).to.have.property('category', 'Bug')
        })
    })

    it('Validierungsfehler werden inline bei den Formularfeldern angezeigt', () => {
        cy.intercept('POST', '/projekt/feedback', req => {
            req.reply({
                statusCode: 422,
                body: {
                    errors: {
                        title: 'Error Title',
                        text: 'Error Text',
                        category: 'Error Category',
                    }
                }
            })
        }).as('create')

        setup()

        cy.get('#submit').click()

        cy.get('@create', { timeout: 1000 }).then(() => {
            cy.get('#error-title').should('be.visible').and('contain', 'Error Title')
            cy.get('#error-text').should('be.visible').and('contain', 'Error Text')
            cy.get('#error-category').should('be.visible').and('contain', 'Error Category')
        })
    })

    it('Nach dem Erstellen wird der Benutzer auf `/` umgeleitet, das neue Feedback ist sichtbar', () => {
        setup()

        // Eintrag soll nicht erstellt werden.
        cy.intercept('POST', '/projekt/feedback', req => {
            req.reply({
                statusCode: 201, body: {
                    data: { title: 'Erstellt' }
                }
            })
        }).as('create')

        cy.visit('/form')
        cy.get('#title').type('Title')
        cy.get('#text').type('Text')
        cy.get('#category').select('Bug')
        cy.get('#submit').click()

        cy.get('@create').then(() => {
            cy.url().should('match', /\/$/)
        })
    })

    it('Beim Aufrufen der `/form` Route ohne Session wird der Benutzer auf `/login` umgeleitet', () => {
        cy
            .intercept('GET', '/projekt/auth', req => {
                req.reply({ statusCode: 401 })
            })
            .as('checkAuth')

        cy.visit('/form')
        cy.wait('@checkAuth')

        cy.url().should('match', /\/login$/)
    })
})