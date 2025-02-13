import Dashboard from '../../src/pages/Dashboard'

describe('Dashboard', () => {
  beforeEach(() => {
    cy.mount(<Dashboard />)
  })

  it('displays welcome message', () => {
    cy.contains('¡Bienvenidos!').should('be.visible')
  })

  it('shows main sections', () => {
    cy.contains('Study Activities').should('be.visible')
    cy.contains('Word Groups').should('be.visible')
    cy.contains('Progress').should('be.visible')
  })

  it('displays stats', () => {
    cy.get('[data-testid="stats-card"]').should('have.length.at.least', 1)
  })
}) 