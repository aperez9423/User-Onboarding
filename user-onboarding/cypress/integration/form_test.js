describe('form test', () => {
    it('test that the form works', () => {
        cy.visit('/')

        cy.get('button#submit')
        .should('be.disabled')

        cy.get('[for="nameInput"] > input')
        .type('Angelica Perez')
        .should('have.value', 'Angelica Perez')

        const email = "aperez9423@gmail.com";
        cy.get('[for="emailInput"] > input')
        .type(email)
        .should('have.value', email)

        const password = "123456";
        cy.get('[for="passwordInput"] > input')
        .type(password)
        .should('have.value', password)

        cy.get('select#roles')
        .select('Animator')
        .should('have.value', 'Animator')


        cy.get('[for= "terms"] > input')
        .click()
        .should('have.checked', true)

        cy.get('button#submit')
        .should('not.be.disabled')
    })
    it('error messages are displayed properly', () => {
        cy.get('[for="emailInput"] > input')
        .clear()

        cy.get('[data-cy="email-error-msg"]')
        .contains('Please provide an email.')
    })
})

