import { getGreeting } from '../support/app.po';

describe('ltp', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to ltp!');
  });
});
