export const testPageNotFound = (
  nonExistentUrl: string,
  redirectUri: string
) => {
  it('should route to 404 Page and return back to home', () => {
    cy.visit(nonExistentUrl);

    cy.get('#pageNotFound')
      .should('be.visible')
      .get('[data-cy="visitHome"]')
      .click()
      .url()
      .should('include', redirectUri);
  });
};
