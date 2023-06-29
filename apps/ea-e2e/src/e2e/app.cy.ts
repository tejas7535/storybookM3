describe('ea', () => {
  beforeEach(() => cy.visit('/'));

  it('should display app title', () => {
    cy.get('.text-h4').contains('Engineering App');
  });
});
