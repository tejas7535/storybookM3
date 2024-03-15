/* eslint-disable cypress/no-unnecessary-waiting */
import { clickOnFirstItem, getInputElementAndType } from '../support/app.po';

describe('ea', () => {
  const bearingId = '6210-C-2HRS';
  beforeEach(() => {
    cy.viewport(1100, 1000);
    cy.visit('/');
    cy.wait(1000);
  });

  it('should display app Heading', () => {
    cy.get('h1').contains('medias EasyCalc');
  });

  it('should have a list item', () => {
    cy.wait(1000);
    getInputElementAndType('.mat-mdc-input-element', bearingId);
    cy.wait(500);
    clickOnFirstItem('.mdc-list-item'); // select bearing from list
  });
});
