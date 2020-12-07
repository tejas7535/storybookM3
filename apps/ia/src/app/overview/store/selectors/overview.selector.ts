import { createSelector } from '@ngrx/store';

import { OverviewState, selectOverviewState } from '..';

export const getSelectedChartType = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.selectedChart
);

export const getOrgChart = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.orgChart
);

export const getIsLoading = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.loading
);

export const getWorldMap = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.worldMap.data
);

export const getWorldMapContinents = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.worldMap.continents
);
