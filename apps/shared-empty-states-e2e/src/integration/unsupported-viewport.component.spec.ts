describe('shared-empty-states', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=unsupportedviewportcomponent--primary')
  );

  it('should render the component', () => {
    cy.get('schaeffler-unsupported-viewport').should('exist');
  });
});
