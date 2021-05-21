import { createAction, props, union } from '@ngrx/store';

import { AttritionOverTime, EmployeesRequest } from '../../../shared/models';
import { OverviewFluctuationRates } from '../../../shared/models/overview-fluctuation-rates';

export const loadAttritionOverTimeOverview = createAction(
  '[Overview] Load AttritionOverTime for last three years',
  props<{ request: EmployeesRequest }>()
);

export const loadAttritionOverTimeOverviewSuccess = createAction(
  '[Overview] Load AttritionOverTime for last three years Success',
  props<{ data: AttritionOverTime }>()
);

export const loadAttritionOverTimeOverviewFailure = createAction(
  '[Overview] Load AttritionOverTime for last three years Failure',
  props<{ errorMessage: string }>()
);

export const loadFluctuationRatesOverview = createAction(
  '[Overview] Load FluctuationRates with entries and exits',
  props<{ request: EmployeesRequest }>()
);

export const loadFluctuationRatesOverviewSuccess = createAction(
  '[Overview] Load FluctuationRates with entries and exits Success',
  props<{ data: OverviewFluctuationRates }>()
);

export const loadFluctuationRatesOverviewFailure = createAction(
  '[Overview] Load FluctuationRates with entries and exits Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewSuccess,
  loadAttritionOverTimeOverviewFailure,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewSuccess,
  loadFluctuationRatesOverviewFailure,
});

export type OverviewActions = typeof all;
