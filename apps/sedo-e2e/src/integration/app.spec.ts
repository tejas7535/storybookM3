import { getPlatformTitle } from '../support/app.po';

describe('sedo', () => {
  beforeEach(() => cy.visit('/'));

  it('should display platform title', () => {
    // Function helper example, see `../support/app.po.ts` file
    getPlatformTitle().contains('SEDO');
  });
});
