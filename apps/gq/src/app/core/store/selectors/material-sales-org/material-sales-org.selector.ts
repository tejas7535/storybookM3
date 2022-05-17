import { createSelector } from '@ngrx/store';

import { MaterialSalesOrg } from '../../../../shared/models/quotation-detail/material-sales-org.model';
import { getMaterialSalesOrgsState } from '../../reducers';
import { MaterialSalesOrgsState } from '../../reducers/material-sales-org/material-sales-org.reducer';

export const getMaterialSalesOrg = createSelector(
  getMaterialSalesOrgsState,
  (state: MaterialSalesOrgsState): MaterialSalesOrg => state.materialSalesOrg
);

export const getMaterialSalesOrgLoading = createSelector(
  getMaterialSalesOrgsState,
  (state: MaterialSalesOrgsState): boolean => state.materialSalesOrgLoading
);

export const getMaterialSalesOrgDataAvailable = createSelector(
  getMaterialSalesOrgsState,
  (state: MaterialSalesOrgsState): boolean =>
    state.materialSalesOrg !== undefined &&
    Object.keys(state.materialSalesOrg).length > 0
);
