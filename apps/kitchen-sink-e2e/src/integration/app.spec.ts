import { getGreeting } from '../support/app.po';

describe('kitchen-sink', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to our kitchen-sink project!');
  });
});
