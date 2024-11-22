import { createSelector } from '@ngrx/store';

import { ExitEntryEmployeesResponse } from '../../../overview/models';
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

export const getSelectedReason = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.selectedReason
);

export const getComparedSelectedReason = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.selectedReason
);

export const getReasonsTableData = createSelector(
  getCurrentTab,
  getReasonsData,
  getSelectedReason,
  (
    tab: ReasonForLeavingTab,
    data: ReasonForLeavingStats,
    selectedReason: string
  ) => {
    if (data?.reasons) {
      const reasons =
        tab === ReasonForLeavingTab.TOP_REASONS
          ? utils.filterTopReasons(data.reasons)
          : data.reasons;

      return utils.mapReasonsToTableData(reasons, selectedReason);
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
    if (data?.reasons) {
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
    if (data?.reasons) {
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
  getComparedSelectedReason,
  (
    tab: ReasonForLeavingTab,
    data: ReasonForLeavingStats,
    selectedReason: string
  ) => {
    if (data?.reasons) {
      const reasons =
        tab === ReasonForLeavingTab.TOP_REASONS
          ? utils.filterTopReasons(data.reasons)
          : data.reasons;

      return utils.mapReasonsToTableData(reasons, selectedReason);
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
    if (data?.reasons) {
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
  getComparedReasonsData,
  (tab: ReasonForLeavingTab, data: ReasonForLeavingStats) => {
    if (data?.reasons) {
      const reasons =
        tab === ReasonForLeavingTab.TOP_REASONS
          ? utils.filterTopReasons(data.reasons)
          : data.reasons;

      return data?.reasons ? utils.mapReasonsToChildren(reasons) : [];
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

export const getLeaversByReasonLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.leavers.loading
);

export const getLeaversByReasonData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) => {
    if (!state.reasonsForLeaving.leavers.data) {
      return undefined as ExitEntryEmployeesResponse;
    }
    if (
      state.reasonsForLeaving.selectedTab ===
      ReasonForLeavingTab.OVERALL_REASONS
    ) {
      return state.reasonsForLeaving.leavers.data;
    } else {
      const topReasons = utils.filterTopReasons(
        state.reasonsForLeaving.reasons.data.reasons
      );

      const leavers = state.reasonsForLeaving.leavers.data.employees.filter(
        (item) =>
          topReasons.some((reason) => reason.interviewId === +item.interviewId)
      );

      return {
        employees: leavers,
        responseModified: topReasons.length === leavers.length,
      };
    }
  }
);
