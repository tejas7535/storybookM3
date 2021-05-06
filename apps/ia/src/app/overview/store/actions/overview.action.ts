import { createAction, props, union } from '@ngrx/store';

import { AttritionOverTime, EmployeesRequest } from '../../../shared/models';

export const loadAttritionOverTime = createAction(
  '[Overview] Load AttritionOverTime',
  props<{ request: EmployeesRequest }>()
);

export const loadAttritionOverTimeSuccess = createAction(
  '[Overview] Load AttritionOverTime Success',
  props<{ data: AttritionOverTime }>()
);

export const loadAttritionOverTimeFailure = createAction(
  '[Overview] Load AttritionOverTime Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadAttritionOverTimeData: loadAttritionOverTime,
  loadAttritionOverTimeDataSuccess: loadAttritionOverTimeSuccess,
  loadAttritionOverTimeDataFailure: loadAttritionOverTimeFailure,
});

export type OverviewActions = typeof all;
