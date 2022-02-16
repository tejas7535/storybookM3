export const testForbidden = () => {
  cy.visit('/iframe.html?id=forbidden--primary');

  cy.get('[data-cy=visitHome]').should('exist');
};

export const testPageNotFound = () => {
  cy.visit('/iframe.html?id=page-not-found--primary');

  cy.get('[data-cy="pageNotFound"]')
    .should('be.visible')
    .get('[data-cy="visitHome"]')
    .should('exist');
};
