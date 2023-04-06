import { PRODUCT_SELECTION_STATE_MOCK } from '@ea/testing/mocks';

import {
  getBearingDesignation,
  getBearingId,
} from './product-selection.selector';

describe('Product Selection Selector', () => {
  const mockState = {
    productSelection: {
      ...PRODUCT_SELECTION_STATE_MOCK,
    },
  };

  describe('getBearingDesignation', () => {
    it('should return bearing designation', () => {
      expect(getBearingDesignation(mockState)).toEqual(
        PRODUCT_SELECTION_STATE_MOCK.bearingDesignation
      );
    });
  });

  describe('getBearingId', () => {
    it('should return bearing id', () => {
      expect(getBearingId(mockState)).toEqual(
        PRODUCT_SELECTION_STATE_MOCK.bearingId
      );
    });
  });
});
