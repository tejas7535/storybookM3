import { translate } from '@ngneat/transloco';
import { RouterReducerState } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

import {
  Filter,
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
} from '../../../../shared/models';
import {
  RouterStateUrl,
  selectFilterState,
  selectRouterState,
} from '../../reducers';
import {
  FilterState,
  selectAllSelectedFilters,
} from '../../reducers/filter/filter.reducer';

export const getSelectedDimension = createSelector(
  selectFilterState,
  (state: FilterState) => state.selectedDimension
);

export const getSelectedDimensionFilter = createSelector(
  selectFilterState,
  getSelectedDimension,
  (state: FilterState, selectedDimension: FilterDimension) =>
    state.data[selectedDimension]
      ? new Filter(
          Object.entries(FilterDimension).find(
            ([_, value]) => value === selectedDimension
          )?.[1],
          state.data[selectedDimension].items
        )
      : undefined
);

export const getSpecificDimensonFilter = (dimension: FilterDimension) =>
  createSelector(selectFilterState, (state: FilterState) =>
    state.data[dimension]
      ? new Filter(
          Object.entries(FilterDimension).find(
            ([_, value]) => value === dimension
          )?.[1],
          state.data[dimension].items
        )
      : undefined
  );

export const getOrgUnitsLoading = createSelector(
  selectFilterState,
  (state: FilterState) => state.data[FilterDimension.ORG_UNIT].loading
);

export const getSelectedDimensionDataLoading = createSelector(
  selectFilterState,
  (state: FilterState) => state.data[state.selectedDimension]?.loading
);

export const getCurrentRoute = createSelector(
  selectRouterState,
  (state: RouterReducerState<RouterStateUrl>) => state?.state.url
);

export const getTimePeriods = createSelector(
  selectFilterState,
  (state: FilterState) =>
    state.timePeriods.map(
      (period) =>
        new IdValue(
          period.id,
          translate(`filters.periodOfTime.${period.value}`)
        )
    )
);

export const getSelectedTimePeriod = createSelector(
  selectFilterState,
  (state: FilterState) => state.selectedTimePeriod
);

export const getSelectedFilters = createSelector(
  selectFilterState,
  (state: FilterState) => state.selectedFilters
);

export const getAllSelectedFilters = createSelector(
  getSelectedFilters,
  selectAllSelectedFilters
);

export const getCurrentFilters = createSelector(
  getAllSelectedFilters,
  getSelectedDimension,
  (filters: SelectedFilter[], selectedDimension: FilterDimension) => {
    const selectedFilters = filters.filter(
      (filter) =>
        filter.name === selectedDimension ||
        filter.name === FilterKey.TIME_RANGE
    );

    return {
      filterDimension: selectedDimension,
      value: selectedFilters.find((filter) => filter.name === selectedDimension)
        ?.idValue.id,
      timeRange: selectedFilters.find(
        (filter) => filter.name === FilterKey.TIME_RANGE
      )?.idValue.id,
    };
  }
);

export const getCurrentDimensionValue = createSelector(
  getAllSelectedFilters,
  getSelectedDimension,
  (filters: SelectedFilter[], selectedDimension: FilterDimension) => {
    const selectedFilters = filters.filter(
      (filter) => filter.name === selectedDimension
    );

    const selectedDimensionFilter = selectedFilters.find(
      (filter) => filter.name === selectedDimension
    );

    return selectedDimensionFilter?.idValue.value.replace(/\s+\(.*?\)$/g, '');
  }
);

export const getSelectedDimensionIdValue = createSelector(
  getAllSelectedFilters,
  getSelectedDimension,
  (filters: SelectedFilter[], selectedDimension: FilterDimension) =>
    filters.find((filter) => filter.name === selectedDimension)?.idValue
);

export const getSelectOrgUnitValueShort = createSelector(
  getSelectedDimensionIdValue,
  (val: IdValue) => val?.value?.split('(')[0].trim()
);

export const getSelectedTimeRange = createSelector(
  getAllSelectedFilters,
  (filters: SelectedFilter[]) =>
    filters.find((filter) => filter.name === FilterKey.TIME_RANGE)?.idValue
);

export const getSelectedFilterValues = createSelector(
  getAllSelectedFilters,
  getSelectedDimension,
  (filters: SelectedFilter[], selectedDimension: FilterDimension) => [
    ...filters
      .filter(
        (filter) =>
          filter.name === FilterKey.TIME_RANGE ||
          filter.name === selectedDimension
      )
      .map((filter) => filter.idValue.value),
  ]
);
