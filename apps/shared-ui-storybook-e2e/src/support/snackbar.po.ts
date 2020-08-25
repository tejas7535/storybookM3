const getToastButton = (type: string) => cy.get(`[data-cy="show${type}Toast"]`);
const getSnackBarContainer = () => cy.get('snack-bar-container');

export const testSuccessToast = () => {
  cy.visit('/iframe.html?id=snackbar--primary');

  getToastButton('Success').contains('Show Success Toast').click();

  getSnackBarContainer()
    .should('exist')
    .should('have.class', 'success-message');
};

export const testInformationToast = () => {
  cy.visit('/iframe.html?id=snackbar--primary');

  getToastButton('Information').contains('Show Information Toast').click();

  getSnackBarContainer().should('exist').should('have.class', 'info-message');
};

export const testWarningToast = () => {
  cy.visit('/iframe.html?id=snackbar--primary');

  getToastButton('Warning').contains('Show Warning Toast').click();

  getSnackBarContainer()
    .should('exist')
    .should('have.class', 'warning-message');
};

export const testErrorToast = () => {
  cy.visit('/iframe.html?id=snackbar--primary');

  getToastButton('Error').contains('Show Error Toast').click();

  getSnackBarContainer().should('exist').should('have.class', 'error-message');
};
