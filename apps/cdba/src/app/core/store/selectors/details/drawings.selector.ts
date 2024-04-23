import { translate } from '@jsverse/transloco';
import { createSelector } from '@ngrx/store';

import { Drawing } from '@cdba/shared/models';

import { getDetailState } from '../../reducers';
import { DetailState } from '../../reducers/detail/detail.reducer';

export const getDrawings = createSelector(
  getDetailState,
  (state: DetailState): Drawing[] => state.drawings.items
);

export const getDrawingsLoading = createSelector(
  getDetailState,
  (state: DetailState) => state.drawings.loading
);

export const getDrawingsError = createSelector(
  getDetailState,
  (state: DetailState) => {
    if (state.drawings.errorMessage) {
      return state.drawings.errorMessage;
    }

    if (!state.drawings.loading && state.drawings.items?.length === 0) {
      return translate('detail.drawings.noDrawingsText');
    }

    return undefined;
  }
);

export const getNodeIdOfSelectedDrawing = createSelector(
  getDetailState,
  (state: DetailState) => state.drawings.selected?.nodeId
);
