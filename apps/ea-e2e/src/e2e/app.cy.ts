describe('ea', () => {
  beforeEach(() => cy.visit('/'));

  it('should display app description', () => {
    cy.get('.text-body-1').contains('Our calculation tool allows');
  });
});
