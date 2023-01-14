describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')

    cy.get('#userName').type('admin').should('have.value', 'admin')
    cy.get('#password').type('admin').should('have.value', 'admin')

    cy.get('button').contains('Sign In').click()

    cy.get('#comment').click()

    cy.get(".mentionInput").type("Hey testing Cypress, scenario 2")
    cy.get("button").contains("Comment").click()
    cy.get(".closeButton").click()

    cy.get('#comment').click()
  })
})