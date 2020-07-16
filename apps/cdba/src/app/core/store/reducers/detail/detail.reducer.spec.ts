import { REFRENCE_TYPE_MOCK } from '../../../../../testing/mocks';
import {
  getReferenceTypeItem,
  getReferenceTypeItemSuccess,
} from '../../actions';
import { detailReducer, initialState } from './detail.reducer';
import { ReferenceTypeIdModel, ReferenceTypeResultModel } from './models';

describe('Detail Reducer', () => {
  describe('getReferenceTypeItem', () => {
    test('should set loading', () => {
      const referenceTypeId = new ReferenceTypeIdModel(
        REFRENCE_TYPE_MOCK.materialNumber,
        REFRENCE_TYPE_MOCK.plant
      );
      const action = getReferenceTypeItem({ referenceTypeId });
      const state = detailReducer(initialState, action);

      expect(state.detail.loading).toBeTruthy();
    });
  });

  describe('getReferenceTypeItemSuccess', () => {
    test('should unset loading and set ref types', () => {
      const item = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);

      const action = getReferenceTypeItemSuccess({ item });

      const fakeState = {
        ...initialState,
        detail: {
          ...initialState.detail,
          loading: true,
        },
      };
      const state = detailReducer(fakeState, action);

      expect(state.detail.loading).toBeFalsy();
      expect(state.detail.referenceType).toEqual(item.referenceTypeDto);
    });
  });
});
