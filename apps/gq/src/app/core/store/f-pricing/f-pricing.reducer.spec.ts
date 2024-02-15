import { ProductType } from '@gq/shared/models';

import {
  MARKET_VALUE_DRIVERS_FOR_DISPLAY_MOCK,
  MARKET_VALUE_DRIVERS_MOCK,
} from '../../../../testing/mocks/models/fpricing/market-value-drivers.mock';
import {
  MATERIAL_INFORMATION_EXTENDED_MOCK,
  MATERIAL_INFORMATION_MOCK,
} from '../../../../testing/mocks/models/fpricing/material-information.mock';
import { FPricingActions } from './f-pricing.actions';
import {
  fPricingFeature,
  getDeltaByInformationKeyAndPropertyKey,
  getNumberOfDeltasByInformationKey,
  initialState,
} from './f-pricing.reducer';
import { PropertyDelta } from './models/property-delta.interface';

describe('fPricingReducer', () => {
  describe('ons', () => {
    test('should reset state', () => {
      const result = fPricingFeature.reducer(
        { ...initialState, error: new Error('test') },
        FPricingActions.resetFPricingData()
      );

      expect(result).toEqual(initialState);
    });
    test('should set loading state', () => {
      const result = fPricingFeature.reducer(
        initialState,
        FPricingActions.loadFPricingData({ gqPositionId: 'test' })
      );

      expect(result).toEqual({
        ...initialState,
        fPricingDataLoading: true,
      });
    });
    test('should set data', () => {
      const result = fPricingFeature.reducer(
        initialState,
        FPricingActions.loadFPricingDataSuccess({
          data: {
            gqPositionId: 'test',
            referencePrice: 100_000,
            productType: ProductType.CRB,
            marketValueDrivers: null,
          },
        })
      );

      expect(result).toEqual({
        ...initialState,
        gqPositionId: 'test',
        referencePrice: 100_000,
        productType: ProductType.CRB,
        marketValueDrivers: null,
      });
    });
    test('should set error', () => {
      const result = fPricingFeature.reducer(
        initialState,
        FPricingActions.loadFPricingDataFailure({
          error: new Error('test'),
        })
      );

      expect(result).toEqual({
        ...initialState,
        error: new Error('test'),
      });
    });
  });
  describe('extraSelectors', () => {
    describe('getMaterialInformation', () => {
      test('should return the base material information and calculate data for the deltas', () => {
        const result = fPricingFeature.getMaterialInformationExtended.projector(
          MATERIAL_INFORMATION_MOCK
        );

        expect(result).toEqual(MATERIAL_INFORMATION_EXTENDED_MOCK);
      });
    });

    describe('getMarketValueDriverForDisplay', () => {
      test('should return the market value drivers for display', () => {
        const result = fPricingFeature.getMarketValueDriverForDisplay.projector(
          MARKET_VALUE_DRIVERS_MOCK
        );
        expect(result).toEqual(MARKET_VALUE_DRIVERS_FOR_DISPLAY_MOCK);
      });
    });

    describe('getAnyMarketValueDriverSelected', () => {
      test('should return true if any market value driver is selected other than the last option', () => {
        const result =
          fPricingFeature.getAnyMarketValueDriverSelected.projector(
            MARKET_VALUE_DRIVERS_MOCK
          );
        expect(result).toBe(true);
      });
      test('should return false if the last option is selected', () => {
        const result =
          fPricingFeature.getAnyMarketValueDriverSelected.projector([
            {
              productType: ProductType.CRB,
              selectedOptionId: 2,
              questionId: 1,
              options: [
                { optionId: 1, surcharge: 10 },
                { optionId: 2, surcharge: 10 },
              ],
            },
            {
              productType: ProductType.CRB,
              selectedOptionId: 2,
              questionId: 2,
              options: [
                { optionId: 1, surcharge: 10 },
                { optionId: 2, surcharge: 10 },
              ],
            },
          ]);
        expect(result).toBe(false);
      });
    });
  });

  describe('getNumberOfDeltasByInformationKey', () => {
    test("should return 2 for 'innerRing'", () => {
      const numberOfDeltas = getNumberOfDeltasByInformationKey(
        'innerRing',
        MATERIAL_INFORMATION_MOCK
      );

      expect(numberOfDeltas).toBe(2);
    });
    test('should return 0 for unknown key', () => {
      const numberOfDeltas = getNumberOfDeltasByInformationKey(
        'unknown',
        MATERIAL_INFORMATION_MOCK
      );

      expect(numberOfDeltas).toBe(0);
    });
  });
  describe('getDeltaByInformationKeyAndPropertyKey', () => {
    test("should return numeric delta for 'innerRing' and 'raceawayDiameter'", () => {
      const delta = getDeltaByInformationKeyAndPropertyKey(
        MATERIAL_INFORMATION_MOCK[0],
        'racewayDiameter'
      );

      const expected: PropertyDelta = {
        isDelta: true,
        absolute: 30,
        relative: 33,
      };
      expect(delta).toEqual(expected);
    });

    test("should return numeric isDelta false for 'innerRing' and 'materialCat'", () => {
      const delta = getDeltaByInformationKeyAndPropertyKey(
        MATERIAL_INFORMATION_MOCK[0],
        'materialCat'
      );

      const expected: PropertyDelta = {
        isDelta: false,
      };
      expect(delta).toEqual(expected);
    });

    test("should return isDelta true for 'outerRing' and 'cageMaterial'", () => {
      const delta = getDeltaByInformationKeyAndPropertyKey(
        MATERIAL_INFORMATION_MOCK[1],
        'cageMaterial'
      );

      const expected: PropertyDelta = {
        isDelta: true,
      };
      expect(delta).toEqual(expected);
    });
  });
});
