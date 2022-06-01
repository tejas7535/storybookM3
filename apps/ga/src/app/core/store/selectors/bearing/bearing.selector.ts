import { createSelector } from '@ngrx/store';

import { SearchAutocompleteOption } from '@schaeffler/search-autocomplete';

import {
  BearingSelectionTypeUnion,
  AdvancedBearingSelectionFilters,
} from '@ga/shared/models';

import { getBearingState } from '../../reducers';
import { BearingState } from '../../reducers/bearing/bearing.reducer';

export const getBearingSelectionType = createSelector(
  getBearingState,
  (state: BearingState): BearingSelectionTypeUnion => state.bearingSelectionType
);

export const getBearingSelectionLoading = createSelector(
  getBearingState,
  (state: BearingState): boolean => state.loading
);

export const getSelectedBearing = createSelector(
  getBearingState,
  (state: BearingState): string => state?.selectedBearing
);

export const getModelId = createSelector(
  getBearingState,
  (state: BearingState): string => state?.modelId
);

export const getModelCreationSuccess = createSelector(
  getBearingState,
  (state: BearingState): boolean => state?.modelCreationSuccess
);

export const getAdvancedBearingSelectionFilters = createSelector(
  getBearingState,
  (state: BearingState): AdvancedBearingSelectionFilters =>
    state?.advancedBearingSelection?.filters
);

export const getQuickBearingSelectionResultList = createSelector(
  getBearingState,
  (state: BearingState): SearchAutocompleteOption[] =>
    state?.quickBearingSelection?.resultList.map((bearing) => ({
      id: bearing,
      title: bearing,
    }))
);

export const getAdvancedBearingSelectionResultList = createSelector(
  getBearingState,
  (state: BearingState): SearchAutocompleteOption[] =>
    state?.advancedBearingSelection?.resultList?.map((bearing) => ({
      id: bearing,
      title: bearing,
    }))
);

export const getAdvancedBearingSelectionResultsCount = createSelector(
  getBearingState,
  (state: BearingState): number => state?.advancedBearingSelection?.resultsCount
);
