import { mount } from 'cypress/react'
import { BrowserRouter } from 'react-router-dom'

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add('mount', (component, options = {}) => {
  const wrapped = <BrowserRouter>{component}</BrowserRouter>
  return mount(wrapped, options)
}) 