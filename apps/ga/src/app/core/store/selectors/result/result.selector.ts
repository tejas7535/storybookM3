import { createSelector } from '@ngrx/store';

import { getResultState } from '../../reducers';
import { ResultState } from '../../reducers/result/result.reducer';

export const getResult = createSelector(
  getResultState,
  (state: ResultState): ResultState => state
);

export const getResultId = createSelector(
  getResultState,
  (state: ResultState): string => state?.resultId
);
