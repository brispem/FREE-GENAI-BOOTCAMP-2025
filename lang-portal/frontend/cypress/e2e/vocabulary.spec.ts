describe('Vocabulary Management', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('can navigate to vocabulary page', () => {
    cy.get('nav').contains('Words').click();
    cy.url().should('include', '/words');
  });

  it('displays vocabulary list', () => {
    cy.get('nav').contains('Words').click();
    cy.get('[data-testid="word-list"]').should('exist');
  });
}); 