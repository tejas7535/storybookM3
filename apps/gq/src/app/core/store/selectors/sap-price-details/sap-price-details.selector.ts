import { createSelector } from '@ngrx/store';

import { getSapPriceDetailsState } from '../../reducers';
import {
  ExtendedSapPriceConditionDetail,
  SapPriceConditionDetail,
} from '../../reducers/sap-price-details/models/sap-price-condition-detail.model';
import { SapPriceDetailsState } from '../../reducers/sap-price-details/sap-price-details.reducer';

export const getSapPriceDetails = createSelector(
  getSapPriceDetailsState,
  (state: SapPriceDetailsState): SapPriceConditionDetail[] =>
    state.sapPriceDetails
);

export const getSapPriceDetailsLoading = createSelector(
  getSapPriceDetailsState,
  (state: SapPriceDetailsState): boolean => state.sapPriceDetailsLoading
);

export const getExtendedSapPriceConditionDetails = createSelector(
  getSapPriceDetailsState,
  (state: SapPriceDetailsState): ExtendedSapPriceConditionDetail[] =>
    state.extendedSapPriceConditionDetails
);
