import { createSelector } from '@ngrx/store';

import { ProductSelectionState } from '../../models';
import { getProductSelectionState } from '../../reducers';

// Placeholder Selector
export const getProductSelection = createSelector(
  getProductSelectionState,
  (state): ProductSelectionState => state
);
