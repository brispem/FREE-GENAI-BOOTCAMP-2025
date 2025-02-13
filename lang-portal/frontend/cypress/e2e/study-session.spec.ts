describe('Study Sessions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('can start a study session', () => {
    cy.get('nav').contains('Study Activities').click();
    cy.get('[data-testid="activity-card"]').first().click();
    cy.url().should('include', '/study');
  });
}); 