export const testPrimaryBanner = () => {
  cy.visit('/iframe.html?id=banner--info');
};

export const testExpandedBanner = () => {
  cy.visit('/iframe.html?id=banner--expanded');
};
