import { PRODUCT_SELECTION_STATE_MOCK } from '@ea/testing/mocks';

import { getProductSelection } from './product-selection.selector';

describe('Product Selection Selector', () => {
  const mockState = {
    productSelection: {
      ...PRODUCT_SELECTION_STATE_MOCK,
    },
  };

  describe('getProductSelection', () => {
    it('should return the product selection state', () => {
      expect(getProductSelection(mockState)).toEqual(
        PRODUCT_SELECTION_STATE_MOCK
      );
    });
  });
});
