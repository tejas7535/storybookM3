/* eslint-disable cypress/no-unnecessary-waiting */
import { clickOnFirstItem, getInputElementAndType } from '../support/app.po';

describe('GA: Calculation Parameters', () => {
  let resultlCount;
  const bearingId = '6226';
  const rationalSpeed = '15';
  beforeEach(() => {
    cy.viewport(1100, 1000);
    cy.visit('/');
    getInputElementAndType('.mat-mdc-input-element', bearingId);

    cy.wait(4000);
    clickOnFirstItem('.mdc-list-item'); // select bearing from list
  });

  it('should have a result panels', { defaultCommandTimeout: 15_000 }, () => {
    cy.location('pathname', { timeout: 10_000 }).should(
      'eq',
      '/grease-calculation/parameters'
    );
    cy.wait(500); // wait for form to be fully loaded

    getInputElementAndType('.mat-mdc-input-element', rationalSpeed);

    clickOnFirstItem('.mat-mdc-select-required'); // expected load
    clickOnFirstItem('.mat-mdc-option'); // select expected load first option (very low)
    cy.wait(3000).get('.mat-mdc-raised-button').last().click({ force: true }); // click on show result button

    cy.wait(7000); // wait for result page to fully load

    cy.get('.mat-expansion-panel-header-title').then(($result) => {
      resultlCount = $result.length;
      expect(resultlCount).to.be.greaterThan(0);
    });

    cy.get('ga-grease-report-result .mdc-button')
      .first()
      .click({ force: true }); // expand the first result
    cy.wait(100);

    // initial grease quantity
    cy.get('ga-grease-report-result').first().contains('315 g');
    cy.get('ga-grease-report-result').first().contains('350 cm³');

    // Quantity of relubrication per 365 days
    cy.get('ga-grease-report-result').first().contains('25.623 g/');
    cy.get('ga-grease-report-result').first().contains('28.47 cm³/');

    // Quantity of relubrication per 1000 operating hours
    cy.get('ga-grease-report-result').first().first().contains('2.925 g/');
    cy.get('ga-grease-report-result').first().first().contains('3.25 cm³/');

    // Grease service life
    cy.get('ga-grease-report-result').first().contains('~ 1,734');

    // Quantity of relubrication per 30 days
    cy.get('ga-grease-report-result').first().contains('2.106 g/');
    cy.get('ga-grease-report-result').first().contains('2.34 cm³/');

    // Viscosity ratio
    cy.get('ga-grease-report-result').first().contains('0.08');

    // Base oil at 40
    cy.get('ga-grease-report-result').first().contains('110 mm²/s');

    // lower temp
    cy.get('ga-grease-report-result').first().contains('-30 °C');

    // upper temp
    cy.get('ga-grease-report-result').first().contains('120 °C');

    // density
    cy.get('ga-grease-report-result').first().contains('0.9 kg/dm³');
  });
});
