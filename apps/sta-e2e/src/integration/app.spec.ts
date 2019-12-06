import { getTitle } from '../support/app.po';

describe('sta', () => {
  beforeEach(() => cy.visit('/'));

  xit('should display welcome message', () => {
    getTitle().contains('Overview');
  });
});
