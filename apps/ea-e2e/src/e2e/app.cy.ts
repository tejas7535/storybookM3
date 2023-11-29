describe('ea', () => {
  beforeEach(() => cy.visit('/'));

  it('should display operating conditions heading', () => {
    cy.get('.end-to-end-test-element').contains(
      'Operating conditions for bearing'
    );
  });
});
