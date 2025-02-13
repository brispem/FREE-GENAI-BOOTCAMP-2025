import { ActivityLauncher } from '../../src/components/ActivityLauncher'

describe('ActivityLauncher', () => {
  beforeEach(() => {
    cy.mount(<ActivityLauncher />)
  })

  it('displays all activities', () => {
    cy.contains('Flashcards').should('be.visible')
    cy.contains('Word Match').should('be.visible')
    cy.contains('Sentence Builder').should('be.visible')
  })

  it('shows activity details', () => {
    cy.contains('Practice vocabulary with interactive flashcards')
    cy.contains('Beginner')
    cy.get('[data-testid="launch-button-1"]').should('be.visible')
  })

  it('launches activity when clicked', () => {
    cy.get('[data-testid="launch-button-1"]').click()
    cy.url().should('include', '/activities/flashcards')
  })

  it('displays correct difficulty levels', () => {
    cy.contains('Beginner').should('exist')
    cy.contains('Intermediate').should('exist')
  })

  it('shows activity icons', () => {
    cy.contains('🎴').should('be.visible')
    cy.contains('🔤').should('be.visible')
    cy.contains('📝').should('be.visible')
  })
}) 