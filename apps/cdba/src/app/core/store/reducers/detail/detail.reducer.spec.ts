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
} from '../../actions';
import { detailReducer, initialState } from './detail.reducer';
import {
  BomIdentifier,
  BomResult,
  ReferenceTypeIdModel,
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

  describe('loadReferenceType', () => {
    test('should set loading', () => {
      const referenceTypeId = new ReferenceTypeIdModel(
        REFRENCE_TYPE_MOCK.materialNumber,
        REFRENCE_TYPE_MOCK.plant
      );
      const action = loadReferenceType({ referenceTypeId });
      const state = detailReducer(initialState, action);

      expect(state.detail.loading).toBeTruthy();
    });
  });

  describe('loadReferenceTypeSuccess', () => {
    test('should unset loading and set ref types', () => {
      const item = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);

      const action = loadReferenceTypeSuccess({ item });

      const state = detailReducer(fakeState, action);

      expect(state.detail.loading).toBeFalsy();
      expect(state.calculations.loading).toBeTruthy();
      expect(state.detail.referenceType).toEqual(item.referenceTypeDto);
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
      const materialNumber = '123';
      const includeBom = true;

      const action = loadCalculations({ materialNumber, includeBom });
      const state = detailReducer(initialState, action);

      expect(state.calculations.loading).toBeTruthy();
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
  });

  describe('loadCalculationsFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadCalculationsFailure({ errorMessage });

      const state = detailReducer(fakeState, action);

      expect(state.calculations.loading).toBeFalsy();
      expect(state.calculations.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadBom', () => {
    test('should set loading', () => {
      const bomIdentifier = new BomIdentifier(
        'date',
        'number',
        'type',
        'version',
        'entered',
        'ref',
        'variant'
      );

      const action = loadBom({ bomIdentifier });
      const state = detailReducer(initialState, action);

      expect(state.bom.loading).toBeTruthy();
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
