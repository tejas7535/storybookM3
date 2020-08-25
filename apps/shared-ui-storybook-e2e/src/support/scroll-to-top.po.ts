export const testScrollToTop = () => {
  cy.visit('/iframe.html?id=scrolltotop--primary');

  cy.get('[data-cy=scrollToTopContainer]').then((container) => {
    if (container) {
      cy.get('[data-cy=scrollToTopContainer]')
        .scrollTo('bottom')
        .get('[data-cy=scrollToTop]')
        .should('be', 'visible')
        .click()
        .get('[data-cy=scrollToTopContainer]')
        .invoke('prop', 'scrollTop')
        .should('equal', 0);
    } else {
      cy.scrollTo('bottom')
        .get('[data-cy=scrollToTop]')
        .should('be', 'visible')
        .click()
        .window()
        .its('pageYOffset')
        .should('equal', 0);
    }
  });
};
