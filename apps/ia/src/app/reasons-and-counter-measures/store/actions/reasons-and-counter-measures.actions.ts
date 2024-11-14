import { createAction, props, union } from '@ngrx/store';

import { ExitEntryEmployeesResponse } from '../../../overview/models';
import { ReasonForLeavingStats, ReasonForLeavingTab } from '../../models';

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
});

export type ReasonsAndCounterMeasuresActions = typeof all;
