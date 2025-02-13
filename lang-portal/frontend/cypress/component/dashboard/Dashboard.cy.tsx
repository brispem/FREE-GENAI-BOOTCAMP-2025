import Dashboard from '../../../src/pages/Dashboard'
import { ThemeProvider } from '../../../src/components/theme-provider'

describe('Dashboard Component', () => {
  beforeEach(() => {
    cy.mount(
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    )
  })

  it('displays welcome message', () => {
    cy.contains('¡Bienvenidos!').should('be.visible')
  })

  it('shows main sections', () => {
    cy.contains('Study Activities').should('be.visible')
    cy.contains('Word Groups').should('be.visible')
  })
}) 