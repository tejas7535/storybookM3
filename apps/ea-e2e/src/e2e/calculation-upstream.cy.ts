describe('EA: CO2 upstream value', () => {
  beforeEach(() => cy.visit('/'));

  it('Should dispaly the upstream value', () => {
    cy.get('ea-calculation-result-preview').contains('1.55');
  });
});
