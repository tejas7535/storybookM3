import { translate } from '@jsverse/transloco';
import { createSelector } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import {
  AdvancedBearingSelectionFilters,
  BearingSelectionTypeUnion,
} from '@ga/shared/models';

import { getBearingSelectionState } from '../../reducers';

export const getBearingSelectionType = createSelector(
  getBearingSelectionState,
  (state): BearingSelectionTypeUnion => state.bearingSelectionType
);

export const getBearingSelectionLoading = createSelector(
  getBearingSelectionState,
  (state): boolean => state.loading
);

export const getSelectedBearing = createSelector(
  getBearingSelectionState,
  (state): string => state?.selectedBearing
);

export const getModelId = createSelector(
  getBearingSelectionState,
  (state): string => state?.modelId
);

export const getModelCreationLoading = createSelector(
  getBearingSelectionState,
  (state): boolean => state?.modelCreationLoading
);

export const getModelCreationSuccess = createSelector(
  getBearingSelectionState,
  (state): boolean => state?.modelCreationSuccess
);

export const getAdvancedBearingSelectionFilters = createSelector(
  getBearingSelectionState,
  (state): AdvancedBearingSelectionFilters =>
    state?.advancedBearingSelection?.filters
);

export const getQuickBearingSelectionResultList = createSelector(
  getBearingSelectionState,
  (state): StringOption[] =>
    state?.quickBearingSelection?.resultList
      ?.map((bearing) => {
        const disabled = !bearing.isValid;

        return {
          id: bearing.designation,
          disabled,
          title: disabled
            ? translate(
                'bearing.bearingSelection.quickSelection.disabledOption',
                {
                  bearing: bearing.designation,
                }
              )
            : translate(
                'bearing.bearingSelection.quickSelection.selectOption',
                {
                  bearing: bearing.designation,
                }
              ),
        };
      })
      .sort(({ disabled: a }, { disabled: b }) => +a - +b)
);

export const getAdvancedBearingSelectionResultList = createSelector(
  getBearingSelectionState,
  (state): StringOption[] =>
    state?.advancedBearingSelection?.resultList
      ?.map((bearing) => ({
        id: bearing.designation,
        title: bearing.designation,
        disabled: !bearing.isValid,
      }))
      .sort(({ disabled: a }, { disabled: b }) => +a - +b)
);

export const getAdvancedBearingSelectionResultsCount = createSelector(
  getBearingSelectionState,
  (state): number => state?.advancedBearingSelection?.resultsCount
);
