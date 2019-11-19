import {
  getHeadline,
  getOpenSnackbarButton,
  getOverlayContainer
} from '../support/app.po';

describe('kitchen-sink', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getHeadline().contains('Home');
  });

  it('should display a footer', () => {
    cy.get('schaeffler-footer').should('not.be.undefined');
  });

  it('should open a snackbar element upon pressing the "Open Snackbar" button', () => {
    getOpenSnackbarButton()
      .contains('Open Snackbar')
      .click();

    getOverlayContainer().should('not.be.empty');
  });
});
