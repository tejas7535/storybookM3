import { getCalculationResultInputGroup } from '../support/app.po';

describe('EA: CO2 downstream values', () => {
  const expectedRatingLife = '181,000';
  const expectedViscosityRating = '2.02';
  const expectedUpstreamEmission = '1.33';
  const expectedOverrollingFrequency = '102';
  const reportSectionValueMapping: Record<string, string[]> = {
    'Rating life': [expectedRatingLife, '9,030,000', '1,500', '1,500', '15.5'],
    'Lubrication Parameters': [expectedViscosityRating, '28', '13.9', '50'],
    'Estimation of': [expectedUpstreamEmission],
    'Overrolling frequencies': [
      expectedOverrollingFrequency,
      '148',
      '66.6',
      '133',
      '10.2',
    ],
  };

  beforeEach(() => {
    cy.viewport(1100, 1000);
    cy.visit('/');

    // enable all calcuations
    cy.get('ea-calculation-types-selection mat-checkbox').first().click();

    cy.wait(100);

    // enter some load data
    getCalculationResultInputGroup('Load')
      .find('.mat-mdc-input-element')
      .first()
      // needs force since maybe covered by label
      .click({ force: true })
      .focused()
      .type('1500'); // radial load

    getCalculationResultInputGroup('Motion Influences')
      .find('.mat-mdc-input-element')
      .first()
      // needs force since maybe covered by label
      .click({ force: true })
      .focused()
      .type('1500'); // rotation speed
  });

  it(
    'should show results in in preview',
    { defaultCommandTimeout: 15000 },
    () => {
      // rating life
      cy.get('ea-calculation-result-preview').contains(expectedRatingLife);

      // lubrication
      cy.get('ea-calculation-result-preview').contains(expectedViscosityRating);

      // upstream emissions
      cy.get('ea-calculation-result-preview').contains(
        expectedUpstreamEmission
      );

      // overrolling frequency
      cy.get('ea-calculation-result-preview').contains(
        expectedOverrollingFrequency
      );
    }
  );

  it(
    'should show results in report for each section',
    { defaultCommandTimeout: 30000 },
    () => {
      // open report when its no longer disabled (-> loading finished)
      cy.wait(500)
        .get('button:not(.mat-button-disabled)')
        .contains('Show Report')
        .click();

      for (const [sectionName, values] of Object.entries(
        reportSectionValueMapping
      )) {
        // find the values in the section with sectionName
        for (const value of values) {
          cy.get('mat-dialog-container mat-expansion-panel-header')
            .contains(sectionName)
            .parentsUntil('ea-expansion-panel')
            .last()
            .contains(value);
        }
      }
    }
  );
});
