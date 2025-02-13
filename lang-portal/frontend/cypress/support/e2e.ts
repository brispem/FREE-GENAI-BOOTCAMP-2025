/// <reference types="cypress" /> 

// Import commands.js using ES2015 syntax:
import './commands'

declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom commands here
      login(email: string, password: string): Chainable<void>
      // Example: cy.login('user@example.com', 'password123')
    }
  }
} 