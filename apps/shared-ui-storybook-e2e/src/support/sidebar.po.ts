export const testSidebar = (testMobile: boolean) => {
  cy.visit('/iframe.html?id=sidebar--with-sidebar-elements');

  if (testMobile) {
    cy.get('#burger-menu').click();
  }

  cy.get('.sidebar-item-wrapper').should('have.length', 2);
};
