/* eslint-disable cypress/no-unnecessary-waiting */
import { clickOnFirstItem, getInputElementAndType } from '../support/app.po';

describe('EA: CO2 upstream value', () => {
  const bearingId = '6210-C-2HRS';
  beforeEach(() => {
    cy.viewport(1100, 1000);
    cy.visit('/');
    getInputElementAndType('.mat-mdc-input-element', bearingId);
    cy.wait(2000);
    clickOnFirstItem('.mdc-list-item'); // select bearing from list
    cy.wait(1000); // wait for page navigation
  });

  it('Should dispaly the upstream value', () => {
    cy.get('ea-calculation-result-preview').contains('1.55');
  });
});
