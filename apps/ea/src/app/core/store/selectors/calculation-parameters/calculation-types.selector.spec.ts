import {
  CATALOG_BEARING_TYPE,
  SLEWING_BEARING_TYPE,
} from '@ea/shared/constants/products';
import { APP_STATE_MOCK } from '@ea/testing/mocks';

import {
  getCalculationTypesConfig,
  getCalculationTypesGlobalSelectionState,
} from './calculation-types.selector';

describe('Calculation Types Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
  };

  describe('getCalculationTypesGlobalSelectionState', () => {
    it('should return the operation conditions', () => {
      expect(
        getCalculationTypesGlobalSelectionState(mockState)
      ).toMatchSnapshot();
    });
  });

  describe('getCalculationTypesConfig', () => {
    it('should return the operation conditions', () => {
      expect(getCalculationTypesConfig(mockState)).toMatchSnapshot();
    });

    it('should use slewingBearingFriction label for slewing bearings', () => {
      const slewingBearingState = {
        ...mockState,
        productSelection: {
          ...mockState.productSelection,
          bearingProductClass: SLEWING_BEARING_TYPE,
        },
      };

      const result = getCalculationTypesConfig(slewingBearingState);
      const frictionalPowerlossItem = result.find(
        (item) => item.name === 'frictionalPowerloss'
      );

      expect(frictionalPowerlossItem?.label).toBe(
        'calculationTypes.slewingBearingFriction'
      );
    });

    it('should use frictionalPowerloss label for catalog bearings', () => {
      const catalogBearingState = {
        ...mockState,
        productSelection: {
          ...mockState.productSelection,
          bearingProductClass: CATALOG_BEARING_TYPE,
        },
      };

      const result = getCalculationTypesConfig(catalogBearingState);
      const frictionalPowerlossItem = result.find(
        (item) => item.name === 'frictionalPowerloss'
      );

      expect(frictionalPowerlossItem?.label).toBe(
        'calculationTypes.frictionalPowerloss'
      );
    });
  });
});
