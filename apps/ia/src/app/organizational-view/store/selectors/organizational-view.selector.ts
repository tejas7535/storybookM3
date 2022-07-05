import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { LINE_SERIES_BASE_OPTIONS } from '../../../shared/charts/line-chart/line-chart.config';
import { AttritionOverTime, AttritionSeries } from '../../../shared/models';
import { CountryData } from '../../world-map/models';
import { OrganizationalViewState, selectOrganizationalViewState } from '..';

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

export const getContinents = createSelector(
  getWorldMap,
  (countryData: CountryData[]) => [
    ...new Set(countryData.map((country) => country.continent)),
  ]
);

export function mapDataToChartOption(data: AttritionSeries) {
  return data
    ? {
        series: Object.keys(data).map((name) => ({
          ...LINE_SERIES_BASE_OPTIONS,
          name: translate(`attritionDialog.${name}`, {}, 'organizational-view'),
          data: data[name].attrition,
        })),
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisPointer: {
            label: {
              precision: 0,
            },
            snap: true,
          },
        },
      }
    : undefined;
}
