import { createAction, props, union } from '@ngrx/store';

import {
  AttritionOverTime,
  EmployeesRequest,
  IdValue,
} from '../../../shared/models';
import { ChartType } from '../../models/chart-type.enum';
import { OrgUnitFluctuationData } from '../../models/org-unit-fluctuation-data.model';
import { OrgUnitFluctuationRate } from '../../org-chart/models';
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
  props<{ data: OrgUnitFluctuationData[] }>()
);

export const loadOrgChartFailure = createAction(
  '[Organizational View] Load Org Chart Failure',
  props<{ errorMessage: string }>()
);

export const loadOrgUnitFluctuationMeta = createAction(
  '[Organizational View] Load Org Unit Fluctuation Meta',
  props<{ data: OrgUnitFluctuationData }>()
);

export const loadOrgUnitFluctuationRate = createAction(
  '[Organizational View] Load Org Unit Fluctuation Rate',
  props<{ request: EmployeesRequest }>()
);

export const loadOrgUnitFluctuationRateSuccess = createAction(
  '[Organizational View] Load Org Unit Fluctuation Rate Success',
  props<{ rate: OrgUnitFluctuationRate }>()
);

export const loadOrgUnitFluctuationRateFailure = createAction(
  '[Organizational View] Load Org Unit Fluctuation Rate Failure',
  props<{ errorMessage: string }>()
);

export const loadWorldMapFluctuationContinentMeta = createAction(
  '[Organizational View] Load World Map Fluctuation Continent Meta',
  props<{ continent: string }>()
);

export const loadWorldMapFluctuationCountryMeta = createAction(
  '[Organizational View] Load World Map Fluctuation Country Meta',
  props<{ country: string }>()
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
  props<{ data: OrgUnitFluctuationData }>()
);

export const loadParentSuccess = createAction(
  '[Organizational View] Load Parent Success',
  props<{ idValue: IdValue }>()
);

export const loadParentFailure = createAction(
  '[Organizational View] Load Parent Failure',
  props<{ errorMessage: string }>()
);

export const loadAttritionOverTimeOrgChart = createAction(
  '[Organizational View] Load AttritionOverTime for plus minus three months',
  props<{ orgUnit: string }>()
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
  loadOrgUnitFluctuationMeta,
  loadOrgUnitFluctuationRate,
  loadOrgUnitFluctuationRateSuccess,
  loadOrgUnitFluctuationRateFailure,
  loadWorldMapFluctuationContinentMeta,
  loadWorldMapFluctuationCountryMeta,
  loadWorldMap,
  loadWorldMapSuccess,
  loadWorldMapFailure,
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartSuccess,
  loadAttritionOverTimeOrgChartFailure,
});

export type OrganizationalViewActions = typeof all;
