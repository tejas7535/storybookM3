import { createAction, props, union } from '@ngrx/store';

import {
  EmployeesRequest,
  FilterDimension,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';

export const loadReasonsAndCounterMeasuresData = createAction(
  '[ReasonsAndCounterMeasures] Load Reasons and Counter Measures Data'
);

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

export const comparedFilterDimensionSelected = createAction(
  '[ReasonsAndCounterMeasures] Compared Filter Dimension Selected',
  props<{ filterDimension: FilterDimension; filter: SelectedFilter }>()
);

export const loadComparedFilterDimensionData = createAction(
  '[ReasonsAndCounterMeasures] Load Compared Filter Dimension Data',
  props<{ filterDimension: FilterDimension; searchFor?: string }>()
);

export const loadComparedFilterDimensionDataSuccess = createAction(
  '[ReasonsAndCounterMeasures] Load Compared Filter Dimension Data Success',
  props<{ filterDimension: FilterDimension; items: IdValue[] }>()
);

export const loadComparedFilterDimensionDataFailure = createAction(
  '[ReasonsAndCounterMeasures] Load Compared Filter Dimension Data Failure',
  props<{ filterDimension: FilterDimension; errorMessage: string }>()
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

export const comparedFilterSelected = createAction(
  '[ReasonsAndCounterMeasures] Change ComparedFilter',
  props<{ filter: SelectedFilter }>()
);

export const comparedTimePeriodSelected = createAction(
  '[ReasonsAndCounterMeasures] Change ComparedTimePeriod',
  props<{ timePeriod: TimePeriod }>()
);

export const resetCompareMode = createAction(
  '[ReasonsAndCounterMeasures] Reset Compare Mode'
);

export const loadComparedOrgUnits = createAction(
  '[ReasonsAndCounterMeasures] Load Compared Org Units',
  props<{ searchFor: string }>()
);

export const loadComparedOrgUnitsSuccess = createAction(
  '[ReasonsAndCounterMeasures] Load Compared Org Units Success',
  props<{ items: IdValue[] }>()
);

export const loadComparedOrgUnitsFailure = createAction(
  '[ReasonsAndCounterMeasures] Load Compared Org Units Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftSuccess,
  loadReasonsWhyPeopleLeftFailure,
  comparedFilterDimensionSelected,
  loadComparedFilterDimensionData,
  loadComparedFilterDimensionDataSuccess,
  loadComparedFilterDimensionDataFailure,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadComparedReasonsWhyPeopleLeftFailure,
  comparedFilterSelected,
  comparedTimePeriodSelected,
  resetCompareMode,
  loadComparedOrgUnits,
  loadComparedOrgUnitsSuccess,
  loadComparedOrgUnitsFailure,
});

export type ReasonsAndCounterMeasuresActions = typeof all;
