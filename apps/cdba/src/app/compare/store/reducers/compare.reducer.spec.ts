import {
  BomItem,
  Calculation,
  ReferenceTypeIdentifier,
} from '@cdba/shared/models';
import {
  BOM_MOCK,
  CALCULATIONS_MOCK,
  COMPARE_STATE_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
} from '@cdba/testing/mocks';

import {
  CompareActions,
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCalculations,
  selectBomItem,
  selectCalculation,
  selectCompareItems,
} from '../actions/compare.actions';
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

  describe('selectCompareItems', () => {
    const compareItems: [
      nodeId: string,
      referenceTypeIdentifier: ReferenceTypeIdentifier
    ][] = [
      ['0', REFERENCE_TYPE_IDENTIFIER_MOCK],
      ['7', REFERENCE_TYPE_IDENTIFIER_MOCK],
    ];
    it('should set reftypes identifier and selected nodeid at correct index', () => {
      action = selectCompareItems({ items: compareItems });
      expected = REFERENCE_TYPE_IDENTIFIER_MOCK;

      state = compareReducer(initialState, action);

      expect(state[0].referenceType).toEqual(expected);
      expect(state[1].referenceType).toEqual(expected);

      expect(state[0].calculations.selectedNodeId).toEqual('0');
      expect(state[1].calculations.selectedNodeId).toEqual('7');
    });
  });

  describe('Bom Actions', () => {
    describe('loadBom', () => {
      it('should set loading to true', () => {
        const index = 2;
        action = loadBom({ index });

        state = compareReducer(mockState, action);

        expect(state[index].billOfMaterial.loading).toBeTruthy();
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        action = loadBom({ index });

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
      it('should set items to empty [] and switch off loading for correct material', () => {
        const index = 1;
        const errorMessage = 'Something went wrong!';
        action = loadBomFailure({ errorMessage, index });

        state = compareReducer(mockState, action);

        expect(state[index].billOfMaterial.loading).toBeFalsy();
        expect(state[index].billOfMaterial.items).toEqual([]);
        expect(state[index].billOfMaterial.errorMessage).toEqual(errorMessage);
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        const errorMessage = 'Something went wrong!';
        action = loadBomFailure({ index, errorMessage });

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
        const item: BomItem = undefined;
        action = selectBomItem({ item, index });

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
      it('should set loading for calculations and bom to true', () => {
        const index = 3;
        action = loadCalculationHistory({ materialNumber, index });

        state = compareReducer(mockState, action);

        expect(state[index].calculations.loading).toBeTruthy();
        expect(state[index].billOfMaterial.loading).toBeTruthy();
      });

      it('should reset previous results', () => {
        const index = 0;
        action = loadCalculationHistory({ materialNumber, index });

        state = compareReducer(mockState, action);

        expect(state[index].calculations.items).toBeUndefined();
        expect(state[index].calculations.selected).toBeUndefined();
        expect(state[index].billOfMaterial.items).toBeUndefined();
        expect(state[index].billOfMaterial.selected).toBeUndefined();
      });

      it('should return previous state for undefined index', () => {
        const index = 99;
        action = loadCalculationHistory({ materialNumber, index });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('loadCalculationHistorySuccess', () => {
      it('should reset loading and should set items and selected', () => {
        const index = 3;
        const items = CALCULATIONS_MOCK;
        action = loadCalculationHistorySuccess({ items, index });

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
        const items: Calculation[] = undefined;
        action = loadCalculationHistorySuccess({ items, index });

        state = compareReducer(mockState, action);

        expect(state).toEqual(mockState);
      });
    });

    describe('loadCalculationHistoryFailure', () => {
      const errorMessage = 'Something bad happened';
      it('should reset loading, set empty items and error for calculations and bom', () => {
        const index = 1;
        action = loadCalculationHistoryFailure({ index, errorMessage });

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
        action = loadCalculationHistoryFailure({ index, errorMessage });

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
});
