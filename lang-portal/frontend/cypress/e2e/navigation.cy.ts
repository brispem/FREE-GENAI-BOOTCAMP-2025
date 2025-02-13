describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('can navigate to main sections', () => {
    // Check dashboard loads
    cy.contains('¡Bienvenidos!').should('be.visible')

    // Navigate to Study Activities
    cy.contains('Study Activities').click()
    cy.url().should('include', '/study-activities')

    // Navigate to Word Groups
    cy.contains('Word Groups').click()
    cy.url().should('include', '/groups')
  })

  it('shows correct theme', () => {
    // Check theme toggle works
    cy.get('[data-testid="theme-toggle"]').click()
    cy.get('html').should('have.class', 'dark')
  })
}) 