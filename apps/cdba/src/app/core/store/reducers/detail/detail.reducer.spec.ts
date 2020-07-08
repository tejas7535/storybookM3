import { REFRENCE_TYPE_MOCK } from '../../../../../../src/testing/mocks';
import {
  getReferenceTypeDetails,
  getReferenceTypeItemSuccess,
} from '../../actions/detail/detail.actions';
import { initialState, detailReducer } from './detail.reducer';
import { ReferenceTypeResultModel } from './models';

describe('Detail Reducer', () => {
  describe('getReferenceTypeDetails', () => {
    test('should set loading', () => {
      const action = getReferenceTypeDetails();
      const state = detailReducer(initialState, action);

      expect(state.detail.loading).toBeTruthy();
    });
  });

  describe('getReferenceTypeItemSuccess', () => {
    test('should unset loading and set ref types', () => {
      const ref = REFRENCE_TYPE_MOCK;
      const item = new ReferenceTypeResultModel(ref);

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
