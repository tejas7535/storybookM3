import {
  testPageNotFound,
  testScrollToTop
} from '@schaeffler/shared/cypress-utils';

describe('Misc', () => {
  context('Desktop View', () => {
    context('Page not Found', () => {
      testPageNotFound('/#/test', '/home');
    });

    context('Scroll to Top', () => {
      it('should scroll back to top', () => {
        testScrollToTop('/#/home');
      });
    });
  });

  context('Mobile View', () => {
    beforeEach(() => {
      cy.viewport('iphone-6+');
    });
    context('Scroll to Top', () => {
      it('should scroll back to top', () => {
        testScrollToTop('/#/home');
      });
    });
  });
});
