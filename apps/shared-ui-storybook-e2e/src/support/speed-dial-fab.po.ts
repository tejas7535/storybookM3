export const testSpeedDialFabPrimary = () => {
  cy.visit('/iframe.html?id=speeddialfabbutton--primary');
};

export const testSpeedDialFabWithSecondaryButtons = () => {
  cy.visit('/iframe.html?id=speeddialfabbutton--with-secondary-buttons');
};
