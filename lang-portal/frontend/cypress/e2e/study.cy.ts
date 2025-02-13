describe('Study Flow', () => {
  it('can start a study session', () => {
    cy.visit('/study-activities')
    cy.contains('Flashcards').click()
    cy.contains('Start Study').click()
    cy.url().should('include', '/practice')
  })

  it('can complete a study session', () => {
    cy.visit('/study-activities')
    cy.contains('Flashcards').click()
    cy.contains('Start Study').click()
    
    // Complete the session
    cy.get('[data-testid="answer-correct"]').click()
    cy.contains('Session Complete')
  })
}) 