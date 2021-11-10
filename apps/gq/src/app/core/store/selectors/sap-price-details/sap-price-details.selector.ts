import { createSelector } from '@ngrx/store';

import { getSapPriceDetailsState } from '../../reducers';
import { SapPriceDetail } from '../../reducers/sap-price-details/models/sap-price-detail.model';
import { SapPriceDetailsState } from '../../reducers/sap-price-details/sap-price-details.reducer';

export const getSapPriceDetails = createSelector(
  getSapPriceDetailsState,
  (state: SapPriceDetailsState): SapPriceDetail[] => state.sapPriceDetails
);

export const getSapPriceDetailsLoading = createSelector(
  getSapPriceDetailsState,
  (state: SapPriceDetailsState): boolean => state.sapPriceDetailsLoading
);
