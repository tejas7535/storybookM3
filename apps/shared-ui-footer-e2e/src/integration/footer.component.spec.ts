describe('shared-ui-footer', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=footercomponent--primary&knob-footerLinks')
  );

  xit('should render the component', () => {
    cy.get('schaeffler-footer').should('exist');
  });
});
