import { clickOnFirstItem, getInputElementAndType } from '../support/app.po';

describe('GA', () => {
  const bearingId = '6226';
  beforeEach(() => {
    cy.viewport(1100, 1000);
    cy.visit('/');
  });

  it('should display welcome message', () => {
    cy.get('h1.text-h5').contains('Grease App');
  });

  it('should have a list item', () => {
    getInputElementAndType('.mat-mdc-input-element', bearingId);
    clickOnFirstItem('.mdc-list-item'); // select bearing from list
  });
});
