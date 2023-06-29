describe('mm', () => {
  beforeEach(() => cy.visit('/'));

  it('should display platform title', () => {
    // Function helper example, see `../support/app.po.ts` file
    cy.get('mat-toolbar').contains('Mounting Manager');
  });
});
