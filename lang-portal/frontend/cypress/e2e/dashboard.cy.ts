describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/dashboard')
  })

  it('displays welcome message', () => {
    cy.contains('¡Bienvenidos!')
  })

  it('shows activity sections', () => {
    cy.contains('Study Activities')
    cy.contains('Word Groups')
    cy.contains('Progress')
  })
}) 