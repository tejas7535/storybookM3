import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import { ProductType } from '@gq/shared/models';
import {
  MarketValueDriver,
  UpdateFPricingDataRequest,
} from '@gq/shared/models/f-pricing';

import {
  F_PRICING_COMPARABLE_MATERIALS_MOCK,
  F_PRICING_COMPARABLE_MATERIALS_MOCK_FOR_DISPLAYING,
} from '../../../../testing/mocks/models/fpricing/f-pricing-comparable-materials.mock';
import {
  MARKET_VALUE_DRIVERS_FOR_DISPLAY_MOCK,
  MARKET_VALUE_DRIVERS_MOCK,
} from '../../../../testing/mocks/models/fpricing/market-value-drivers.mock';
import { MARKET_VALUE_DRIVERS_SELECTIONS_MOCK } from '../../../../testing/mocks/models/fpricing/market-value-drivers-selections.mock';
import {
  MATERIAL_INFORMATION_EXTENDED_MOCK,
  MATERIAL_INFORMATION_MOCK,
} from '../../../../testing/mocks/models/fpricing/material-information.mock';
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
  createAggregatedList,
  fPricingFeature,
  FPricingState,
  getDeltaByInformationKeyAndPropertyKey,
  getNumberOfDeltasByInformationKey,
  initialState,
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
            marketValueDrivers: null,
            technicalValueDrivers: null,
          },
        })
      );

      expect(result).toEqual({
        ...initialState,
        gqPositionId: 'test',
        referencePrice: 100_000,
        productType: ProductType.CRB,
        marketValueDrivers: null,
        technicalValueDrivers: null,
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
          F_PRICING_COMPARABLE_MATERIALS_MOCK
        );
      expect(result).toEqual(true);
    });

    describe('getMarketValueDriverForDisplay', () => {
      test('should return the market value drivers for display', () => {
        const result = fPricingFeature.getMarketValueDriverForDisplay.projector(
          MARKET_VALUE_DRIVERS_MOCK
        );
        expect(result).toEqual(MARKET_VALUE_DRIVERS_FOR_DISPLAY_MOCK);
      });
    });
    describe('getAggregatedMarketValueDrivers', () => {
      test('should return only dbValues when user selections are empty', () => {
        const expectedAggregateList = [
          {
            questionId: 1,
            unknown: false,
          },
          {
            questionId: 2,
            unknown: false,
          },
          {
            questionId: 3,
            unknown: false,
          },
          {
            questionId: 4,
            unknown: true,
          },
          {
            questionId: 5,
            unknown: true,
          },
        ];
        const result =
          fPricingFeature.getAggregatedMarketValueDrivers.projector(
            MARKET_VALUE_DRIVERS_MOCK,
            []
          );
        expect(result).toEqual(expectedAggregateList);
      });

      test('should return the aggregated list of market value drivers and userSelections', () => {
        const expectedAggregateList = [
          {
            questionId: 1,
            unknown: false,
          },
          {
            questionId: 2,
            unknown: false,
          },
          {
            questionId: 3,
            unknown: false,
          },
          {
            questionId: 4,
            unknown: false,
          },
          {
            questionId: 5,
            unknown: false,
          },
        ];
        const result =
          fPricingFeature.getAggregatedMarketValueDrivers.projector(
            MARKET_VALUE_DRIVERS_MOCK,
            [
              {
                questionId: 4,
                selectedOptionId: 2,
              },
              {
                questionId: 5,
                selectedOptionId: 2,
              },
            ]
          );
        expect(result).toEqual(expectedAggregateList);
      });
    });

    describe('getAnyMarketValueDriverSelected', () => {
      test('should return true if any market value driver is selected other than the last option (only initial Values)', () => {
        const result =
          fPricingFeature.getAnyMarketValueDriverSelected.projector([
            { questionId: 1, unknown: false },
          ]);
        expect(result).toBe(true);
      });
      test('should return false if the last option is selected (only initial Values)', () => {
        const result =
          fPricingFeature.getAnyMarketValueDriverSelected.projector([
            { questionId: 1, unknown: true },
          ]);
        expect(result).toBe(false);
      });

      test('should return true, if any initial value is selected and and userSelections are present', () => {
        const result =
          fPricingFeature.getAnyMarketValueDriverSelected.projector([
            { questionId: 1, unknown: false },
          ]);
        expect(result).toBe(true);
      });
    });

    describe('getAllMarketValueDriverSelected', () => {
      test('should return false if not all initialValues are not set to unkown=false', () => {
        const result =
          fPricingFeature.getAllMarketValueDriverSelected.projector([
            { questionId: 1, unknown: true },
          ]);
        expect(result).toBe(false);
      });
      test('should return true if all initialValues are set to unkown=false', () => {
        const result =
          fPricingFeature.getAllMarketValueDriverSelected.projector([
            { questionId: 1, unknown: false },
          ]);
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

  describe('createAggregatedList', () => {
    test('Should aggregate the list of market value drivers and userSelections', () => {
      const mvd_DB = [
        {
          questionId: 1,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 2,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 3,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 4,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 5,
          selectedOptionId: 3,
          options: [{}, {}, {}],
        } as MarketValueDriver,
      ];
      const mvd_user = [
        {
          questionId: 1,
          selectedOptionId: 2,
        },
        {
          questionId: 2,
          selectedOptionId: 2,
        },
      ];
      const expectedAggregatedList = [
        {
          questionId: 1,
          unknown: false,
        },
        {
          questionId: 2,
          unknown: false,
        },
        {
          questionId: 3,
          unknown: true,
        },
        {
          questionId: 4,
          unknown: true,
        },
        {
          questionId: 5,
          unknown: true,
        },
      ];

      const result = createAggregatedList(mvd_DB, mvd_user);
      expect(result).toEqual(expectedAggregatedList);
    });

    test('should return the DB list, if no userSelections are present', () => {
      const mvd_DB = [
        {
          questionId: 1,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 2,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 3,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 4,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 5,
          selectedOptionId: 3,
          options: [{}, {}, {}],
        } as MarketValueDriver,
      ];
      const mvd_user: MarketValueDriverSelection[] = [];
      const expectedAggregatedList = [
        {
          questionId: 1,
          unknown: true,
        },
        {
          questionId: 2,
          unknown: true,
        },
        {
          questionId: 3,
          unknown: true,
        },
        {
          questionId: 4,
          unknown: true,
        },
        {
          questionId: 5,
          unknown: true,
        },
      ];
      const result = createAggregatedList(mvd_DB, mvd_user);
      expect(result).toEqual(expectedAggregatedList);
    });

    test('should return the userSelections, if for each DB item there a userSelection item', () => {
      const mvd_DB = [
        {
          questionId: 1,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 2,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 3,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 4,
          selectedOptionId: 4,
          options: [{}, {}, {}, {}],
        } as MarketValueDriver,
        {
          questionId: 5,
          selectedOptionId: 3,
          options: [{}, {}, {}],
        } as MarketValueDriver,
      ];
      const mvd_user = [
        {
          questionId: 1,
          selectedOptionId: 2,
        },
        {
          questionId: 2,
          selectedOptionId: 2,
        },
        {
          questionId: 3,
          selectedOptionId: 4,
        },
        {
          questionId: 4,
          selectedOptionId: 4,
        },
        {
          questionId: 5,
          selectedOptionId: 3,
        },
      ];
      const expectedResult = [
        {
          questionId: 1,
          unknown: false,
        },
        {
          questionId: 2,
          unknown: false,
        },
        {
          questionId: 3,
          unknown: true,
        },
        {
          questionId: 4,
          unknown: true,
        },
        {
          questionId: 5,
          unknown: true,
        },
      ];

      const result = createAggregatedList(mvd_DB, mvd_user);
      expect(result).toEqual(expectedResult);
    });
  });
});
