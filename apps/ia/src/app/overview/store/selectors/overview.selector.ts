import { createSelector } from '@ngrx/store';

import { OverviewState, selectOverviewState } from '..';

export const getSelectedChartType = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.selectedChart
);

export const getOrgChart = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.orgChart.data
);

export const getIsLoadingOrgChart = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.orgChart.loading
);

export const getIsLoadingWorldMap = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.worldMap.loading
);

export const getWorldMap = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.worldMap.data
);

export const getWorldMapContinents = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.worldMap.continents
);
