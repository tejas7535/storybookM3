export const getHeadline = () => cy.get('h1');
export const getToastButton = (type: string) =>
  cy.get(`[data-cy="show${type}Toast"]`);
export const getSnackBarContainer = () => cy.get('snack-bar-container');
export const getBanner = () => cy.get('schaeffler-banner');
export const getBannerCloseButton = () => cy.get('#infoBannerButton');
