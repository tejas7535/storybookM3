import { createSelector } from '@ngrx/store';

import { SearchAutocompleteOption } from '@schaeffler/search-autocomplete';

import {
  BearingSelectionTypeUnion,
  ExtendedSearchParameters,
} from '@ga/shared/models';

import { getBearingState } from '../../reducers';
import { BearingState } from '../../reducers/bearing/bearing.reducer';

export const getBearingSelectionType = createSelector(
  getBearingState,
  (state: BearingState): BearingSelectionTypeUnion => state.bearingSelectionType
);

export const getBearingLoading = createSelector(
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

export const getBearingExtendedSearchParameters = createSelector(
  getBearingState,
  (state: BearingState): ExtendedSearchParameters =>
    state?.extendedSearch?.parameters
);

export const getBearingResultList = createSelector(
  getBearingState,
  (state: BearingState): SearchAutocompleteOption[] =>
    state?.search?.resultList.map((bearing) => ({
      id: bearing,
      title: bearing,
    }))
);

export const getBearingExtendedSearchResultList = createSelector(
  getBearingState,
  (state: BearingState): SearchAutocompleteOption[] =>
    state?.extendedSearch?.resultList?.map((bearing) => ({
      id: bearing,
      title: bearing,
    }))
);

export const getBearingExtendedSearchResultsCount = createSelector(
  getBearingState,
  (state: BearingState): number => state?.extendedSearch?.resultsCount
);
