import { getGreeting } from '../support/app.po';

describe('kitchen-sink', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to our kitchen-sink project!');
  });

  it('should display a footer', () => {
    cy.get('schaeffler-footer').should('not.be.undefined');
  });
});
