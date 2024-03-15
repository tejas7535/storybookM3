describe('LSA', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('h1.text-h6').contains('Lubricator Selection Assistant');
  });
});
