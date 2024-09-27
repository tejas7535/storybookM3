import { createAction, props, union } from '@ngrx/store';

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

const all = union({
  selectReasonsForLeavingTab,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftSuccess,
  loadReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadComparedReasonsWhyPeopleLeftFailure,
});

export type ReasonsAndCounterMeasuresActions = typeof all;
