import { getPlatformTitle } from '../support/app.po';

describe('ga', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    getPlatformTitle().contains('Engineering App');
  });
});
