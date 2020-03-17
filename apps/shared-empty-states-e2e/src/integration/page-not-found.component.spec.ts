describe('shared-empty-states', () => {
  beforeEach(() => cy.visit('/iframe.html?id=pagenotfoundcomponent--primary'));

  xit('should render the component', () => {
    cy.get('schaeffler-page-not-found').should('exist');
  });
});
