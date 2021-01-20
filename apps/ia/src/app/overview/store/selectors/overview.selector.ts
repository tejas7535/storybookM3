import { createSelector } from '@ngrx/store';

import { OverviewState, selectOverviewState } from '..';
import { AttritionOverTime } from '../../../shared/models';

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

export const getIsLoadingAttritionOverTime = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.worldMap.loading
);

const getAttritionOverTime = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.attritionOverTime?.data
);

export const getAttritionOverTimeEvents = createSelector(
  getAttritionOverTime,
  (attritionOverTime: AttritionOverTime) => attritionOverTime?.events
);

export const getAttritionOverTimeData = createSelector(
  getAttritionOverTime,
  (attritionOverTime: AttritionOverTime) => attritionOverTime?.data
);
