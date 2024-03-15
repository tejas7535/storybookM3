export const testHeaderWithBurgerMenu = () => {
  cy.visit('/iframe.html?id=header--with-toggle');

  cy.get('#burger-menu').should('exist');
};

export const testHeaderWithUserMenu = (testMobile: boolean) => {
  const selector = testMobile
    ? '[data-cy="user-menu-mobile"]'
    : '[data-cy="user-menu"]';
  cy.visit('/iframe.html?id=header--with-user-menu');

  cy.get(selector).click();
  cy.get(selector).get('.mat-menu-content').children().should('have.length', 2);
};
