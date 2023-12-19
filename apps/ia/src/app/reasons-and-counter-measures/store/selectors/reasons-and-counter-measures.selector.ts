import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import {
  getSelectedTimePeriod,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import { ChartLegendItem } from '../../../shared/charts/models/chart-legend-item.model';
import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import {
  Filter,
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import {
  ReasonsAndCounterMeasuresState,
  selectAllComparedSelectedFilters,
  selectReasonsAndCounterMeasuresState,
} from '..';
import * as utils from './reasons-and-counter-measures.selector.utils';
import { getColorsForChart } from './reasons-and-counter-measures.selector.utils';

export const getComparedSelectedDimension = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedSelectedDimension
);

export const getComparedSelectedTimePeriod = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedSelectedTimePeriod
);

export const getReasonsData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.data
);

export const getReasonsTableData = createSelector(
  getReasonsData,
  (data: ReasonForLeavingStats[]) => utils.mapReasonsToTableData(data)
);

export const getReasonsLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.loading
);

export const getReasonsChartData = createSelector(
  getReasonsData,
  (reasons: ReasonForLeavingStats[]) =>
    reasons ? utils.getTop5ReasonsForChart(reasons) : []
);

export const getReasonsChartConfig = createSelector(
  getReasonsData,
  getSelectedTimeRange,
  getSelectedTimePeriod,
  getReasonsChartData,
  (
    stats: ReasonForLeavingStats[],
    timeRange: IdValue,
    timePeriod: TimePeriod,
    originalData: DoughnutChartData[]
  ) => ({
    title: getTimeRangeTitle(timePeriod, timeRange.value),
    subTitle:
      stats === undefined || stats.length === 0
        ? translate('reasonsAndCounterMeasures.topFiveReasons.chart.noData')
        : undefined,
    tooltipFormatter: utils.getTooltipFormatter(),
    color: utils.getColorsForChart(originalData),
  })
);

const getComparedSelectedFilters = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedSelectedFilters
);

const getAllComparedSelectedFilters = createSelector(
  getComparedSelectedFilters,
  selectAllComparedSelectedFilters
);

export const getComparedSelectedDimensionIdValue = createSelector(
  getAllComparedSelectedFilters,
  getComparedSelectedDimension,
  (selectedFilters: SelectedFilter[], selectedDimension: FilterDimension) =>
    selectedFilters.find((filter) => filter.name === selectedDimension)?.idValue
);

export const getComparedOrgUnitsFilter = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    new Filter(
      FilterDimension.ORG_UNIT,
      state.reasonsForLeaving.data[FilterDimension.ORG_UNIT]?.items
    )
);

export const getComparedSelectedDimensionFilter = createSelector(
  selectReasonsAndCounterMeasuresState,
  getComparedSelectedDimension,
  (state: ReasonsAndCounterMeasuresState, selectedDimension: FilterDimension) =>
    new Filter(
      selectedDimension,
      state.reasonsForLeaving.data[selectedDimension]?.items ?? []
    )
);

export const getComparedSelectedTimeRange = createSelector(
  getAllComparedSelectedFilters,
  (filters: SelectedFilter[]) =>
    filters.find((filter) => filter.name === FilterKey.TIME_RANGE)?.idValue
);

export const getComparedSelectedOrgUnitLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  getComparedSelectedDimension,
  (state: ReasonsAndCounterMeasuresState, selectedDimension: FilterDimension) =>
    state.reasonsForLeaving.data[selectedDimension]?.loading
);

export const getCurrentComparedFilters = createSelector(
  getComparedSelectedDimension,
  getComparedSelectedDimensionIdValue,
  getComparedSelectedTimeRange,
  (filterDimension: FilterDimension, idValue: IdValue, timeRange: IdValue) => ({
    filterDimension,
    timeRange: timeRange?.id,
    value: idValue?.id,
  })
);

export const getComparedReasonsData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.data
);

export const getComparedReasonsTableData = createSelector(
  getComparedReasonsData,
  (data: ReasonForLeavingStats[]) => utils.mapReasonsToTableData(data)
);

export const getComparedReasonsLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.loading
);

export const getComparedReasonsChartData = createSelector(
  getComparedReasonsData,
  (reasons: ReasonForLeavingStats[]) =>
    reasons ? utils.getTop5ReasonsForChart(reasons) : undefined
);

export const getComparedReasonsChartConfig = createSelector(
  getComparedReasonsData,
  getComparedSelectedTimeRange,
  getComparedSelectedTimePeriod,
  getReasonsChartData,
  getComparedReasonsChartData,
  (
    stats: ReasonForLeavingStats[],
    timeRange: IdValue,
    timePeriod: TimePeriod,
    originalData: DoughnutChartData[],
    compareData: DoughnutChartData[]
  ) => ({
    title: getTimeRangeTitle(timePeriod, timeRange.value),
    subTitle:
      stats === undefined || stats.length === 0
        ? translate('reasonsAndCounterMeasures.topFiveReasons.chart.noData')
        : undefined,
    tooltipFormatter: utils.getTooltipFormatter(),
    color: utils.getColorsForChart(originalData, compareData),
  })
);

export const getReasonsCombinedLegend = createSelector(
  getReasonsChartData,
  getComparedReasonsChartData,
  (data, comparedData) => {
    const colors = getColorsForChart(data);
    const items = utils.mapDataToLegendItems(data, colors);

    if (comparedData) {
      const comparedLegendColors = getColorsForChart(data, comparedData);
      const comparedLegendItems: ChartLegendItem[] = utils.mapDataToLegendItems(
        comparedData,
        comparedLegendColors
      );
      const uniqueComparedItems =
        utils.getUniqueChartLegendItemsFromComparedLegend(
          items,
          comparedLegendItems
        );

      return [...items, ...uniqueComparedItems];
    } else {
      return items;
    }
  }
);

const getTimeRangeTitle = (timePeriod: TimePeriod, timeRange: string): string =>
  timePeriod === TimePeriod.LAST_12_MONTHS
    ? translate(`filters.periodOfTime.${TimePeriod.LAST_12_MONTHS}`)
    : timeRange;
