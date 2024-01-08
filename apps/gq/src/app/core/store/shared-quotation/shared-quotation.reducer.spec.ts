import { SharedQuotationActions } from '@gq/core/store/shared-quotation/shared-quotation.actions';
import {
  sharedQuotationFeature,
  SharedQuotationState,
} from '@gq/core/store/shared-quotation/shared-quotation.reducer';

import { SHARED_QUOTATION_MOCK } from '../../../../testing/mocks/models/shared-quotation.mock';
import { SHARED_QUOTATION_STATE_MOCK } from '../../../../testing/mocks/state/shared-quotation-state.mock';

describe('Shared Quotation Reducer', () => {
  const errorMessage = 'An error occurred';

  describe('get', () => {
    describe('getSharedQuotation', () => {
      test('should set sharedQuotationLoading', () => {
        const action = SharedQuotationActions.getSharedQuotation({
          gqId: 123,
        });
        const state = sharedQuotationFeature.reducer(
          SHARED_QUOTATION_STATE_MOCK,
          action
        );

        expect(state).toEqual({
          ...SHARED_QUOTATION_STATE_MOCK,
          sharedQuotationLoading: true,
        });
      });
    });

    describe('getSharedQuotationSuccess', () => {
      test('should set sharedQuotation when quotation was saved by the user', () => {
        const sharedQuotation = SHARED_QUOTATION_MOCK;

        const fakeState = {
          ...SHARED_QUOTATION_STATE_MOCK,
          sharedQuotation,
          sharedQuotationLoading: false,
        };

        const action = SharedQuotationActions.getSharedQuotationSuccess({
          sharedQuotation,
        });
        const state = sharedQuotationFeature.reducer(fakeState, action);

        expect(state.sharedQuotation).toEqual(sharedQuotation);
      });

      test('should set sharedQuotation to undefined when quotation was not saved by user before', () => {
        const fakeState: SharedQuotationState = {
          ...SHARED_QUOTATION_STATE_MOCK,
          sharedQuotation: undefined,
          sharedQuotationLoading: false,
        };

        const action = SharedQuotationActions.getSharedQuotationSuccess({
          sharedQuotation: null,
        });
        const state = sharedQuotationFeature.reducer(fakeState, action);

        expect(state.sharedQuotation).toEqual(undefined);
      });
    });

    describe('getSharedQuotationFailure', () => {
      test('should set sharedQuotationLoading to false on error', () => {
        const fakeState = {
          ...SHARED_QUOTATION_STATE_MOCK,
          errorMessage,
          sharedQuotationLoading: false,
        };

        const action = SharedQuotationActions.getSharedQuotationFailure({
          errorMessage,
        });
        const state = sharedQuotationFeature.reducer(fakeState, action);

        expect(state.errorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('save', () => {
    describe('saveSharedQuotation', () => {
      test('should set sharedQuotationLoading to true when save is in progress', () => {
        const action = SharedQuotationActions.saveSharedQuotation({
          gqId: 123,
        });
        const state = sharedQuotationFeature.reducer(
          SHARED_QUOTATION_STATE_MOCK,
          action
        );

        expect(state).toEqual({
          ...SHARED_QUOTATION_STATE_MOCK,
          sharedQuotationLoading: true,
        });
      });
    });

    describe('saveSharedQuotationSuccess', () => {
      test('should set sharedQuotation when quotation was saved by the user', () => {
        const sharedQuotation = SHARED_QUOTATION_MOCK;

        const fakeState = {
          ...SHARED_QUOTATION_STATE_MOCK,
          sharedQuotation,
          sharedQuotationLoading: false,
        };

        const action = SharedQuotationActions.saveSharedQuotationSuccess({
          sharedQuotation,
        });
        const state = sharedQuotationFeature.reducer(fakeState, action);

        expect(state.sharedQuotation).toEqual(sharedQuotation);
      });
    });

    describe('saveSharedQuotationFailure', () => {
      test('should set sharedQuotationLoading to false on error', () => {
        const fakeState = {
          ...SHARED_QUOTATION_STATE_MOCK,
          errorMessage,
          sharedQuotationLoading: false,
        };

        const action = SharedQuotationActions.saveSharedQuotationFailure({
          errorMessage,
        });
        const state = sharedQuotationFeature.reducer(fakeState, action);

        expect(state.errorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('delete', () => {
    describe('deleteSharedQuotation', () => {
      test('should set sharedQuotationLoading to true when delete is in progress', () => {
        const action = SharedQuotationActions.deleteSharedQuotation({
          id: '123',
        });
        const state = sharedQuotationFeature.reducer(
          SHARED_QUOTATION_STATE_MOCK,
          action
        );

        expect(state).toEqual({
          ...SHARED_QUOTATION_STATE_MOCK,
          sharedQuotationLoading: true,
        });
      });
    });

    describe('deleteSharedQuotationSuccess', () => {
      test('should set sharedQuotation to undefined when quotation was delete by the user', () => {
        const fakeState: SharedQuotationState = {
          ...SHARED_QUOTATION_STATE_MOCK,
          sharedQuotation: undefined,
          sharedQuotationLoading: false,
        };

        const action = SharedQuotationActions.deleteSharedQuotationSuccess();
        const state = sharedQuotationFeature.reducer(fakeState, action);

        expect(state.sharedQuotation).toEqual(undefined);
      });
    });

    describe('deleteSharedQuotationFailure', () => {
      test('should set sharedQuotationLoading to false on error', () => {
        const fakeState = {
          ...SHARED_QUOTATION_STATE_MOCK,
          errorMessage,
          sharedQuotationLoading: false,
        };

        const action = SharedQuotationActions.deleteSharedQuotationFailure({
          errorMessage,
        });
        const state = sharedQuotationFeature.reducer(fakeState, action);

        expect(state.errorMessage).toEqual(errorMessage);
      });
    });
  });
});
