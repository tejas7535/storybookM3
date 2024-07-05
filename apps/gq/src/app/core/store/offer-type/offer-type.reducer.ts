import { OfferType } from '@gq/shared/models/offer-type.interface';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { getSelectedOfferTypeFromCreateCase } from '../selectors/create-case/create-case.selector';
import { OfferTypeActions } from './offer-type.actions';

const OT_KEY = 'offerType';

export interface OfferTypeState {
  offerTypes: OfferType[];
  offerTypeLoading: boolean;
  errorMessage: string;
}

export const initialState: OfferTypeState = {
  offerTypes: [],
  offerTypeLoading: false,
  errorMessage: undefined,
};

export const offerTypeFeature = createFeature({
  name: OT_KEY,
  reducer: createReducer(
    initialState,
    on(
      OfferTypeActions.getAllOfferTypes,
      (state: OfferTypeState): OfferTypeState => ({
        ...state,
        offerTypeLoading: true,
      })
    ),
    on(
      OfferTypeActions.getAllOfferTypesSuccess,
      (state: OfferTypeState, { offerTypes }): OfferTypeState => ({
        ...state,
        offerTypes,
        offerTypeLoading: false,
        errorMessage: initialState.errorMessage,
      })
    ),
    on(
      OfferTypeActions.getAllOfferTypesFailure,
      (state: OfferTypeState, { errorMessage }): OfferTypeState => ({
        ...state,
        offerTypes: [],
        offerTypeLoading: false,
        errorMessage,
      })
    )
  ),
  extraSelectors: () => {
    // the selected offer-type is stored in the create-case state to have all info at one place
    // that are needed for creating a new Case
    const getSelectedOfferType = createSelector(
      getSelectedOfferTypeFromCreateCase,
      (offerType: OfferType) => offerType
    );

    return {
      getSelectedOfferType,
    };
  },
});
