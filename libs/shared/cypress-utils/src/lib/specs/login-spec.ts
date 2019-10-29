export const testLogin = (login, username) => {
  it('should check that user name is correct', () => {
    login().visit('/');
    cy.get('#headerUserName')
      .eq(0)
      .invoke('text')
      .should('equal', username);
  });

  it('should logout and back in', () => {
    cy.get('[data-cy=logoutDiv]')
      .click()
      .get('[data-cy=logout]')
      .click()
      .get('#headerUserName')
      .should('not.be.visible');

    login().visit('/');

    cy.get('#headerUserName').should('be.visible');
  });
};
