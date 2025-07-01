import { createSelector } from '@ngrx/store';

import { ExitEntryEmployeesResponse } from '../../../overview/models';
import {
  AnalysisData,
  GeneralQuestionsAnalysis,
  ReasonForLeavingRank,
  ReasonForLeavingStats,
  ReasonForLeavingTab,
} from '../../models';
import {
  ReasonsAndCounterMeasuresState,
  selectReasonsAndCounterMeasuresState,
} from '..';
import * as utils from './reasons-and-counter-measures.selector.utils';

export const MAX_REASON_ANALYSIS_PRELOAD = 2;

export const getCurrentTab = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) => state.reasonsForLeaving.selectedTab
);

export const getReasonsData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.reasonsData.data
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

export const getReasonsAnalysis = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.reasonAnalysis.data?.answer.reasons
);

export const getComparedReasonsAnalysis = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.reasonAnalysis.data?.answer.reasons
);

export const getReasonAnalysisLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.reasonAnalysis.loading
);

export const getComparedReasonAnalysisLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.reasonAnalysis.loading
);

export const getReasonsTableData = createSelector(
  getCurrentTab,
  getReasonsData,
  getSelectedReason,
  getReasonsAnalysis,
  (
    tab: ReasonForLeavingTab,
    data?: ReasonForLeavingStats,
    selectedReason?: string,
    reasonAnalysis?: AnalysisData[]
  ) => {
    if (data?.reasons) {
      const reasons =
        tab === ReasonForLeavingTab.TOP_REASONS
          ? utils.filterTopReasons(data.reasons)
          : data.reasons;

      return utils.mapReasonsToTableData(
        reasons,
        selectedReason,
        reasonAnalysis
      );
    } else {
      return [];
    }
  }
);

export const getReasonsLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.reasonsData.loading
);

export const getReasonsChartData = createSelector(
  getCurrentTab,
  getReasonsData,
  (tab: ReasonForLeavingTab, data?: ReasonForLeavingStats) => {
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
  (tab: ReasonForLeavingTab, data?: ReasonForLeavingStats) => {
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
  (data: ReasonForLeavingStats | undefined) =>
    data
      ? {
          conducted: data.conductedInterviews,
        }
      : undefined
);

export const getComparedReasonsData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.reasonsData.data
);

export const getComparedReasonsTableData = createSelector(
  getCurrentTab,
  getComparedReasonsData,
  getComparedSelectedReason,
  getComparedReasonsAnalysis,
  (
    tab: ReasonForLeavingTab,
    data?: ReasonForLeavingStats,
    selectedReason?: string,
    reasonAnalysis?: AnalysisData[]
  ) => {
    if (data?.reasons) {
      const reasons =
        tab === ReasonForLeavingTab.TOP_REASONS
          ? utils.filterTopReasons(data.reasons)
          : data.reasons;

      return utils.mapReasonsToTableData(
        reasons,
        selectedReason,
        reasonAnalysis
      );
    } else {
      return [];
    }
  }
);

export const getComparedReasonsLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.reasonsData.loading
);

export const getComparedReasonsChartData = createSelector(
  getCurrentTab,
  getComparedReasonsData,
  (tab: ReasonForLeavingTab, data?: ReasonForLeavingStats) => {
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
  (tab: ReasonForLeavingTab, data?: ReasonForLeavingStats) => {
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
  (data?: ReasonForLeavingStats) =>
    data
      ? {
          conducted: data.conductedInterviews,
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
    if (
      !state.reasonsForLeaving.leavers.data ||
      !state.reasonsForLeaving.reasons.reasonsData.data
    ) {
      return undefined as ExitEntryEmployeesResponse | undefined;
    }
    if (
      state.reasonsForLeaving.selectedTab ===
      ReasonForLeavingTab.OVERALL_REASONS
    ) {
      return state.reasonsForLeaving.leavers.data;
    } else {
      const topReasons = utils.filterTopReasons(
        state.reasonsForLeaving.reasons.reasonsData.data?.reasons
      );

      const leavers = state.reasonsForLeaving.leavers.data?.employees.filter(
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

export const getTopReasonsIds = createSelector(
  getReasonsTableData,
  (data?: (AnalysisData | ReasonForLeavingRank)[]) =>
    data?.map((item) => item.reasonId).slice(0, MAX_REASON_ANALYSIS_PRELOAD) ||
    []
);

export const getTopBenchmarkReasonsIds = createSelector(
  getComparedReasonsTableData,
  (data?: (AnalysisData | ReasonForLeavingRank)[]) =>
    data?.map((item) => item.reasonId).slice(0, MAX_REASON_ANALYSIS_PRELOAD) ||
    []
);

export const getReasonsAnalysisData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.reasonAnalysis.data?.answer.generalQuestions
);

export const getGeneralQuestionsAnalysis = createSelector(
  getReasonsAnalysisData,
  (data: GeneralQuestionsAnalysis) => {
    const chart = data?.chart;
    const reasons = data?.reasonAnalysis.map((item) => ({
      reasonAnalysis: {
        question: item.question,
        reasons: item.data,
      },
    }));
    const result = [];

    if (chart) {
      result.push({
        chart,
        reasonAnalysis: undefined,
      });
    }

    if (reasons) {
      result.push(...reasons);
    }

    return result;
  }
);

export const getComparedReasonsAnalysisData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.reasonAnalysis.data?.answer
      .generalQuestions
);

export const getComparedGeneralQuestionsAnalysis = createSelector(
  getComparedReasonsAnalysisData,
  (data: GeneralQuestionsAnalysis) => {
    const chart = data?.chart;
    const reasons = data?.reasonAnalysis.map((item) => ({
      reasonAnalysis: {
        question: item.question,
        reasons: item.data,
      },
    }));
    const result = [];

    if (chart) {
      result.push({
        chart,
        reasonAnalysis: undefined,
      });
    }

    if (reasons) {
      result.push(...reasons);
    }

    return result;
  }
);
