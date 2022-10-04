import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { StringOption } from '@schaeffler/inputs';

import { bearings } from '@ga/shared/constants';
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
      .map((bearing) => {
        const disabled = !bearings.includes(bearing);

        return {
          id: bearing,
          disabled,
          title: disabled
            ? translate(
                'bearing.bearingSelection.quickSelection.disabledOption',
                {
                  bearing,
                }
              )
            : translate(
                'bearing.bearingSelection.quickSelection.selectOption',
                {
                  bearing,
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
        id: bearing,
        title: bearing,
        disabled: !bearings.includes(bearing),
      }))
      .sort(({ disabled: a }, { disabled: b }) => +a - +b)
);

export const getAdvancedBearingSelectionResultsCount = createSelector(
  getBearingSelectionState,
  (state): number => state?.advancedBearingSelection?.resultsCount
);
