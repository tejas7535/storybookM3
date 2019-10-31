export const testScrollToTop = () => {
  cy.visit('/#/home');
  cy.scrollTo('bottom')
    .get('[data-cy=scrollToTop]')
    .should('be', 'visible')
    .click()
    .window()
    .its('pageYOffset')
    .should('equal', 0);
};
