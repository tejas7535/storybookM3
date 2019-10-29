export const testScrollToTop = () => {
  cy.visit('/#/dashboard');
  cy.scrollTo('bottom')
    .get('[data-cy=scrollToTop]')
    .should('be', 'visible')
    .click()
    .window()
    .its('pageYOffset')
    .should('equal', 0);
};
