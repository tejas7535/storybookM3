import { createAction, props, union } from '@ngrx/store';

import { AttritionOverTime, EmployeesRequest } from '../../../shared/models';
import { ChartType } from '../../models/chart-type.enum';
import { DimensionFluctuationData } from '../../models/dimension-fluctuation-data.model';
import {
  DimensionParentResponse,
  OrgUnitFluctuationRate,
} from '../../org-chart/models';
import { CountryData } from '../../world-map/models/country-data.model';

export const loadOrganizationalViewData = createAction(
  '[Organizational View] Load Organizational View Data'
);

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
  props<{ data: DimensionFluctuationData[] }>()
);

export const loadOrgChartFailure = createAction(
  '[Organizational View] Load Org Chart Failure',
  props<{ errorMessage: string }>()
);

export const loadOrgChartFluctuationMeta = createAction(
  '[Organizational View] Load Org Chart Fluctuation Meta',
  props<{ data: DimensionFluctuationData }>()
);

export const loadOrgChartFluctuationRate = createAction(
  '[Organizational View] Load Org Chart Fluctuation Rate',
  props<{ request: EmployeesRequest }>()
);

export const loadOrgChartFluctuationRateSuccess = createAction(
  '[Organizational View] Load Org Chart Fluctuation Rate Success',
  props<{ rate: OrgUnitFluctuationRate }>()
);

export const loadOrgChartFluctuationRateFailure = createAction(
  '[Organizational View] Load Org Chart Fluctuation Rate Failure',
  props<{ errorMessage: string }>()
);

export const loadWorldMapFluctuationRegionMeta = createAction(
  '[Organizational View] Load World Map Fluctuation Region Meta',
  props<{ region: string }>()
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
  props<{ data: DimensionFluctuationData }>()
);

export const loadParentSuccess = createAction(
  '[Organizational View] Load Parent Success',
  props<{ response: DimensionParentResponse }>()
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
  loadOrgUnitFluctuationMeta: loadOrgChartFluctuationMeta,
  loadOrgUnitFluctuationRate: loadOrgChartFluctuationRate,
  loadOrgUnitFluctuationRateSuccess: loadOrgChartFluctuationRateSuccess,
  loadOrgUnitFluctuationRateFailure: loadOrgChartFluctuationRateFailure,
  loadWorldMapFluctuationRegionMeta,
  loadWorldMapFluctuationCountryMeta,
  loadWorldMap,
  loadWorldMapSuccess,
  loadWorldMapFailure,
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartSuccess,
  loadAttritionOverTimeOrgChartFailure,
});

export type OrganizationalViewActions = typeof all;
