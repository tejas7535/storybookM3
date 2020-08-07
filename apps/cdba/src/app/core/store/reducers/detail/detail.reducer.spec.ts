import {
  BOM_MOCK,
  CALCULATIONS_TYPE_MOCK,
  REFRENCE_TYPE_MOCK,
} from '../../../../../testing/mocks';
import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  selectCalculation,
  selectReferenceType,
} from '../../actions';
import { detailReducer, initialState } from './detail.reducer';
import {
  BomResult,
  ReferenceTypeIdentifier,
  ReferenceTypeResultModel,
} from './models';
import { CalculationsResultModel } from './models/calculations-result-model';

describe('Detail Reducer', () => {
  const fakeState = {
    ...initialState,
    detail: {
      ...initialState.detail,
      loading: true,
    },
    calculations: {
      ...initialState.calculations,
      loading: true,
    },
  };
  const errorMessage = 'An error occured';

  const referenceTypeIdentifier: ReferenceTypeIdentifier = new ReferenceTypeIdentifier(
    REFRENCE_TYPE_MOCK.materialNumber,
    REFRENCE_TYPE_MOCK.plant
  );

  describe('selectReferenceType', () => {
    test('should set selectedReferenceType', () => {
      const action = selectReferenceType({ referenceTypeIdentifier });
      const state = detailReducer(initialState, action);

      expect(state.selectedReferenceType).toEqual(referenceTypeIdentifier);
    });
  });

  describe('loadReferenceType', () => {
    test('should set loading', () => {
      const action = loadReferenceType();
      const state = detailReducer(initialState, action);

      expect(state.detail.loading).toBeTruthy();
    });

    test('should set reset previous reference type', () => {
      const mockState = {
        ...fakeState,
        detail: { ...fakeState.detail, referenceType: REFRENCE_TYPE_MOCK },
      };
      const action = loadReferenceType();
      const state = detailReducer(mockState, action);

      expect(state.detail.referenceType).toBeUndefined();
    });

    test('should reset previous error', () => {
      const mockState = {
        ...fakeState,
        detail: { ...fakeState.detail, errorMessage },
      };
      const action = loadReferenceType();
      const state = detailReducer(mockState, action);

      expect(state.detail.errorMessage).toBeUndefined();
    });
  });

  describe('loadReferenceTypeSuccess', () => {
    test('should unset loading and set ref types', () => {
      const item = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);

      const action = loadReferenceTypeSuccess({ item });

      const state = detailReducer(fakeState, action);

      expect(state.detail.loading).toBeFalsy();
      expect(state.detail.referenceType).toEqual(item.referenceTypeDto);
      expect(state.detail.errorMessage).toBeUndefined();
    });
  });

  describe('loadReferenceTypeFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadReferenceTypeFailure({ errorMessage });

      const state = detailReducer(fakeState, action);

      expect(state.detail.loading).toBeFalsy();
      expect(state.detail.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadCalculations', () => {
    test('should set loading', () => {
      const action = loadCalculations();
      const state = detailReducer(initialState, action);

      expect(state.calculations.loading).toBeTruthy();
    });

    test('should reset calculations state', () => {
      const action = loadCalculations();
      const state = detailReducer(initialState, action);

      expect(state.calculations.items).toBeUndefined();
      expect(state.calculations.selected).toBeUndefined();
      expect(state.calculations.errorMessage).toBeUndefined();
    });
  });

  describe('loadCalculationsSuccess', () => {
    test('should unset loading and set calculations', () => {
      const item = new CalculationsResultModel(CALCULATIONS_TYPE_MOCK);

      const action = loadCalculationsSuccess({ items: item.items });

      const state = detailReducer(fakeState, action);

      expect(state.detail.loading).toBeTruthy();
      expect(state.calculations.loading).toBeFalsy();
      expect(state.calculations.items).toEqual(item.items);
    });

    test('should select the first calculation', () => {
      const item = new CalculationsResultModel(CALCULATIONS_TYPE_MOCK);

      const action = loadCalculationsSuccess({ items: item.items });

      const state = detailReducer(fakeState, action);

      expect(state.calculations.selected.nodeId).toEqual('0');
      expect(state.calculations.selected.calculation).toEqual(
        CALCULATIONS_TYPE_MOCK[0]
      );
    });
  });

  describe('loadCalculationsFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadCalculationsFailure({ errorMessage });

      const state = detailReducer(fakeState, action);

      expect(state.calculations.loading).toBeFalsy();
      expect(state.calculations.errorMessage).toEqual(errorMessage);
    });
  });

  describe('selectCalculation', () => {
    test('should set new selected calculation', () => {
      const nodeId = '7';
      const calculation = CALCULATIONS_TYPE_MOCK[7];
      const action = selectCalculation({ nodeId, calculation });

      const state = detailReducer(fakeState, action);

      expect(state.calculations.selected.nodeId).toEqual(nodeId);
      expect(state.calculations.selected.calculation).toEqual(calculation);
    });
  });

  describe('loadBom', () => {
    test('should set loading', () => {
      const action = loadBom();
      const state = detailReducer(initialState, action);

      expect(state.bom.loading).toBeTruthy();
    });

    test('should reset bom state', () => {
      const action = loadBom();
      const state = detailReducer(initialState, action);

      expect(state.bom.items).toBeUndefined();
      expect(state.bom.errorMessage).toBeUndefined();
    });
  });

  describe('loadBomSuccess', () => {
    test('should unset loading and set bom items', () => {
      const items = new BomResult(BOM_MOCK).items;

      const action = loadBomSuccess({ items });

      const state = detailReducer(fakeState, action);

      expect(state.bom.loading).toBeFalsy();
      expect(state.bom.items).toEqual(items);
    });
  });

  describe('loadBomFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadBomFailure({ errorMessage });

      const state = detailReducer(fakeState, action);

      expect(state.bom.loading).toBeFalsy();
      expect(state.bom.errorMessage).toEqual(errorMessage);
    });
  });
});
