import { createAction, props, union } from '@ngrx/store';

import { ExitEntryEmployeesResponse } from '../../../overview/models';
import {
  ReasonForLeavingStats,
  ReasonForLeavingTab,
  TextAnalysisResponse,
} from '../../models';

export const selectReasonsForLeavingTab = createAction(
  '[ReasonsAndCounterMeasures] Select ReasonsForLeaving Tab',
  props<{ selectedTab: ReasonForLeavingTab }>()
);

export const loadReasonsWhyPeopleLeft = createAction(
  '[ReasonsAndCounterMeasures] Load ReasonsWhyPeopleLeft'
);

export const loadReasonsWhyPeopleLeftSuccess = createAction(
  '[ReasonsAndCounterMeasures] Load ReasonsWhyPeopleLeft Success',
  props<{ data: ReasonForLeavingStats }>()
);

export const loadReasonsWhyPeopleLeftFailure = createAction(
  '[ReasonsAndCounterMeasures] Load ReasonsWhyPeopleLeft Failure',
  props<{ errorMessage: string }>()
);

export const loadComparedReasonsWhyPeopleLeft = createAction(
  '[ReasonsAndCounterMeasures] Load ComparedReasonsWhyPeopleLeft'
);

export const loadComparedReasonsWhyPeopleLeftSuccess = createAction(
  '[ReasonsAndCounterMeasures] Load ComparedReasonsWhyPeopleLeft Success',
  props<{ data: ReasonForLeavingStats }>()
);

export const loadComparedReasonsWhyPeopleLeftFailure = createAction(
  '[ReasonsAndCounterMeasures] Load ComparedReasonsWhyPeopleLeft Failure',
  props<{ errorMessage: string }>()
);

export const loadLeaversByReason = createAction(
  '[ReasonsAndCounterMeasures] Load LeaversByReason',
  props<{ reasonId: number; detailedReasonId?: number }>()
);

export const loadComparedLeaversByReason = createAction(
  '[ReasonsAndCounterMeasures] Load ComparedLeaversByReason',
  props<{ reasonId: number; detailedReasonId?: number }>()
);

export const loadLeaversByReasonSuccess = createAction(
  '[ReasonsAndCounterMeasures] Load LeaversByReason Success',
  props<{ data: ExitEntryEmployeesResponse }>()
);

export const loadLeaversByReasonFailure = createAction(
  '[ReasonsAndCounterMeasures] Load LeaversByReason Failure',
  props<{ errorMessage: string }>()
);

export const selectReason = createAction(
  '[ReasonsAndCounterMeasures] Select Reason',
  props<{ reason: string }>()
);

export const selectComparedReason = createAction(
  '[ReasonsAndCounterMeasures] Select Compared Reason',
  props<{ reason: string }>()
);

export const loadReasonAnalysis = createAction(
  '[ReasonsAndCounterMeasures] Load Reason Analysis',
  props<{ reasonIds: number[] }>()
);

export const loadReasonAnalysisSuccess = createAction(
  '[ReasonsAndCounterMeasures] Load Reason Analysis Success',
  props<{ data: TextAnalysisResponse; selectedReasonIds: number[] }>()
);

export const loadReasonAnalysisFailure = createAction(
  '[ReasonsAndCounterMeasures] Load Reason Analysis Failure',
  props<{ errorMessage: string }>()
);

export const toggleReasonAnalysis = createAction(
  '[ReasonsAndCounterMeasures] Toggle Reason Analysis',
  props<{ reasonId: number }>()
);

export const loadComparedReasonAnalysis = createAction(
  '[ReasonsAndCounterMeasures] Load Compared Reason Analysis',
  props<{ reasonIds: number[] }>()
);

export const loadComparedReasonAnalysisSuccess = createAction(
  '[ReasonsAndCounterMeasures] Load Compared Reason Analysis Success',
  props<{ data: TextAnalysisResponse; selectedReasonIds: number[] }>()
);

export const loadComparedReasonAnalysisFailure = createAction(
  '[ReasonsAndCounterMeasures] Load Compared Reason Analysis Failure',
  props<{ errorMessage: string }>()
);

export const toggleComparedReasonAnalysis = createAction(
  '[ReasonsAndCounterMeasures] Toggle Compared Reason Analysis',
  props<{ reasonId: number }>()
);

const all = union({
  selectReasonsForLeavingTab,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftSuccess,
  loadReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadLeaversByReason,
  loadLeaversByReasonSuccess,
  loadLeaversByReasonFailure,
  reasonAnalysisRequested: loadReasonAnalysis,
});

export type ReasonsAndCounterMeasuresActions = typeof all;
