import { getPlatformTitle } from '../support/app.po';

describe('ltp', () => {
  beforeEach(() => cy.visit('/'));

  xit('should have title LTP', () => {
    getPlatformTitle().contains('Lifetime Predictor');
  });
});
