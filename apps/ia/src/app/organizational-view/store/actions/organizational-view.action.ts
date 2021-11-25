import { createAction, props, union } from '@ngrx/store';

import {
  AttritionOverTime,
  Employee,
  EmployeesRequest,
} from '../../../shared/models';
import { ChartType } from '../../models/chart-type.enum';
import { CountryData } from '../../world-map/models/country-data.model';

export const chartTypeSelected = createAction(
  '[Organizational View] Chart type selected',
  props<{ chartType: ChartType }>()
);

export const loadOrgChart = createAction(
  '[Organizational View] Load Org Chart',
  props<{ request: EmployeesRequest }>()
);

export const loadOrgChartSuccess = createAction(
  '[Organizational View] Load Org Chart Success',
  props<{ employees: Employee[] }>()
);

export const loadOrgChartFailure = createAction(
  '[Organizational View] Load Org Chart Failure',
  props<{ errorMessage: string }>()
);

export const loadWorldMap = createAction(
  '[Organizational View] Load World Map',
  props<{ request: EmployeesRequest }>()
);

export const loadWorldMapSuccess = createAction(
  '[Organizational View] Load World Map Success',
  props<{ data: CountryData[] }>()
);

export const loadWorldMapFailure = createAction(
  '[Organizational View] Load World Map Failure',
  props<{ errorMessage: string }>()
);

export const loadParent = createAction(
  '[Organizational View] Load Parent',
  props<{ employee: Employee }>()
);

export const loadParentSuccess = createAction(
  '[Organizational View] Load Parent Success',
  props<{ employee: Employee }>()
);

export const loadParentFailure = createAction(
  '[Organizational View] Load Parent Failure',
  props<{ errorMessage: string }>()
);

export const loadAttritionOverTimeOrgChart = createAction(
  '[Organizational View] Load AttritionOverTime for plus minus three months',
  props<{ request: EmployeesRequest }>()
);

export const loadAttritionOverTimeOrgChartSuccess = createAction(
  '[Organizational View] Load AttritionOverTime for plus minus three months Success',
  props<{ data: AttritionOverTime }>()
);

export const loadAttritionOverTimeOrgChartFailure = createAction(
  '[Organizational View] Load AttritionOverTime for plus minus three months Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  chartTypeSelected,
  loadOrgChart,
  loadOrgChartSuccess,
  loadOrgChartFailure,
  loadWorldMap,
  loadWorldMapSuccess,
  loadWorldMapFailure,
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartSuccess,
  loadAttritionOverTimeOrgChartFailure,
});

export type OrganizationalViewActions = typeof all;
