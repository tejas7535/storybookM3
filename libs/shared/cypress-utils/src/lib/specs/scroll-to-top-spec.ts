export const testScrollToTop = (url: string) => {
  cy.visit(url);
  cy.scrollTo('bottom')
    .get('[data-cy=scrollToTop]')
    .should('be', 'visible')
    .click()
    .window()
    .its('pageYOffset')
    .should('equal', 0);
};
