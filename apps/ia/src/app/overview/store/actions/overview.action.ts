import { createAction, props, union } from '@ngrx/store';

import { AttritionOverTime, EmployeesRequest } from '../../../shared/models';
import { ChartType } from '../../models/chart-type.enum';
import { OrgChartEmployee } from '../../org-chart/models/org-chart-employee.model';
import { CountryData } from '../../world-map/models/country-data.model';

export const initOverview = createAction('[Overview] Init');

export const chartTypeSelected = createAction(
  '[Overview] Chart type selected',
  props<{ chartType: ChartType }>()
);

export const loadOrgChart = createAction(
  '[Overview] Load Org Chart',
  props<{ request: EmployeesRequest }>()
);

export const loadOrgChartSuccess = createAction(
  '[Overview] Load Org Chart Success',
  props<{ employees: OrgChartEmployee[] }>()
);

export const loadOrgChartFailure = createAction(
  '[Overview] Load Org Chart Failure',
  props<{ errorMessage: string }>()
);

export const loadWorldMap = createAction(
  '[Overview] Load World Map',
  props<{ request: EmployeesRequest }>()
);

export const loadWorldMapSuccess = createAction(
  '[Overview] Load World Map Success',
  props<{ data: CountryData[] }>()
);

export const loadWorldMapFailure = createAction(
  '[Overview] Load World Map Failure',
  props<{ errorMessage: string }>()
);

export const loadParent = createAction(
  '[Overview] Load Parent',
  props<{ employee: OrgChartEmployee }>()
);

export const loadParentSuccess = createAction(
  '[Overview] Load Parent Success',
  props<{ employee: OrgChartEmployee }>()
);

export const loadParentFailure = createAction(
  '[Overview] Load Parent Failure',
  props<{ errorMessage: string }>()
);

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
  initOverview,
  chartTypeSelected,
  loadOrgChart,
  loadOrgChartSuccess,
  loadOrgChartFailure,
  loadWorldMap,
  loadWorldMapSuccess,
  loadWorldMapFailure,
  loadAttritionOverTimeData: loadAttritionOverTime,
  loadAttritionOverTimeDataSuccess: loadAttritionOverTimeSuccess,
  loadAttritionOverTimeDataFailure: loadAttritionOverTimeFailure,
});

export type OverviewActions = typeof all;
