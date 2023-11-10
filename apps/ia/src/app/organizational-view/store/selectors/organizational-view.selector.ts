import { createSelector } from '@ngrx/store';
import { LineSeriesOption } from 'echarts';

import {
  getSelectedDimension,
  getSelectedDimensionIdValue,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import { LINE_SERIES_BASE_OPTIONS } from '../../../shared/charts/line-chart/line-chart.config';
import { DIMENSIONS_UNAVAILABLE_FOR_OPEN_POSITIONS } from '../../../shared/constants';
import {
  AttritionSeries,
  FilterDimension,
  HeatType,
  IdValue,
} from '../../../shared/models';
import { AttritionDialogFluctuationMeta } from '../../attrition-dialog/models/attrition-dialog-fluctuation-meta.model';
import { CountryDataAttrition } from '../../world-map/models';
import { OrganizationalViewState, selectOrganizationalViewState } from '..';

const PARENT_SERIE_ID = 'parent';
const CHILD_SERIE_ID = 'child';

export const getSelectedChartType = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.selectedChart
);

export const getOrgChart = createSelector(
  selectOrganizationalViewState,
  getSelectedDimension,
  getSelectedDimensionIdValue,
  (
    state: OrganizationalViewState,
    dimension: FilterDimension,
    selectedDimensionIdValue: IdValue
  ) => {
    const hideOrgChart = selectedDimensionIdValue === undefined;

    return {
      data: hideOrgChart ? [] : state.orgChart.data,
      dimension,
    };
  }
);

export const getOrgChartEmployees = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.orgChart.employees.data
);

export const getOrgChartEmployeesLoading = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.orgChart.employees.loading
);

export const getOrgUnitFluctuationDialogEmployeeData = createSelector(
  selectOrganizationalViewState,
  getSelectedTimeRange,
  (state: OrganizationalViewState, timeRange: IdValue) => {
    const node = state.orgChart.data?.find(
      (e) => e.id === state.orgChart.fluctuationRates.selectedEmployeeId
    );
    const employeeMeta = node?.attritionMeta;
    const rates = state.orgChart.fluctuationRates.data?.find(
      (r) => r.value === node?.dimensionKey && r.timeRange === timeRange?.id
    );
    const title = node.dimensionLongName
      ? `${node.dimension} (${node.dimensionLongName})`
      : node.dimension;

    const openPositionsAvailable =
      !DIMENSIONS_UNAVAILABLE_FOR_OPEN_POSITIONS.includes(node.filterDimension);

    return {
      ...employeeMeta,
      title,
      fluctuationRate: rates?.fluctuationRate,
      unforcedFluctuationRate: rates?.unforcedFluctuationRate,
      heatType: HeatType.NONE,
      hideDetailedLeaverStats: employeeMeta.responseModified,
      openPositionsAvailable,
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
  data: CountryDataAttrition[],
  region: string
) => {
  const relevantCountries = data.filter(
    (countryData) => countryData.region === region
  );
  let employeesLost = 0;
  let remainingFluctuation = 0;
  let forcedFluctuation = 0;
  let unforcedFluctuation = 0;
  let resignationsReceived = 0;
  let employeesAdded = 0;
  let openPositions = 0;
  let hideDetailedLeaverStats = false;

  relevantCountries.forEach((country) => {
    hideDetailedLeaverStats =
      hideDetailedLeaverStats || country.attritionMeta.responseModified;
    employeesLost += country.attritionMeta.employeesLost;
    remainingFluctuation += country.attritionMeta.remainingFluctuation;
    forcedFluctuation += country.attritionMeta.forcedFluctuation;
    unforcedFluctuation += country.attritionMeta.unforcedFluctuation;
    resignationsReceived += country.attritionMeta.resignationsReceived;
    employeesAdded += country.attritionMeta.employeesAdded;
    openPositions += country.attritionMeta.openPositions;
  });

  return {
    title: region,
    employeesLost,
    remainingFluctuation,
    forcedFluctuation,
    unforcedFluctuation,
    resignationsReceived,
    employeesAdded,
    openPositions,
    openPositionsAvailable: true,
    hideDetailedLeaverStats,
  } as AttritionDialogFluctuationMeta;
};

const getWorldMapFluctuationDialogCountryMetaData = (
  state: OrganizationalViewState
) => {
  const temp = state.worldMap.data?.find(
    (elem) => elem.name === state.worldMap.selectedCountry
  )?.attritionMeta;

  return temp
    ? {
        ...temp,
        hideDetailedLeaverStats: temp?.responseModified,
        openPositionsAvailable: true,
      }
    : (undefined as any);
};

export const getWorldMapFluctuationDialogMetaData = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) =>
    state.worldMap.selectedRegion !== undefined
      ? getWorldMapFluctuationDialogRegionMetaData(
          state.worldMap.data,
          state.worldMap.selectedRegion
        )
      : getWorldMapFluctuationDialogCountryMetaData(state)
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

export const getParentAttritionOverTimeOrgChartData = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) =>
    mapDataToLineSerie(
      PARENT_SERIE_ID,
      state.attritionOverTime?.parent?.data?.data,
      state.attritionOverTime?.parent?.dimensionName
    )
);

export const getParentIsLoadingAttritionOverTimeOrgChart = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.attritionOverTime.parent?.loading
);

export const getChildAttritionOverTimeOrgChartSeries = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) =>
    mapDataToLineSerie(
      CHILD_SERIE_ID,
      state.attritionOverTime?.child?.data?.data,
      state.attritionOverTime?.child?.dimensionName
    )
);

export const getChildIsLoadingAttritionOverTimeOrgChart = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.attritionOverTime.child?.loading
);

export const getChildDimensionName = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) =>
    state.attritionOverTime.child?.dimensionName
);

export const getRegions = createSelector(
  getWorldMap,
  (countryData: CountryDataAttrition[]) => [
    ...new Set(countryData.map((country) => country.region)),
  ]
);

export const getDimensionKeyForWorldMap = (
  filterDimension: FilterDimension,
  dimensionName: string
) =>
  createSelector(getWorldMap, (countryData: CountryDataAttrition[]) => {
    if (filterDimension === FilterDimension.COUNTRY) {
      return countryData.find((data) => data.name === dimensionName)
        ?.countryKey;
    } else if (filterDimension === FilterDimension.REGION) {
      return countryData.find((data) => data.region === dimensionName)
        ?.regionKey;
    } else {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    }
  });

export function mapDataToLineSerie(
  id: string,
  data: AttritionSeries,
  seriesName: string
): LineSeriesOption {
  return {
    ...LINE_SERIES_BASE_OPTIONS,
    id,
    name: data ? seriesName : '',
    data: data ? data[Object.keys(data)[0]].attrition : [],
  } as LineSeriesOption;
}
