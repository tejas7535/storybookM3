import { ProductType, QuotationDetail } from '@gq/shared/models';
import { UpdateFPricingDataRequest } from '@gq/shared/models/f-pricing';

import {
  F_PRICING_COMPARABLE_MATERIALS_MOCK,
  F_PRICING_COMPARABLE_MATERIALS_MOCK_FOR_DISPLAYING,
} from '../../../../testing/mocks/models/fpricing/f-pricing-comparable-materials.mock';
import {
  MARKET_VALUE_DRIVERS_BE_RESPONSE_MOCK,
  MARKET_VALUE_DRIVERS_FOR_DISPLAY_MOCK,
  MARKET_VALUE_DRIVERS_MOCK,
} from '../../../../testing/mocks/models/fpricing/market-value-drivers.mock';
import { MARKET_VALUE_DRIVERS_SELECTIONS_MOCK } from '../../../../testing/mocks/models/fpricing/market-value-drivers-selections.mock';
import {
  MATERIAL_INFORMATION_EXTENDED_MOCK,
  MATERIAL_INFORMATION_MOCK,
} from '../../../../testing/mocks/models/fpricing/material-information.mock';
import { SANITY_CHECK_MARGINS_MOCK } from '../../../../testing/mocks/models/fpricing/sanity-check-margins.mock';
import {
  TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK,
  TECHNICAL_VALUE_DRIVERS_MOCK,
} from '../../../../testing/mocks/models/fpricing/technical-value-drivers.mock';
import { F_PRICING_STATE_MOCK } from '../../../../testing/mocks/state/f-pricing-state.mock';
import {
  FPricingComparableMaterials,
  Material,
} from '../reducers/transactions/models/f-pricing-comparable-materials.interface';
import { FPricingActions } from './f-pricing.actions';
import {
  calculatePriceRecommendationAfterForSanityChecks,
  fPricingFeature,
  FPricingState,
  getDeltaByInformationKeyAndPropertyKey,
  getNumberOfDeltasByInformationKey,
  initialState,
  notLastOptionSelected,
} from './f-pricing.reducer';
import { MarketValueDriverWarningLevel } from './models/market-value-driver-warning-level.enum';
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
    test('should set loading state for fPricing data', () => {
      const result = fPricingFeature.reducer(
        initialState,
        FPricingActions.loadFPricingData({ gqPositionId: 'test' })
      );

      expect(result).toEqual({
        ...initialState,
        fPricingDataLoading: true,
      });
    });
    test('should set data for fPricing data', () => {
      const result = fPricingFeature.reducer(
        initialState,
        FPricingActions.loadFPricingDataSuccess({
          data: {
            gqPositionId: 'test',
            referencePrice: 100_000,
            productType: ProductType.CRB,
            marketValueDrivers: MARKET_VALUE_DRIVERS_BE_RESPONSE_MOCK,
            technicalValueDrivers: null,
            sanityCheckMargins: null,
          },
        })
      );

      const marketValueDriverSelections =
        MARKET_VALUE_DRIVERS_BE_RESPONSE_MOCK.map((value) => ({
          questionId: value.questionId,
          selectedOptionId: value.selectedOptionId,
          surcharge: value.options.find(
            (option) => option.optionId === value.selectedOptionId
          ).surcharge,
        }));

      expect(result).toEqual({
        ...initialState,
        sanityCheckMargins: null,
        gqPositionId: 'test',
        referencePrice: 100_000,
        productType: ProductType.CRB,
        marketValueDrivers: MARKET_VALUE_DRIVERS_BE_RESPONSE_MOCK,
        technicalValueDrivers: null,
        marketValueDriversSelections: marketValueDriverSelections,
      });
    });
    test('should set error for fPricing data', () => {
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

    test('should set loading state for comparable transactions', () => {
      const result = fPricingFeature.reducer(
        initialState,
        FPricingActions.loadComparableTransactions({ gqPositionId: 'test' })
      );

      expect(result).toEqual({
        ...initialState,
        comparableTransactionsLoading: true,
      });
    });

    test('should set data for comparable transactions', () => {
      const data = [
        {
          gqPositionId: 'test',
          material: {} as Material,
          similarityScore: 0,
          transactions: [],
        } as FPricingComparableMaterials,
      ];
      const result = fPricingFeature.reducer(
        initialState,
        FPricingActions.loadComparableTransactionsSuccess({
          data,
        })
      );

      expect(result).toEqual({
        ...initialState,
        comparableTransactions: data,
      });
    });

    test('should set error for comparable transactions', () => {
      const result = fPricingFeature.reducer(
        initialState,
        FPricingActions.loadComparableTransactionsFailure({
          error: new Error('test'),
        })
      );

      expect(result).toEqual({
        ...initialState,
        error: new Error('test'),
      });
    });
    test('should set update FPricing state', () => {
      const state: FPricingState = F_PRICING_STATE_MOCK;

      const result = fPricingFeature.reducer(
        state,
        FPricingActions.updateFPricing({ gqPositionId: '1234' })
      );

      expect(result).toEqual({
        ...state,
        fPricingDataLoading: true,
      });
    });
    test('should set technicalValueDriversToUpdate', () => {
      const result = fPricingFeature.reducer(
        initialState,
        FPricingActions.updateTechnicalValueDriver({
          technicalValueDriver: {
            description: 'test',
            id: 1,
            value: '5%',
            editableValue: 5,
            editableValueUnit: '%',
          },
        })
      );

      expect(result).toEqual({
        ...initialState,
        technicalValueDriversToUpdate: [
          {
            description: 'test',
            id: 1,
            value: '5%',
            editableValue: 5,
            editableValueUnit: '%',
          },
        ],
      });
    });
    test('should set SanityCheckValue', () => {
      const result = fPricingFeature.reducer(
        initialState,
        FPricingActions.setSanityCheckValue({ value: 100 })
      );
      expect(result).toEqual({
        ...initialState,
        sanityCheckValue: 100,
      });
    });
  });

  describe('extraSelectors', () => {
    test('should return the base material information and calculate data for the deltas', () => {
      const result = fPricingFeature.getMaterialInformationExtended.projector(
        MATERIAL_INFORMATION_MOCK
      );

      expect(result).toEqual(MATERIAL_INFORMATION_EXTENDED_MOCK);
    });

    test('getComparableTransactionsForDisplaying', () => {
      const result =
        fPricingFeature.getComparableTransactionsForDisplaying.projector(
          F_PRICING_COMPARABLE_MATERIALS_MOCK
        );
      expect(result).toEqual(
        F_PRICING_COMPARABLE_MATERIALS_MOCK_FOR_DISPLAYING
      );
    });
    test('getComparableTransactionsAvailable', () => {
      const result =
        fPricingFeature.getComparableTransactionsAvailable.projector(
          F_PRICING_COMPARABLE_MATERIALS_MOCK_FOR_DISPLAYING
        );
      expect(result).toEqual(true);
    });

    describe('getMarketValueDriverForDisplay', () => {
      test('should return the market value drivers for display', () => {
        const result = fPricingFeature.getMarketValueDriverForDisplay.projector(
          MARKET_VALUE_DRIVERS_MOCK,
          MARKET_VALUE_DRIVERS_SELECTIONS_MOCK
        );
        expect(result).toEqual(MARKET_VALUE_DRIVERS_FOR_DISPLAY_MOCK);
      });
    });

    describe('getAnyMarketValueDriverSelected', () => {
      test('should return true if any market value driver is selected other than the last option (only initial Values)', () => {
        const result =
          fPricingFeature.getAnyMarketValueDriverSelected.projector(
            [
              {
                questionId: 1,
                selectedOptionId: 1,
                productType: ProductType.CRB,
                options: [
                  { optionId: 1, surcharge: 10 },
                  { optionId: 2, surcharge: 20 },
                  { optionId: 3, surcharge: 30 },
                  { optionId: 4, surcharge: 40 },
                ],
              },
            ],
            [{ questionId: 1, selectedOptionId: 1, surcharge: 10 }]
          );
        expect(result).toBe(true);
      });
      test('should return false if the last option is selected (only initial Values)', () => {
        const result =
          fPricingFeature.getAnyMarketValueDriverSelected.projector(
            [
              {
                questionId: 1,
                selectedOptionId: 4,
                productType: ProductType.CRB,
                options: [
                  { optionId: 1, surcharge: 10 },
                  { optionId: 2, surcharge: 20 },
                  { optionId: 3, surcharge: 30 },
                  { optionId: 4, surcharge: 40 },
                ],
              },
            ],
            [{ questionId: 1, selectedOptionId: 4, surcharge: 40 }]
          );
        expect(result).toBe(false);
      });
    });

    describe('getAllMarketValueDriverSelected', () => {
      test('should return false if not all initialValues are not set to unkown=false', () => {
        const result =
          fPricingFeature.getAllMarketValueDriverSelected.projector(
            [
              {
                questionId: 1,
                selectedOptionId: 4,
                productType: ProductType.CRB,
                options: [
                  { optionId: 1, surcharge: 10 },
                  { optionId: 2, surcharge: 20 },
                  { optionId: 3, surcharge: 30 },
                  { optionId: 4, surcharge: 40 },
                ],
              },
            ],
            [{ questionId: 1, selectedOptionId: 4, surcharge: 40 }]
          );
        expect(result).toBe(false);
      });
      test('should return true if all initialValues are set to unkown=false', () => {
        const result =
          fPricingFeature.getAllMarketValueDriverSelected.projector(
            [
              {
                questionId: 1,
                selectedOptionId: 1,
                productType: ProductType.CRB,
                options: [
                  { optionId: 1, surcharge: 10 },
                  { optionId: 2, surcharge: 20 },
                  { optionId: 3, surcharge: 30 },
                  { optionId: 4, surcharge: 40 },
                ],
              },
            ],
            [{ questionId: 1, selectedOptionId: 1, surcharge: 10 }]
          );
        expect(result).toBe(true);
      });
    });

    describe('getMarketValueDriverWarningLevel', () => {
      test('Should return COMPLETE if all market value drivers are selected', () => {
        const result =
          fPricingFeature.getMarketValueDriverWarningLevel.projector(
            true,
            true
          );
        expect(result).toBe(MarketValueDriverWarningLevel.COMPLETE);
      });
      test('Should return INCOMPLETE if some  market value drivers are selected', () => {
        const result =
          fPricingFeature.getMarketValueDriverWarningLevel.projector(
            true,
            false
          );
        expect(result).toBe(MarketValueDriverWarningLevel.INCOMPLETE);
      });
      test('Should return UNSET if no market value drivers are selected', () => {
        const result =
          fPricingFeature.getMarketValueDriverWarningLevel.projector(
            false,
            false
          );
        expect(result).toBe(MarketValueDriverWarningLevel.UNSET);
      });
    });

    describe('getDataForUpdateFPricing', () => {
      test('should return the data for update FPricing', () => {
        const SELECTED_PRICE = 12.4;
        const result = fPricingFeature.getDataForUpdateFPricing.projector(
          MARKET_VALUE_DRIVERS_SELECTIONS_MOCK,
          SELECTED_PRICE
        );
        const expected: UpdateFPricingDataRequest = {
          marketValueDriverSelections: MARKET_VALUE_DRIVERS_SELECTIONS_MOCK,
          selectedPrice: SELECTED_PRICE,
        };
        expect(result).toEqual(expected);
      });
    });

    describe('getTechnicalValueDriverForDisplay', () => {
      test('should return the technical value drivers for display', () => {
        const result =
          fPricingFeature.getTechnicalValueDriversForDisplay.projector(
            TECHNICAL_VALUE_DRIVERS_MOCK,
            TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK
          );
        expect(result).toEqual(TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK);
      });
    });

    describe('getMarketValueDriversRelativeValue', () => {
      test('should return market value drivers relative value', () => {
        const result =
          fPricingFeature.getMarketValueDriversRelativeValue.projector(
            MARKET_VALUE_DRIVERS_SELECTIONS_MOCK
          );
        const expected = MARKET_VALUE_DRIVERS_SELECTIONS_MOCK.reduce(
          (acc, option) => acc + option.surcharge,
          0
        );
        expect(result).toEqual(expected);
      });
    });

    describe('getMarketValueDriversAbsoluteValue', () => {
      test('should return market value drivers absolute value', () => {
        const mvdRelativeValue = MARKET_VALUE_DRIVERS_SELECTIONS_MOCK.reduce(
          (acc, option) => acc + option.surcharge,
          0
        );

        const result =
          fPricingFeature.getMarketValueDriversAbsoluteValue.projector(
            mvdRelativeValue,
            F_PRICING_STATE_MOCK.referencePrice
          );

        const expected =
          F_PRICING_STATE_MOCK.referencePrice * (1 + mvdRelativeValue);
        expect(result).toEqual(expected);
      });
    });

    describe('getTechnicalValueDriverRelativeValue', () => {
      test('should return technical value driver relative value', () => {
        const result =
          fPricingFeature.getTechnicalValueDriverRelativeValue.projector(
            TECHNICAL_VALUE_DRIVERS_MOCK
          );
        expect(result).toEqual(0.23);
      });
    });

    describe('getTechnicalValueDriverValueAbsoluteValue', () => {
      test('should return technical value driver absolute value', () => {
        const tvdRelativeValue = 0.23;
        const result =
          fPricingFeature.getTechnicalValueDriverValueAbsoluteValue.projector(
            tvdRelativeValue,
            F_PRICING_STATE_MOCK.referencePrice
          );
        expect(result).toEqual(
          F_PRICING_STATE_MOCK.referencePrice * (1 + tvdRelativeValue)
        );
      });
    });

    describe('getSanityCheckData', () => {
      test('check for the correct calculation because of the floating number Issue with 0.000000000099', () => {
        const result = 249.43 / (1 - 0.6);
        expect(result.toFixed(3)).toBe('623.575');
      });
      test('should provide the prepared Data for SanityChecks', () => {
        const result = fPricingFeature.getSanityCheckData.projector(
          SANITY_CHECK_MARGINS_MOCK,
          'gqPositionId',
          [
            {
              gqPositionId: 'gqPositionId',
              rfqData: {
                sqv: 100,
              },
            } as unknown as QuotationDetail,
          ],
          125,
          0.8,
          0.5
        );
        expect(result).toEqual({
          lastCustomerPrice: undefined,
          lowerThreshold: 125,
          recommendAfterChecks: 287.5,
          recommendBeforeChecks: 287.5,
          sqv: 100,
          upperThreshold: 500,
        });
      });
    });

    describe('getSanityCheckMarginsForDisplay', () => {
      test('should return the sanity check margins for display', () => {
        const result = fPricingFeature.getSanityChecksForDisplay.projector({
          lastCustomerPrice: undefined,
          lowerThreshold: 125,
          recommendAfterChecks: 287.5,
          recommendBeforeChecks: 287.5,
          sqv: 100,
          upperThreshold: 500,
        });
        expect(result).toEqual([
          { description: 'translate it', id: 1, value: 287.5 },
          { description: 'translate it', id: 2, value: 100 },
          { description: 'translate it', id: 3, value: 125 },
          { description: 'translate it', id: 4, value: undefined },
          { description: 'translate it', id: 5, value: 500 },
          { description: 'translate it', id: 6, value: 287.5 },
        ]);
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

  describe('notLastOptionSelected', () => {
    test('should return true when last option is not selected', () => {
      const marketValueDrivers = [
        {
          questionId: 1,
          selectedOptionId: 4,
          productType: ProductType.CRB,
          options: [
            { optionId: 1, surcharge: 10 },
            { optionId: 2, surcharge: 20 },
            { optionId: 3, surcharge: 30 },
            { optionId: 4, surcharge: 40 },
          ],
        },
      ];

      const selection = { questionId: 1, selectedOptionId: 1, surcharge: 10 };

      const result = notLastOptionSelected(marketValueDrivers, selection);

      expect(result).toEqual(true);
    });

    test('should return false when last option is selected', () => {
      const marketValueDrivers = [
        {
          questionId: 1,
          selectedOptionId: 4,
          productType: ProductType.CRB,
          options: [
            { optionId: 1, surcharge: 10 },
            { optionId: 2, surcharge: 20 },
            { optionId: 3, surcharge: 30 },
            { optionId: 4, surcharge: 40 },
          ],
        },
      ];

      const selection = { questionId: 1, selectedOptionId: 4, surcharge: 40 };

      const result = notLastOptionSelected(marketValueDrivers, selection);

      expect(result).toEqual(false);
    });
  });

  describe('calculatePriceRecommendationAfterForSanityChecks', () => {
    test('should return the value of the price recommendation after sanity checks', () => {
      const result = calculatePriceRecommendationAfterForSanityChecks(
        150,
        124,
        178,
        null
      );

      expect(result).toBe(150);
    });

    test('should return the value of last customer price, after sanity Checks', () => {
      const result = calculatePriceRecommendationAfterForSanityChecks(
        150,
        175,
        225,
        180
      );

      expect(result).toBe(180);
    });

    test('should return the value of the maxThreshold, after sanity Checks', () => {
      const result = calculatePriceRecommendationAfterForSanityChecks(
        250,
        195,
        225,
        null
      );

      expect(result).toBe(225);
    });

    test('should return the value of the maxThreshold, after sanity Checks when customer price and priceRecommendationBeforeChecks is higher than maxThreshold', () => {
      const result = calculatePriceRecommendationAfterForSanityChecks(
        250,
        195,
        225,
        226
      );

      expect(result).toBe(225);
    });

    test('should return the value of the lastCustomerPrice, after sanity Checks', () => {
      const result = calculatePriceRecommendationAfterForSanityChecks(
        196,
        195,
        225,
        224
      );

      expect(result).toBe(224);
    });
    test('should return the value of the maxThreshold when lastCustomerPrice und recPRiceBeforeCheck is higher then maxThreshold', () => {
      const result = calculatePriceRecommendationAfterForSanityChecks(
        300,
        195,
        225,
        300
      );

      expect(result).toBe(225);
    });
  });
});
