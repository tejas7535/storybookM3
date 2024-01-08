import { SharedQuotationActions } from '@gq/core/store/shared-quotation/shared-quotation.actions';
import { SharedQuotation } from '@gq/shared/models';
import { createFeature, createReducer, on } from '@ngrx/store';

export interface SharedQuotationState {
  sharedQuotation: SharedQuotation;
  sharedQuotationLoading: boolean;
  errorMessage: string;
}

export const initialState: SharedQuotationState = {
  sharedQuotation: undefined,
  sharedQuotationLoading: false,
  errorMessage: undefined,
};

export const sharedQuotationFeature = createFeature({
  name: 'sharedQuotation',
  reducer: createReducer(
    initialState,
    on(
      SharedQuotationActions.getSharedQuotation,
      (state: SharedQuotationState): SharedQuotationState => ({
        ...state,
        sharedQuotationLoading: true,
      })
    ),
    on(
      SharedQuotationActions.getSharedQuotationSuccess,
      (
        state: SharedQuotationState,
        { sharedQuotation }
      ): SharedQuotationState => ({
        ...state,
        sharedQuotation: sharedQuotation ?? undefined,
        sharedQuotationLoading: false,
      })
    ),
    on(
      SharedQuotationActions.getSharedQuotationFailure,
      (
        state: SharedQuotationState,
        { errorMessage }
      ): SharedQuotationState => ({
        ...state,
        errorMessage,
        sharedQuotationLoading: false,
      })
    ),
    on(
      SharedQuotationActions.saveSharedQuotation,
      (state: SharedQuotationState): SharedQuotationState => ({
        ...state,
        sharedQuotationLoading: true,
      })
    ),
    on(
      SharedQuotationActions.saveSharedQuotationSuccess,
      (
        state: SharedQuotationState,
        { sharedQuotation }
      ): SharedQuotationState => ({
        ...state,
        sharedQuotation,
        sharedQuotationLoading: false,
      })
    ),
    on(
      SharedQuotationActions.saveSharedQuotationFailure,
      (
        state: SharedQuotationState,
        { errorMessage }
      ): SharedQuotationState => ({
        ...state,
        errorMessage,
        sharedQuotationLoading: false,
      })
    ),
    on(
      SharedQuotationActions.deleteSharedQuotation,
      (state: SharedQuotationState): SharedQuotationState => ({
        ...state,
        sharedQuotationLoading: true,
      })
    ),
    on(
      SharedQuotationActions.deleteSharedQuotationSuccess,
      (state: SharedQuotationState): SharedQuotationState => ({
        ...state,
        sharedQuotation: undefined,
        sharedQuotationLoading: false,
      })
    ),
    on(
      SharedQuotationActions.deleteSharedQuotationFailure,
      (
        state: SharedQuotationState,
        { errorMessage }
      ): SharedQuotationState => ({
        ...state,
        errorMessage,
        sharedQuotationLoading: false,
      })
    )
  ),
});
