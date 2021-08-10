import { createAction, props } from '@ngrx/store';

import { EmployeesRequest } from '../../../shared/models';
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
