describe('Test Registration', () => {
  it('passes if we can register a new user into the app', () => {
    cy.visit('http://localhost:3000')

    cy.contains("Don't have an account? Sign Up").click()

    cy.get('#firstName').type('cytest1').should('have.value', 'cytest1')
    cy.get('#lastName').type('cytest1').should('have.value', 'cytest1')
    cy.get('#email').type('cytest1@penn.edu').should('have.value', 'cytest1@penn.edu')
    cy.get('#username').type('cytest1').should('have.value', 'cytest1')
    cy.get('#password').type('cytest1').should('have.value', 'cytest1')

    cy.get('button').contains('Sign Up').click()

    cy.get('#userName').type('cytest1').should('have.value', 'cytest1')
    cy.get('#password').type('cytest1').should('have.value', 'cytest1')

    cy.get('button').contains('Sign In').click()
  })
})