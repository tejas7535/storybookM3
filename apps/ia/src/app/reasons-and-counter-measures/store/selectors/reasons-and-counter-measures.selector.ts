import { createSelector } from '@ngrx/store';

import { ReasonForLeavingStats } from '../../models';
import {
  ReasonsAndCounterMeasuresState,
  selectReasonsAndCounterMeasuresState,
} from '..';
import * as utils from './reasons-and-counter-measures.selector.utils';
import { getPercentageValue } from './reasons-and-counter-measures.selector.utils';

export const getReasonsData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.data
);

export const getOverallReasonsTableData = createSelector(
  getReasonsData,
  (data: ReasonForLeavingStats) =>
    data ? utils.mapReasonsToTableData(data.reasons) : []
);

export const getReasonsLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.loading
);

export const getOverallReasonsChartData = createSelector(
  getReasonsData,
  (data: ReasonForLeavingStats) =>
    data ? utils.mapReasonsToChartData(data.reasons) : []
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

export const getOverallComparedReasonsTableData = createSelector(
  getComparedReasonsData,
  (data: ReasonForLeavingStats) =>
    data ? utils.mapReasonsToTableData(data.reasons) : []
);

export const getComparedReasonsLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.loading
);

export const getOverallComparedReasonsChartData = createSelector(
  getComparedReasonsData,
  (data: ReasonForLeavingStats) =>
    data ? utils.mapReasonsToChartData(data.reasons) : []
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
