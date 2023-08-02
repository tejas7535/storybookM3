describe('EA: CO2 downstream values', () => {
  const reportSectionValueMapping: Record<string, string[]> = {
    'Rating life': ['135,000', '6,770,000', '1,500', '2,000', '15.5'],
    'Frictional power loss': ['0.182', '38.1', '28'],
  };

  beforeEach(() => {
    cy.viewport(1100, 1000);
    cy.visit('/');

    // enable all calcuations
    cy.get('ea-calculation-types-selection mat-checkbox').first().click();

    // enter some data
    cy.get('#mat-input-0').type('1500'); // radial load
    cy.get('#mat-input-2').type('2000'); // rotation speed
  });

  it(
    'should show results in in preview',
    { defaultCommandTimeout: 15000 },
    () => {
      // rating life
      cy.get('ea-calculation-result-preview').contains('135,000');

      // operation co2
      cy.get('ea-calculation-result-preview').contains('0.182');

      // frictional power loss
      cy.get('ea-calculation-result-preview').contains('111');
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
