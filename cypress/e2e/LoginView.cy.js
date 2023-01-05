describe('Login', () => {

    const intercept = () => {
        cy.intercept('POST', '/projekt/login', req => {
            req.reply({
                statusCode: 200,
                body: { token: 'token' }
            })
        }).as('login')
    }

    const interceptError = () => {
        cy.intercept('POST', '/projekt/login', req => {
            req.reply({
                statusCode: 422,
                body: {
                    errors: {
                        email: 'Error E-Mail',
                        password: 'Error Passwort',
                    }
                }
            })
        }).as('login')
    }

    it('Die Loginansicht ist über `/login` zugänglich', () => {
        cy.visit('/login')

        cy.get('#submit').should('exist')
    })

    it('Der «Zurück zur Übersicht» Link verweist auf `/`', () => {
        cy.visit('/login')

        cy.get('.back-link > a').invoke('attr', 'href').should('equal', '/')
    })

    it('Die Formularfelder `email` und  `password` sind an eine Variable gebunden', () => {
        interceptError()

        cy.visit('/login')
        cy.get('#email').type('example@example.com')
        cy.get('#password').type('12345678')
        cy.get('#submit').click()

        cy.get('@login').then(interception => {
            expect(interception.request.body).to.have.property('email', 'example@example.com')
            expect(interception.request.body).to.have.property('password', '12345678')
        })
    })

    it('Beim Klick auf `Log in` werden die Formulardaten an das Backend gesendet', () => {
        interceptError()

        cy.visit('/login')
        cy.get('#submit').click()

        cy.wait('@login', { timeout: 1000 })
    })

    it('Validierungsfehler werden inline bei den Formularfeldern angezeigt', () => {
        interceptError()

        cy.visit('/login')
        cy.get('#submit').click()

        cy.wait('@login', { timeout: 1000 })
        cy.get('#error-email').should('be.visible').and('contain', 'Error E-Mail')
        cy.get('#error-password').should('be.visible').and('contain', 'Error Passwort')
    })

    it('Nach dem Login wird der Benutzer auf `/form` umgeleitet', () => {
        intercept()

        cy
            .intercept('GET', '/projekt/auth', req => {
                req.reply({ statusCode: 200, body: { user: {} } })
            })
            .as('checkAuth')

        cy.visit('/login')
        cy.get('#email').type('user1@example.com')
        cy.get('#password').type('1234')
        cy.get('#submit').click()

        cy.wait('@login', { timeout: 1000 })
        cy.wait(500)

        cy.url().should('match', /\/form$/)
    })
})