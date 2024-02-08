import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';
import { LineSeriesOption } from 'echarts';

import {
  getSelectedDimension,
  getSelectedDimensionIdValue,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import {
  LINE_SERIES_BASE_OPTIONS,
  SMOOTH_LINE_SERIES_OPTIONS,
} from '../../../shared/charts/line-chart/line-chart.config';
import {
  AttritionSeries,
  FilterDimension,
  IdValue,
} from '../../../shared/models';
import { AttritionDialogFluctuationMeta } from '../../attrition-dialog/models/attrition-dialog-fluctuation-meta.model';
import { DimensionFluctuationData, SeriesType } from '../../models';
import { CountryDataAttrition } from '../../world-map/models';
import { OrganizationalViewState, selectOrganizationalViewState } from '..';

const PARENT_SERIE_ID = 'parent';
const CHILD_SERIE_ID = 'child';

export const getSelectedChartType = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.selectedChart
);

export const getOrgChartData = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.orgChart.data
);

export const getIsLoadingOrgChartData = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.orgChart.loading
);

export const getOrgChart = createSelector(
  getIsLoadingOrgChartData,
  getOrgChartData,
  getSelectedDimension,
  getSelectedDimensionIdValue,
  (
    isLoading: boolean,
    state: DimensionFluctuationData[],
    dimension: FilterDimension,
    selectedDimensionIdValue: IdValue
  ) => {
    const hideOrgChart = selectedDimensionIdValue === undefined;

    return {
      data: hideOrgChart || isLoading ? [] : state,
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
      state.attritionOverTime?.parent?.dimensionName,
      state.attritionOverTime.selectedSeries
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
      state.attritionOverTime?.child?.dimensionName,
      state.attritionOverTime.selectedSeries
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

export const getSelectedSeriesType = createSelector(
  selectOrganizationalViewState,
  (state: OrganizationalViewState) => state.attritionOverTime.selectedSeries
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
  seriesName: string,
  selectedSeriesType: SeriesType
): LineSeriesOption[] {
  const selectedData =
    selectedSeriesType === SeriesType.UNFORCED_LEAVERS
      ? data?.[SeriesType.UNFORCED_LEAVERS].attrition
      : data?.[SeriesType.UNFORCED_FLUCTUATION]?.attrition;
  const lineStyle =
    selectedSeriesType === SeriesType.UNFORCED_LEAVERS
      ? LINE_SERIES_BASE_OPTIONS
      : SMOOTH_LINE_SERIES_OPTIONS;

  return [
    {
      ...lineStyle,
      id,
      name: data ? seriesName : '',
      data: data ? selectedData : [],
      tooltip: {
        formatter: (params: any) => `<table>
          <tr>
            <td class="pr-4">${translate(
              'organizationalView.attritionDialog.tooltip.monthlyHeadcount'
            )}:</td>
              <td><b>${
                data[SeriesType.HEADCOUNTS]?.attrition[params.dataIndex]
              }</b>
            </td>
          </tr>
            <td class="pr-4">${translate(
              'organizationalView.attritionDialog.tooltip.unforcedFluctuation'
            )}:</td>
              <td><b>${
                data[SeriesType.UNFORCED_FLUCTUATION]?.attrition[
                  params.dataIndex
                ]
              }%</b>
            </td>
          </tr>
          <tr>
            <td class="pr-4">${translate(
              'organizationalView.attritionDialog.tooltip.totalUnforcedLeavers'
            )}:</td>
            <td><b>${
              data[SeriesType.UNFORCED_LEAVERS]?.attrition[params.dataIndex]
            }</b></td>
          </tr>
          </table>`,
      },
    } as LineSeriesOption,
  ];
}
