import { createSelector } from '@ngrx/store';
import { EChartsOption, SeriesOption } from 'echarts';

import { OverviewState, selectOverviewState } from '..';
import {
  getSelectedOrgUnit,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import { SMOOTH_LINE_SERIES_OPTIONS } from '../../../shared/configs/line-chart.config';
import { AttritionOverTime } from '../../../shared/models';
import { FluctuationRate } from '../../../shared/models/fluctuation-rate';
import { OverviewFluctuationRates } from '../../../shared/models/overview-fluctuation-rates';
import { DoughnutConfig } from '../../entries-exits/doughnut-chart/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../entries-exits/doughnut-chart/models/doughnut-series-config.model';

export const getIsLoadingAttritionOverTimeOverview = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.attritionOverTime.loading
);

const getAttritionOverTime = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.attritionOverTime?.data
);

export const getAttritionOverTimeEvents = createSelector(
  getAttritionOverTime,
  (attritionOverTime: AttritionOverTime) => attritionOverTime?.events
);

export const getAttritionOverTimeOverviewData = createSelector(
  getAttritionOverTime,
  (attritionOverTime: AttritionOverTime) => attritionOverTime?.data
);

export const getOverviewFluctuationRates = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.entriesExits?.data
);

export const getOverviewFluctuationEntriesCount = createSelector(
  getOverviewFluctuationRates,
  (overviewFluctuationRates: OverviewFluctuationRates) =>
    overviewFluctuationRates?.entries
);

export const getOverviewFluctuationExitsCount = createSelector(
  getOverviewFluctuationRates,
  (overviewFluctuationRates: OverviewFluctuationRates) =>
    overviewFluctuationRates?.exits
);

export const getLeaversDataForSelectedOrgUnit = createSelector(
  getOverviewFluctuationRates,
  getSelectedOrgUnit,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedOrgUnit: string
  ) =>
    overviewFluctuationRates?.exitEmployees.filter(
      (employee) => employee.orgUnit?.indexOf(selectedOrgUnit.toString()) === 0
    )
);

export const getOverviewFluctuationEntriesDoughnutConfig = createSelector(
  getOverviewFluctuationRates,
  getSelectedTimeRange,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedTimeRange: string
  ) => {
    const internal = overviewFluctuationRates?.allEmployees?.filter(
      (employee) =>
        isDateInTimeRange(selectedTimeRange, employee.internalEntryDate)
    );
    const external = overviewFluctuationRates?.allEmployees?.filter(
      (employee) => isDateInTimeRange(selectedTimeRange, employee.entryDate)
    );

    return internal && external
      ? createDoughnutConfig(internal.length, external.length, 'Entries')
      : createDoughnutConfig(0, 0, 'Entries');
  }
);

export const getOverviewFluctuationExitsDoughnutConfig = createSelector(
  getOverviewFluctuationRates,
  getSelectedTimeRange,
  getSelectedOrgUnit,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedTimeRange: string,
    selectedOrgUnit: string
  ) => {
    const internal = overviewFluctuationRates?.exitEmployees?.filter(
      (employee) =>
        employee.orgUnit.indexOf(selectedOrgUnit.toString()) === 0 &&
        isDateInTimeRange(selectedTimeRange, employee.internalExitDate)
    );
    const external = overviewFluctuationRates?.exitEmployees?.filter(
      (employee) =>
        employee.orgUnit.indexOf(selectedOrgUnit.toString()) === 0 &&
        isDateInTimeRange(selectedTimeRange, employee.exitDate)
    );

    return internal && external
      ? createDoughnutConfig(internal.length, external.length, 'Exits')
      : createDoughnutConfig(0, 0, 'Exits');
  }
);

export const getEntryEmployees = createSelector(
  getOverviewFluctuationRates,
  getSelectedTimeRange,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedTimeRange: string
  ) =>
    overviewFluctuationRates?.allEmployees.filter(
      (employee) =>
        isDateInTimeRange(selectedTimeRange, employee.entryDate) ||
        isDateInTimeRange(selectedTimeRange, employee.internalEntryDate)
    )
);

function isDateInTimeRange(timeRange: string, dateToTest: string): boolean {
  if (!dateToTest || !timeRange) {
    return false;
  }
  const dateToTestP = new Date(dateToTest);
  const timeRangeArr = timeRange.split('|');
  const timeRangeStart = new Date(Number(timeRangeArr[0]));
  const timeRangeEnd = new Date(Number(timeRangeArr[1]));

  return timeRangeStart <= dateToTestP && dateToTestP <= timeRangeEnd;
}

export const getFluctuationRatesForChart = createSelector(
  selectOverviewState,
  (state: OverviewState) =>
    state.fluctuationRates.data
      ? createFluctuationRateChartConfig(
          state.fluctuationRates?.data.companyName,
          state.fluctuationRates?.data.orgUnitName,
          state.fluctuationRates?.data.fluctuationRates.map(
            (rate: FluctuationRate) => getPercentageValue(rate.company)
          ),
          state.fluctuationRates?.data.fluctuationRates.map(
            (rate: FluctuationRate) => getPercentageValue(rate.orgUnit)
          )
        )
      : undefined
);

export const getUnforcedFluctuationRatesForChart = createSelector(
  selectOverviewState,
  (state: OverviewState) =>
    state.unforcedFluctuationRates.data
      ? createFluctuationRateChartConfig(
          state.unforcedFluctuationRates?.data.companyName,
          state.unforcedFluctuationRates?.data.orgUnitName,
          state.unforcedFluctuationRates?.data.fluctuationRates.map(
            (rate: FluctuationRate) => getPercentageValue(rate.company)
          ),
          state.unforcedFluctuationRates?.data.fluctuationRates.map(
            (rate: FluctuationRate) => getPercentageValue(rate.orgUnit)
          )
        )
      : undefined
);

export const getIsLoadingFluctuationRatesForChart = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.fluctuationRates?.loading
);

export const getIsLoadingUnforcedFluctuationRatesForChart = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.unforcedFluctuationRates?.loading
);

function getPercentageValue(rate: number): number {
  return Number((rate * 100).toFixed(2));
}

function createFluctuationRateChartConfig(
  name1: string,
  name2: string,
  data1: number[],
  data2: number[]
): EChartsOption {
  return {
    series: [
      {
        ...SMOOTH_LINE_SERIES_OPTIONS,
        name: name1,
        data: data1,
      } as SeriesOption,
      {
        ...SMOOTH_LINE_SERIES_OPTIONS,
        name: name2,
        data: data2,
      } as SeriesOption,
    ],
    yAxis: {
      axisLabel: {
        formatter: '{value}%',
      },
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'cross',
      },
      formatter: (param: any) => `${param.data}%`,
    },
    displayMode: 'multipleByCoordSys',
  };
}

function createDoughnutConfig(
  internalValue: number,
  externalValue: number,
  name: string
) {
  const labelInternal = 'internal';
  const labelExternal = 'external';

  return new DoughnutConfig(
    name,
    [
      new DoughnutSeriesConfig(internalValue, labelInternal),
      new DoughnutSeriesConfig(externalValue, labelExternal),
    ],
    [labelInternal, labelExternal]
  );
}
