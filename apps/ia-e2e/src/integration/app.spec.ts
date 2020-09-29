import { getPlatformTitle } from '../support/app.po';

describe('ia', () => {
  beforeEach(() => cy.visit('/'));

  it('should display platform title', () => {
    // Function helper example, see `../support/app.po.ts` file
    getPlatformTitle().contains('Insight Attrition');
  });
});
