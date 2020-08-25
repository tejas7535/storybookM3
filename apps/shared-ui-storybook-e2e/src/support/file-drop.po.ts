export const testEnabledFileDrop = () => {
  cy.visit('/iframe.html?id=file-drop--primary');

  cy.get('[data-cy=select-files-button]').should('exist');
};

export const testDisabledFileDrop = () => {
  cy.visit('/iframe.html?id=file-drop--disabled');

  cy.get('[data-cy=select-files-button]').should('be.be.disabled');
};
