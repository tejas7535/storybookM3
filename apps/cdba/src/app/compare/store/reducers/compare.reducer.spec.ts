import { Calculation, ExcludedCalculations } from '@cdba/shared/models';
import { ComparableItemIdentifier } from '@cdba/shared/models/comparison.model';
import {
  BOM_IDENTIFIER_MOCK,
  BOM_MOCK,
  CALCULATIONS_MOCK,
  COMPARE_STATE_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
  REFERENCE_TYPE_MOCK,
} from '@cdba/testing/mocks';
import { COMPARISON_MOCK } from '@cdba/testing/mocks/models/comparison-summary.mock';

import {
  CompareActions,
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCalculations,
  loadComparisonSummary,
  loadComparisonSummaryFailure,
  loadComparisonSummarySuccess,
  loadCostComponentSplit,
  loadCostComponentSplitFailure,
  loadCostComponentSplitSuccess,
  loadProductDetails,
  loadProductDetailsFailure,
  loadProductDetailsSuccess,
  selectBomItem,
  selectCalculation,
  toggleSplitType,
} from '../actions/';
import { loadComparisonFeatureData } from '../actions/root/compare-root.actions';
import { compareReducer, CompareState, initialState } from './compare.reducer';

describe('Compare Reducer', () => {
  let action: CompareActions;
  let state: CompareState;
  let expected: any;

  const mockState = COMPARE_STATE_MOCK;

  afterEach(() => {
    action = undefined;
    state = undefined;
    expected = undefined;
  });

  describe('Compare root actions', () => {
    describe('loadComparisonFeatureData', () => {
      const compareItems: ComparableItemIdentifier[] = [
        {
          referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
          selectedCalculationId: '0',
        },
        {
          referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
          selectedCalculationId: '7',
        },
      ];
      it('should set reftypes identifier and selected nodeid at correct index', () => {
        action = loadComparisonFeatureData({ items: compareItems });
        expected = REFERENCE_TYPE_IDENTIFIER_MOCK;

        state = compareReducer(initialState, action);

        expect(state[0].referenceType).toEqual(expected);
        expect(state[1].referenceType).toEqual(expected);

        expect(state[0].calculations.selectedNodeId).toEqual('0');
        expect(state[1].calculations.selectedNodeId).toEqual('7');
      });
    });
  });

  describe('Product Details Actions', () => {
    describe('loadProductDetails', () => {
      const referenceTypeIdentifier = REFERENCE_TYPE_IDENTIFIER_MOCK;

      it('should reset item & errorMessage and set loading true', () => {
        const index = 1;
        action = loadProductDetails({ index, referenceTypeIdentifier });

        state = compareReducer(mockState, action);

        expect(state[index].details.loading).toBeTruthy();
        expect(state[index].details.item).toBeUndefined();
        expect(state[index].details.errorMessage).toBeUndefined();
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        action = loadProductDetails({ index, referenceTypeIdentifier });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('loadProductDetailsSuccess', () => {
      const item = REFERENCE_TYPE_MOCK;

      it('should set item and set loading false', () => {
        const index = 1;
        action = loadProductDetailsSuccess({ index, item });

        state = compareReducer(mockState, action);

        expect(state[index].details.loading).toBeFalsy();
        expect(state[index].details.item).toEqual(item);
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        action = loadProductDetailsSuccess({ index, item });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('loadProductDetailsFailure', () => {
      const errorMessage = 'Oops';
      const statusCode = 418;

      it('should set error and set loading false', () => {
        const index = 1;
        action = loadProductDetailsFailure({ index, errorMessage, statusCode });

        state = compareReducer(mockState, action);

        expect(state[index].details.loading).toBeFalsy();
        expect(state[index].details.errorMessage).toEqual(errorMessage);
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        action = loadProductDetailsFailure({ index, errorMessage, statusCode });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });
  });

  describe('Bom Actions', () => {
    describe('loadBom', () => {
      const bomIdentifier = BOM_IDENTIFIER_MOCK;
      it('should set loading to true', () => {
        const index = 1;
        action = loadBom({ index, bomIdentifier });

        state = compareReducer(mockState, action);

        expect(state[index].billOfMaterial.loading).toBeTruthy();
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        action = loadBom({ index, bomIdentifier });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });
    describe('loadBomSuccess', () => {
      it('should set items and switch off loading for correct material', () => {
        const index = 1;
        action = loadBomSuccess({ index, items: BOM_MOCK });
        expected = BOM_MOCK;

        state = compareReducer(mockState, action);

        expect(state[index].billOfMaterial.loading).toBeFalsy();
        expect(state[index].billOfMaterial.items).toEqual(expected);
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        action = loadBomSuccess({ index, items: undefined });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('loadBomFailure', () => {
      const errorMessage = 'Something went wrong!';
      const statusCode = 500;
      it('should set items to empty [] and switch off loading for correct material', () => {
        const index = 1;
        action = loadBomFailure({ errorMessage, statusCode, index });

        state = compareReducer(mockState, action);

        expect(state[index].billOfMaterial.loading).toBeFalsy();
        expect(state[index].billOfMaterial.items).toEqual([]);
        expect(state[index].billOfMaterial.errorMessage).toEqual(errorMessage);
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        action = loadBomFailure({ index, statusCode, errorMessage });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('selectBomItem', () => {
      it('should set selected item for provided index', () => {
        const item = BOM_MOCK[3];
        const index = 0;
        expected = item;
        action = selectBomItem({ item, index });

        state = compareReducer(mockState, action);

        expect(state[index].billOfMaterial.selected).toEqual(expected);
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        action = selectBomItem({ item: undefined, index });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });
  });

  describe('Calculation Actions', () => {
    describe('loadCalculations', () => {
      it('should do nothing', () => {
        action = loadCalculations();

        state = compareReducer(initialState, action);

        expect(state).toEqual(initialState);
      });
    });

    describe('loadCalculationHistory', () => {
      const materialNumber = 'foo';
      const plant = '0061';
      it('should set loading for calculations and bom to true', () => {
        const index = 1;
        action = loadCalculationHistory({ materialNumber, plant, index });

        state = compareReducer(mockState, action);

        expect(state[index].calculations.loading).toBeTruthy();
        expect(state[index].billOfMaterial.loading).toBeTruthy();
      });

      it('should reset previous results', () => {
        const index = 0;
        action = loadCalculationHistory({ materialNumber, plant, index });

        state = compareReducer(mockState, action);

        expect(state[index].calculations.items).toBeUndefined();
        expect(state[index].calculations.selected).toBeUndefined();
        expect(state[index].billOfMaterial.items).toBeUndefined();
        expect(state[index].billOfMaterial.selected).toBeUndefined();
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        action = loadCalculationHistory({ materialNumber, plant, index });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('loadCalculationHistorySuccess', () => {
      it('should reset loading and should set items and selected', () => {
        const index = 1;
        const plant = '0060';
        const items = CALCULATIONS_MOCK;
        const excludedItems = EXCLUDED_CALCULATIONS_MOCK;
        action = loadCalculationHistorySuccess({
          items,
          excludedItems,
          plant,
          index,
        });

        const expectedItems = CALCULATIONS_MOCK;
        const expectedSelectedItem = CALCULATIONS_MOCK[0];

        state = compareReducer(mockState, action);

        expect(state[index].calculations.loading).toBeFalsy();
        expect(state[index].calculations.items).toEqual(expectedItems);
        expect(state[index].calculations.selected).toEqual(
          expectedSelectedItem
        );
        expect(state[index].calculations.selectedNodeId).toEqual('0');
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        const plant = '0061';
        const items: Calculation[] = undefined;
        const excludedItems: ExcludedCalculations = undefined;
        action = loadCalculationHistorySuccess({
          items,
          excludedItems,
          plant,
          index,
        });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('loadCalculationHistoryFailure', () => {
      const errorMessage = 'Something bad happened';
      const statusCode = 502;
      it('should reset loading, set empty items and error for calculations and bom', () => {
        const index = 1;
        action = loadCalculationHistoryFailure({
          index,
          statusCode,
          errorMessage,
        });

        state = compareReducer(mockState, action);

        expect(state[index].calculations.errorMessage).toEqual(errorMessage);
        expect(state[index].billOfMaterial.errorMessage).toEqual(errorMessage);

        expect(state[index].calculations.loading).toBeFalsy();
        expect(state[index].billOfMaterial.loading).toBeFalsy();

        expect(state[index].calculations.items).toEqual([]);
        expect(state[index].billOfMaterial.items).toEqual([]);
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        action = loadCalculationHistoryFailure({
          index,
          statusCode,
          errorMessage,
        });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('selectCalculation', () => {
      it('should set values for provided index', () => {
        const index = 0;
        const nodeId = '3';
        const calculation = CALCULATIONS_MOCK[2];

        action = selectCalculation({ index, nodeId, calculation });

        state = compareReducer(mockState, action);

        expect(state[index].calculations.selected).toEqual(calculation);
        expect(state[index].calculations.selectedNodeId).toEqual(nodeId);
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        const nodeId = '3';
        const calculation = CALCULATIONS_MOCK[2];

        action = selectCalculation({ index, nodeId, calculation });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });
  });
  describe('Cost Component Split Actions', () => {
    const bomIdentifier = BOM_IDENTIFIER_MOCK;
    describe('loadCostComponentSplit', () => {
      it('should set loading', () => {
        const index = 0;
        action = loadCostComponentSplit({ bomIdentifier, index });
        state = compareReducer(mockState, action);

        expect(state[index].costComponentSplit.loading).toBeTruthy();
      });

      it('should reset costComponentSplit state', () => {
        const index = 0;
        action = loadCostComponentSplit({ bomIdentifier, index });
        state = compareReducer(mockState, action);

        expect(state[index].costComponentSplit.items).toBeUndefined();
        expect(state[index].costComponentSplit.errorMessage).toBeUndefined();
      });

      it('should return previous state for undefined index', () => {
        const index = 99;

        action = loadCostComponentSplit({ index, bomIdentifier });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('loadCostComponentSplitSuccess', () => {
      const items = COST_COMPONENT_SPLIT_ITEMS_MOCK;
      it('should unset loading and set cost element items', () => {
        const index = 0;

        action = loadCostComponentSplitSuccess({ items, index });

        state = compareReducer(mockState, action);

        expect(state[index].costComponentSplit.loading).toBeFalsy();
        expect(state[index].costComponentSplit.items).toEqual(items);
      });

      it('should return previous state for undefined index', () => {
        const index = 99;

        action = loadCostComponentSplitSuccess({ index, items });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('loadCostComponentSplitFailure', () => {
      const errorMessage = 'FOOO';
      const statusCode = 418;
      it('should unset loading / set error message', () => {
        const index = 0;

        action = loadCostComponentSplitFailure({
          index,
          errorMessage,
          statusCode,
        });

        state = compareReducer(mockState, action);

        expect(state[index].costComponentSplit.loading).toBeFalsy();
        expect(state[index].costComponentSplit.errorMessage).toEqual(
          errorMessage
        );
      });
      it('should return previous state for undefined index', () => {
        const index = 99;

        action = loadCostComponentSplitFailure({
          index,
          errorMessage,
          statusCode,
        });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('toggleSplitType', () => {
      it('should toggle the currently selected split type for every substate', () => {
        action = toggleSplitType();

        state = compareReducer(mockState, action);

        expect(state['0'].costComponentSplit?.selectedSplitType).toEqual('AUX');
      });
    });
  });

  describe('Comparison actions', () => {
    describe('loadComparisonSummary', () => {
      it('should change state when loading comparison summary', () => {
        action = loadComparisonSummary();

        state = compareReducer(mockState, action);

        expect(state.comparison).toEqual({
          details: undefined,
          summary: undefined,
          currency: undefined,
          loading: true,
        });
      });
    });
    describe('loadComparisonSummarySuccess', () => {
      it('should update store state with comparison values', () => {
        action = loadComparisonSummarySuccess({ comparison: COMPARISON_MOCK });

        state = compareReducer(mockState, action);

        expect(state.comparison).toEqual({
          details: COMPARISON_MOCK.details,
          summary: COMPARISON_MOCK.summary,
          currency: COMPARISON_MOCK.currency,
          loading: false,
          errorMessage: '',
        });
      });
    });
    describe('loadComparisonSummaryFailure', () => {
      it('should reset comparison state and update error message', () => {
        const errorMessage = 'Error loading comparison';
        const statusCode = 500;
        action = loadComparisonSummaryFailure({ errorMessage, statusCode });

        state = compareReducer(mockState, action);

        expect(state.comparison).toEqual({
          details: undefined,
          summary: undefined,
          currency: undefined,
          loading: false,
          errorMessage: `${statusCode} ${errorMessage}`,
        });
      });
    });
  });
});
