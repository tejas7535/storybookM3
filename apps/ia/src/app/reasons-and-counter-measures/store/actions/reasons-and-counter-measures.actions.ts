import { createAction, props } from '@ngrx/store';

import { EmployeesRequest, TimePeriod } from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';

export const loadReasonsWhyPeopleLeft = createAction(
  '[ReasonsAndCounterMeasures] Load ReasonsWhyPeopleLeft',
  props<{ request: EmployeesRequest }>()
);

export const loadReasonsWhyPeopleLeftSuccess = createAction(
  '[ReasonsAndCounterMeasures] Load ReasonsWhyPeopleLeft Success',
  props<{ data: ReasonForLeavingStats[] }>()
);

export const loadReasonsWhyPeopleLeftFailure = createAction(
  '[ReasonsAndCounterMeasures] Load ReasonsWhyPeopleLeft Failure',
  props<{ errorMessage: string }>()
);

export const loadComparedReasonsWhyPeopleLeft = createAction(
  '[ReasonsAndCounterMeasures] Load ComparedReasonsWhyPeopleLeft',
  props<{ request: EmployeesRequest }>()
);

export const loadComparedReasonsWhyPeopleLeftSuccess = createAction(
  '[ReasonsAndCounterMeasures] Load ComparedReasonsWhyPeopleLeft Success',
  props<{ data: ReasonForLeavingStats[] }>()
);

export const loadComparedReasonsWhyPeopleLeftFailure = createAction(
  '[ReasonsAndCounterMeasures] Load ComparedReasonsWhyPeopleLeft Failure',
  props<{ errorMessage: string }>()
);

export const changeComparedFilter = createAction(
  '[ReasonsAndCounterMeasures] Change ComparedFilter',
  props<{ comparedSelectedOrgUnit: string }>()
);

export const changeComparedTimePeriod = createAction(
  '[ReasonsAndCounterMeasures] Change ComparedTimePeriod',
  props<{ comparedSelectedTimePeriod: TimePeriod }>()
);

export const changeComparedTimeRange = createAction(
  '[ReasonsAndCounterMeasures] Change ComparedTimeRange',
  props<{ comparedSelectedTimeRange: string }>()
);

export const resetCompareMode = createAction(
  '[ReasonsAndCounterMeasures] Reset Compare Mode'
);
