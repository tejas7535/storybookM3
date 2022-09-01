import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { getSelectedTimeRange } from '../../../core/store/selectors';
import { LINE_SERIES_BASE_OPTIONS } from '../../../shared/charts/line-chart/line-chart.config';
import {
  AttritionOverTime,
  AttritionSeries,
  HeatType,
  IdValue,
} from '../../../shared/models';
import { AttritionDialogFluctuationMeta } from '../../attrition-dialog/models/attrition-dialog-fluctuation-meta.model';
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

export const getOrgUnitFluctuationDialogEmployeeData = createSelector(
  selectOrganizationalViewState,
  getSelectedTimeRange,
  (state: OrganizationalViewState, timeRange: IdValue) => {
    const employee = state.orgChart.data?.find(
      (e) => e.id === state.orgChart.fluctuationRates.selectedEmployeeId
    );
    const employeeMeta = employee?.attritionMeta;
    const rates = state.orgChart.fluctuationRates.data?.find(
      (r) => r.value === employee?.orgUnitKey && r.timeRange === timeRange?.id
    );

    return {
      ...employeeMeta,
      fluctuationRate: rates?.fluctuationRate,
      unforcedFluctuationRate: rates?.unforcedFluctuationRate,
      heatType: HeatType.NONE,
    };
  }
);

export const getOrgUnitFluctuationDialogMeta = createSelector(
  getSelectedTimeRange,
  getOrgUnitFluctuationDialogEmployeeData,
  (timeRange: IdValue, data: AttritionDialogFluctuationMeta) => ({
    selectedTimeRange: timeRange?.value,
    data,
    showAttritionRates: true,
  })
);

const getWorldMapFluctuationDialogRegionMetaData = (
  data: CountryData[],
  region: string
) => {
  const relevantCountries = data.filter(
    (countryData) => countryData.region === region
  );
  let employeesLost = 0;
  let remainingFluctuation = 0;
  let forcedFluctuation = 0;
  let unforcedFluctuation = 0;
  let terminationReceived = 0;
  let employeesAdded = 0;
  let openPositions = 0;

  relevantCountries.forEach((country) => {
    employeesLost += country.attritionMeta.employeesLost;
    remainingFluctuation += country.attritionMeta.remainingFluctuation;
    forcedFluctuation += country.attritionMeta.forcedFluctuation;
    unforcedFluctuation += country.attritionMeta.unforcedFluctuation;
    terminationReceived += country.attritionMeta.terminationReceived;
    employeesAdded += country.attritionMeta.employeesAdded;
    openPositions += country.attritionMeta.openPositions;
  });

  return {
    title: region,
    employeesLost,
    remainingFluctuation,
    forcedFluctuation,
    unforcedFluctuation,
    terminationReceived,
    employeesAdded,
    openPositions,
  } as AttritionDialogFluctuationMeta;
};

export const getWorldMapFluctuationDialogMetaData = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) =>
    state.worldMap.selectedRegion !== undefined
      ? getWorldMapFluctuationDialogRegionMetaData(
          state.worldMap.data,
          state.worldMap.selectedRegion
        )
      : (state.worldMap.data?.find(
          (elem) => elem.name === state.worldMap.selectedCountry
        )?.attritionMeta as AttritionDialogFluctuationMeta)
);

export const getWorldMapFluctuationDialogMeta = createSelector(
  getSelectedTimeRange,
  getWorldMapFluctuationDialogMetaData,
  (timeRange: IdValue, data: AttritionDialogFluctuationMeta) => ({
    selectedTimeRange: timeRange?.value,
    data,
    showAttritionRates: false,
  })
);

export const getIsLoadingOrgUnitFluctuationRate = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.orgChart.fluctuationRates.loading
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

export const getRegions = createSelector(
  getWorldMap,
  (countryData: CountryData[]) => [
    ...new Set(countryData.map((country) => country.region)),
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
