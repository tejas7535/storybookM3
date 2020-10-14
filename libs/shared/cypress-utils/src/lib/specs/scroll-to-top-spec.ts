export const testScrollToTop = (url: string) => {
  cy.visit(url);
  cy.get('[data-cy=scrollToTopContainer]').then((container) => {
    if (container) {
      cy.get('[data-cy=scrollToTopContainer]')
        .scrollTo('bottom')
        .get('[data-cy=scrollToTop]')
        .click()
        .get('[data-cy=scrollToTopContainer]')
        .invoke('prop', 'scrollTop')
        .should('equal', 0);
    } else {
      cy.scrollTo('bottom')
        .get('[data-cy=scrollToTop]')
        .click()
        .window()
        .its('pageYOffset')
        .should('equal', 0);
    }
  });
};
