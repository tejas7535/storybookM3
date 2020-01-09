import {
  getBanner,
  getBannerCloseButton,
  getHeadline,
  getSnackBarContainer,
  getToastButton
} from '../support/app.po';

describe('kitchen-sink', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getHeadline().contains('Home');
  });

  it('should display a footer', () => {
    cy.get('schaeffler-footer').should('not.be.undefined');
  });

  it('should display a success toast on button click', () => {
    getToastButton('Success')
      .contains('Show Success Toast')
      .click();

    getSnackBarContainer()
      .should('exist')
      .should('have.class', 'success-message');
  });

  it('should display a information toast on button click', () => {
    getToastButton('Information')
      .contains('Show Information Toast')
      .click();

    getSnackBarContainer()
      .should('exist')
      .should('have.class', 'info-message');
  });

  it('should display a warning toast on button click', () => {
    getToastButton('Warning')
      .contains('Show Warning Toast')
      .click();

    getSnackBarContainer()
      .should('exist')
      .should('have.class', 'warning-message');
  });

  it('should display a error toast on button click', () => {
    getToastButton('Error')
      .contains('Show Error Toast')
      .click();

    getSnackBarContainer()
      .should('exist')
      .should('have.class', 'error-message');
  });

  it('should open a standard banner', () => {
    getBanner().contains('This is a BannerTextComponent:');
  });

  it('should open custom banner once the default is closed', () => {
    getBannerCloseButton()
      .contains('SHOW ME A CUSTOM ONE')
      .click();

    getBanner().contains('So custom. Much wow.');
  });
});
