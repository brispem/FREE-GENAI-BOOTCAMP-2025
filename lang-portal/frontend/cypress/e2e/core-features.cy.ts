describe('Core Features', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Navigation', () => {
    it('loads dashboard successfully', () => {
      cy.contains('¡Bienvenidos!').should('be.visible')
      cy.contains('Study Activities').should('be.visible')
      cy.contains('Word Groups').should('be.visible')
    })

    it('can navigate to Spanish History', () => {
      cy.contains('Spanish History').click()
      cy.url().should('include', '/history')
      cy.contains('The Rich History of Spanish').should('be.visible')
    })

    it('can return to dashboard', () => {
      cy.contains('Dashboard').click()
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Theme', () => {
    it('toggles dark mode', () => {
      cy.get('button[aria-label="Toggle theme"]').click()
      cy.get('html').should('have.class', 'dark')
    })
  })
}) 