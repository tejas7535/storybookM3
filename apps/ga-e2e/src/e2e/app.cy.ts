describe('ga', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    cy.get('h1.text-h5').contains('Grease App');
  });
});
