import { createSelector } from '@ngrx/store';

import { ReasonForLeavingStats, ReasonForLeavingTab } from '../../models';
import {
  ReasonsAndCounterMeasuresState,
  selectReasonsAndCounterMeasuresState,
} from '..';
import * as utils from './reasons-and-counter-measures.selector.utils';
import { getPercentageValue } from './reasons-and-counter-measures.selector.utils';

export const getCurrentTab = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) => state.reasonsForLeaving.selectedTab
);

export const getReasonsData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.data
);

export const getReasonsTableData = createSelector(
  getCurrentTab,
  getReasonsData,
  (tab: ReasonForLeavingTab, data: ReasonForLeavingStats) => {
    if (data) {
      const reasons =
        tab === ReasonForLeavingTab.TOP_REASONS
          ? utils.filterTopReasons(data.reasons)
          : data.reasons;

      return utils.mapReasonsToTableData(reasons);
    } else {
      return [];
    }
  }
);

export const getReasonsLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.loading
);

export const getReasonsChartData = createSelector(
  getCurrentTab,
  getReasonsData,
  (tab: ReasonForLeavingTab, data: ReasonForLeavingStats) => {
    if (data) {
      const reasons =
        tab === ReasonForLeavingTab.TOP_REASONS
          ? utils.filterTopReasons(data.reasons)
          : data.reasons;

      return utils.mapReasonsToChartData(reasons);
    } else {
      return [];
    }
  }
);

export const getReasonsChildren = createSelector(
  getCurrentTab,
  getReasonsData,
  (tab: ReasonForLeavingTab, data: ReasonForLeavingStats) => {
    if (data) {
      const reasons =
        tab === ReasonForLeavingTab.TOP_REASONS
          ? utils.filterTopReasons(data.reasons)
          : data.reasons;

      return utils.mapReasonsToChildren(reasons);
    } else {
      return [];
    }
  }
);

export const getConductedInterviewsInfo = createSelector(
  getReasonsData,
  (data: ReasonForLeavingStats) =>
    data
      ? {
          conducted: data.conductedInterviews,
          percentage: getPercentageValue(
            data.conductedInterviews,
            data.totalInterviews
          ),
        }
      : undefined
);

export const getComparedReasonsData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.data
);

export const getComparedReasonsTableData = createSelector(
  getCurrentTab,
  getComparedReasonsData,
  (tab: ReasonForLeavingTab, data: ReasonForLeavingStats) => {
    if (data) {
      const reasons =
        tab === ReasonForLeavingTab.TOP_REASONS
          ? utils.filterTopReasons(data.reasons)
          : data.reasons;

      return utils.mapReasonsToTableData(reasons);
    } else {
      return [];
    }
  }
);

export const getComparedReasonsLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.loading
);

export const getComparedReasonsChartData = createSelector(
  getCurrentTab,
  getComparedReasonsData,
  (tab: ReasonForLeavingTab, data: ReasonForLeavingStats) => {
    if (data) {
      const reasons =
        tab === ReasonForLeavingTab.TOP_REASONS
          ? utils.filterTopReasons(data.reasons)
          : data.reasons;

      return utils.mapReasonsToChartData(reasons);
    } else {
      return [];
    }
  }
);

export const getComparedReasonsChildren = createSelector(
  getCurrentTab,
  getReasonsData,
  (tab: ReasonForLeavingTab, data: ReasonForLeavingStats) => {
    if (data) {
      const reasons =
        tab === ReasonForLeavingTab.TOP_REASONS
          ? utils.filterTopReasons(data.reasons)
          : data.reasons;

      return data ? utils.mapReasonsToChildren(reasons) : [];
    } else {
      return [];
    }
  }
);

export const getComparedConductedInterviewsInfo = createSelector(
  getComparedReasonsData,
  (data: ReasonForLeavingStats) =>
    data
      ? {
          conducted: data.conductedInterviews,
          percentage: getPercentageValue(
            data.conductedInterviews,
            data.totalInterviews
          ),
        }
      : undefined
);
