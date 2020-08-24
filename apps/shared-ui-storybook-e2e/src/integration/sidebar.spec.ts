describe('Sidebar', () => {
  beforeEach(() => cy.visit('/iframe.html?id=sidebar--with-sidebar-elements'));
  context('Desktop View', () => {
    it('should have two nav items', () => {
      cy.get('.sidebar-item-wrapper').should('have.length', 2);
    });
  });

  context('Mobile View', () => {
    beforeEach(() => cy.viewport('iphone-6+'));

    it('should have two nav items', () => {
      cy.get('#burger-menu')
        .click()
        .get('.sidebar-item-wrapper')
        .should('have.length', 2);
    });
  });
});
