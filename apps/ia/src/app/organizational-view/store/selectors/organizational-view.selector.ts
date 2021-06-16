import { createSelector } from '@ngrx/store';

import { OrganizationalViewState, selectOrganizationalViewState } from '..';
import { LINE_SERIES_BASE_OPTIONS } from '../../../shared/configs/line-chart.config';
import { AttritionOverTime, AttritionSeries } from '../../../shared/models';

export const getSelectedChartType = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.selectedChart
);

export const getOrgChart = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.orgChart.data
);

export const getIsLoadingOrgChart = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.orgChart.loading
);

export const getIsLoadingWorldMap = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.worldMap.loading
);

export const getWorldMap = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.worldMap.data
);

export const getWorldMapContinents = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.worldMap.continents
);

const getAttritionOverTime = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.attritionOverTime?.data
);

export const getAttritionOverTimeOrgChartData = createSelector(
  getAttritionOverTime,
  (attritionOverTime: AttritionOverTime) =>
    mapDataToChartOption(attritionOverTime?.data)
);

export const getIsLoadingAttritionOverTimeOrgChart = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.attritionOverTime?.loading
);

export function mapDataToChartOption(data: AttritionSeries) {
  return data
    ? {
        series: Object.keys(data).map((name) => ({
          ...LINE_SERIES_BASE_OPTIONS,
          name,
          data: data[name].attrition,
        })),
      }
    : undefined;
}
