export const testSettingsSidebar = () => {
  cy.visit('/iframe.html?id=settings-sidebar--primary');

  cy.get('[data-cy=close-settings-sidebar]')
    .click()
    .get('[data-cy=open-settings-sidebar]')
    .click()
    .get('[data-cy=close-settings-sidebar]')
    .should('exist');
};
