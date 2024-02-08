import { createAction, props, union } from '@ngrx/store';

import {
  AttritionOverTime,
  EmployeesRequest,
  FilterDimension,
} from '../../../shared/models';
import { ChartType, DimensionFluctuationData, SeriesType } from '../../models';
import {
  DimensionParentResponse,
  OrgChartEmployee,
} from '../../org-chart/models';
import { CountryDataAttrition } from '../../world-map/models/country-data-attrition.model';

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
  props<{ data: CountryDataAttrition[] }>()
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

export const loadParentAttritionOverTimeOrgChart = createAction(
  '[Organizational View] Load Parent AttritionOverTime for plus minus three months',
  props<{ request: EmployeesRequest; dimensionName: string }>()
);

export const loadParentAttritionOverTimeOrgChartSuccess = createAction(
  '[Organizational View] Load Parent AttritionOverTime for plus minus three months Success',
  props<{ data: AttritionOverTime }>()
);

export const loadParentAttritionOverTimeOrgChartFailure = createAction(
  '[Organizational View] Load Parent AttritionOverTime for plus minus three months Failure',
  props<{ errorMessage: string }>()
);

export const loadChildAttritionOverTimeOrgChart = createAction(
  '[Organizational View] Load Child AttritionOverTime for plus minus three months',
  props<{
    filterDimension: FilterDimension;
    dimensionKey: string;
    dimensionName: string;
  }>()
);

export const loadChildAttritionOverTimeOrgChartSuccess = createAction(
  '[Organizational View] Load Child AttritionOverTime for plus minus three months Success',
  props<{ data: AttritionOverTime }>()
);

export const loadChildAttritionOverTimeOrgChartFailure = createAction(
  '[Organizational View] Load Child AttritionOverTime for plus minus three months Failure',
  props<{ errorMessage: string }>()
);

export const changeAttritionOverTimeSeries = createAction(
  '[Organizational View] Change Attrition Over Time Series',
  props<{ serie: SeriesType }>()
);

export const loadChildAttritionOverTimeForWorldMap = createAction(
  '[Organizational View] Load Child AttritionOverTime for world map',
  props<{
    filterDimension: FilterDimension;
    dimensionName: string;
  }>()
);

export const loadOrgChartEmployees = createAction(
  '[Organizational View] Load Org Chart Employees',
  props<{ data: DimensionFluctuationData }>()
);

export const loadOrgChartEmployeesSuccess = createAction(
  '[Organizational View] Load Org Chart Employees Success',
  props<{ employees: OrgChartEmployee[] }>()
);

export const loadOrgChartEmployeesFailure = createAction(
  '[Organizational View] Load Org Chart Employees Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  chartTypeSelected,
  loadOrgChart,
  loadOrgChartSuccess,
  loadOrgChartFailure,
  loadWorldMapFluctuationRegionMeta,
  loadWorldMapFluctuationCountryMeta,
  loadWorldMap,
  loadWorldMapSuccess,
  loadWorldMapFailure,
  loadParentAttritionOverTimeOrgChart,
  loadParentAttritionOverTimeOrgChartSuccess,
  loadParentAttritionOverTimeOrgChartFailure,
  loadOrgChartEmployees,
  loadOrgChartEmployeesSuccess,
  loadOrgChartEmployeesFailure,
});

export type OrganizationalViewActions = typeof all;
