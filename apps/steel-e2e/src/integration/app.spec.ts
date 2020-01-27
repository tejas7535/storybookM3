describe('steel', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('h3').contains('STEEL');
  });
});
