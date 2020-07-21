import {
  CALCULATIONS_TYPE_MOCK,
  REFRENCE_TYPE_MOCK,
} from '../../../../../testing/mocks';
import {
  getCalculationsSuccess,
  getReferenceTypeItem,
  getReferenceTypeItemSuccess,
} from '../../actions';
import { detailReducer, initialState } from './detail.reducer';
import { ReferenceTypeIdModel, ReferenceTypeResultModel } from './models';
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

  describe('getReferenceTypeItem', () => {
    test('should set loading', () => {
      const referenceTypeId = new ReferenceTypeIdModel(
        REFRENCE_TYPE_MOCK.materialNumber,
        REFRENCE_TYPE_MOCK.plant
      );
      const action = getReferenceTypeItem({ referenceTypeId });
      const state = detailReducer(initialState, action);

      expect(state.detail.loading).toBeTruthy();
      expect(state.calculations.loading).toBeTruthy();
    });
  });

  describe('getReferenceTypeItemSuccess', () => {
    test('should unset loading and set ref types', () => {
      const item = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);

      const action = getReferenceTypeItemSuccess({ item });

      const state = detailReducer(fakeState, action);

      expect(state.detail.loading).toBeFalsy();
      expect(state.calculations.loading).toBeTruthy();
      expect(state.detail.referenceType).toEqual(item.referenceTypeDto);
    });
  });

  describe('getCalculationsSuccess', () => {
    test('should unset loading and set calculations', () => {
      const item = new CalculationsResultModel(CALCULATIONS_TYPE_MOCK);

      const action = getCalculationsSuccess({ item });

      const state = detailReducer(fakeState, action);

      expect(state.detail.loading).toBeTruthy();
      expect(state.calculations.loading).toBeFalsy();
      expect(state.calculations.items).toEqual(item.items);
    });
  });
});
