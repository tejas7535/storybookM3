import { testScrollToTop } from '@schaeffler/shared/cypress-utils';

describe('Misc', () => {
  context('Desktop View', () => {
    context('Scroll to Top', () => {
      it('should scroll back to top', () => {
        testScrollToTop();
      });
    });
  });

  context('Mobile View', () => {
    beforeEach(() => {
      cy.viewport('iphone-6+');
    });
    context('Scroll to Top', () => {
      it('should scroll back to top', () => {
        testScrollToTop();
      });
    });
  });
});
