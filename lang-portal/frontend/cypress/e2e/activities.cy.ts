describe('Activities', () => {
  beforeEach(() => {
    cy.visit('/study-activities')
  })

  it('displays activity list', () => {
    cy.contains('Flashcards')
    cy.contains('Word Match')
    cy.contains('Sentence Builder')
  })

  it('can launch an activity', () => {
    cy.get('[data-testid="launch-button-1"]').click()
    cy.url().should('include', '/activities/flashcards')
  })
}) 