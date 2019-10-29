export const testPageNotFound = redirectUri => {
  it('should route to 404 Page and return back to home', () => {
    cy.visit('/#/test');

    cy.get('#pageNotFound')
      .should('be.visible')
      .get('#visitHome')
      .click()
      .url()
      .should('include', redirectUri);
  });
};
