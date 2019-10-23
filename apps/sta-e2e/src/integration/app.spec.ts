import { getGreeting } from '../support/app.po';

describe('sta', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to sta!');
  });
});
