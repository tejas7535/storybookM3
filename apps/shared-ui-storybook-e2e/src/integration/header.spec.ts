describe('Header', () => {
  context('Desktop View', () => {
    it('should have burger menu', () => {
      cy.visit('/iframe.html?id=header--with-toggle');

      cy.get('#burger-menu').should('exist');
    });

    it('should have user menu', () => {
      cy.visit('/iframe.html?id=header--with-user-menu');

      cy.get('[data-cy="user-menu"]')
        .click()
        .get('.mat-menu-content')
        .children()
        .should('have.length', 2);
    });
  });

  context('Mobile View', () => {
    beforeEach(() => {
      cy.viewport('iphone-6+');
    });

    it('should have burger menu', () => {
      cy.visit('/iframe.html?id=header--with-toggle');

      cy.get('#burger-menu').should('exist');
    });

    it('should have user menu', () => {
      cy.visit('/iframe.html?id=header--with-user-menu');

      cy.get('[data-cy="user-menu-mobile"]')
        .click()
        .get('.mat-menu-content')
        .children()
        .should('have.length', 2);
    });
  });
});
