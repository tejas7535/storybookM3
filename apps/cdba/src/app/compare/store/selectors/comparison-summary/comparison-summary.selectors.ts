import { createSelector } from '@ngrx/store';

import { getCompareState } from '@cdba/core/store/reducers';

import { CompareState, ComparisonState } from '../..';

export const getComparison = createSelector(
  getCompareState,
  (state: CompareState): ComparisonState => state.comparison
);

export const getComparisonError = createSelector(
  getComparison,
  (comparison: ComparisonState): string => comparison?.errorMessage
);

export const isComparisonLoading = createSelector(
  getComparison,
  (comparison: ComparisonState): boolean => comparison?.loading
);
