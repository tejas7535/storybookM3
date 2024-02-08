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
import {
  changeAttritionOverTimeSeries,
  chartTypeSelected,
  loadChildAttritionOverTimeForWorldMap,
  loadChildAttritionOverTimeOrgChart,
  loadChildAttritionOverTimeOrgChartFailure,
  loadChildAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartEmployees,
  loadOrgChartEmployeesFailure,
  loadOrgChartEmployeesSuccess,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentAttritionOverTimeOrgChart,
  loadParentAttritionOverTimeOrgChartFailure,
  loadParentAttritionOverTimeOrgChartSuccess,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from './organizational-view.action';

describe('Organizational View Actions', () => {
  const errorMessage = 'An error occured';

  test('chartTypeSelected', () => {
    const chartType = ChartType.WORLD_MAP;
    const action = chartTypeSelected({ chartType });

    expect(action).toEqual({
      chartType,
      type: '[Organizational View] Chart type selected',
    });
  });
  test('loadOrgChart', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadOrgChart({ request });

    expect(action).toEqual({
      request,
      type: '[Organizational View] Load Org Chart',
    });
  });

  test('loadOrgChartSuccess', () => {
    const data: DimensionFluctuationData[] = [];

    const action = loadOrgChartSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Organizational View] Load Org Chart Success',
    });
  });

  test('loadOrgChartFailure', () => {
    const action = loadOrgChartFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load Org Chart Failure',
    });
  });

  test('loadWorldMap', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadWorldMap({ request });

    expect(action).toEqual({
      request,
      type: '[Organizational View] Load World Map',
    });
  });

  test('loadWorldMapSuccess', () => {
    const data: CountryDataAttrition[] = [];

    const action = loadWorldMapSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Organizational View] Load World Map Success',
    });
  });

  test('loadWorldMapFailure', () => {
    const action = loadWorldMapFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load World Map Failure',
    });
  });

  test('loadParent', () => {
    const data = {
      id: '1515',
      parentId: '12',
    } as DimensionFluctuationData;

    const action = loadParent({ data });

    expect(action).toEqual({
      data,
      type: '[Organizational View] Load Parent',
    });
  });

  test('loadParentSuccess', () => {
    const response = {
      data: {
        id: '1515',
        value: 'Sh/ZHZ',
      },
      filterDimension: FilterDimension.ORG_UNIT,
    } as DimensionParentResponse;

    const action = loadParentSuccess({ response });

    expect(action).toEqual({
      response,
      type: '[Organizational View] Load Parent Success',
    });
  });

  test('loadParentFailure', () => {
    const action = loadParentFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load Parent Failure',
    });
  });

  test('loadParentAttritionOverTimeOrgChart', () => {
    const orgUnit = 'ACB';
    const dimensionName = 'SH/ZHZ';

    const action = loadParentAttritionOverTimeOrgChart({
      request: { value: orgUnit } as EmployeesRequest,
      dimensionName,
    });

    expect(action).toEqual({
      request: { value: orgUnit },
      dimensionName,
      type: '[Organizational View] Load Parent AttritionOverTime for plus minus three months',
    });
  });

  test('loadParentAttritionOverTimeOrgChartSuccess', () => {
    const data = {} as unknown as AttritionOverTime;

    const action = loadParentAttritionOverTimeOrgChartSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Organizational View] Load Parent AttritionOverTime for plus minus three months Success',
    });
  });

  test('loadParentAttritionOverTimeOrgChartFailure', () => {
    const action = loadParentAttritionOverTimeOrgChartFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load Parent AttritionOverTime for plus minus three months Failure',
    });
  });

  test('loadChildAttritionOverTimeOrgChart', () => {
    const data = {
      filterDimension: FilterDimension.COUNTRY,
      dimensionKey: 'PL',
      dimensionName: 'Poland',
    };

    const action = loadChildAttritionOverTimeOrgChart(data);

    expect(action).toEqual({
      ...data,
      type: '[Organizational View] Load Child AttritionOverTime for plus minus three months',
    });
  });

  test('loadChildAttritionOverTimeOrgChartSuccess', () => {
    const data = {} as unknown as AttritionOverTime;

    const action = loadChildAttritionOverTimeOrgChartSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Organizational View] Load Child AttritionOverTime for plus minus three months Success',
    });
  });

  test('loadChildAttritionOverTimeOrgChartFailure', () => {
    const action = loadChildAttritionOverTimeOrgChartFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load Child AttritionOverTime for plus minus three months Failure',
    });
  });

  test('changeAttritionOverTimeSeries', () => {
    const serie = SeriesType.UNFORCED_LEAVERS;
    const action = changeAttritionOverTimeSeries({ serie });

    expect(action).toEqual({
      serie,
      type: '[Organizational View] Change Attrition Over Time Series',
    });
  });

  test('loadChildAttritionOverTimeForWorldMap', () => {
    const filterDimension = FilterDimension.COUNTRY;
    const dimensionName = 'Poland';
    const action = loadChildAttritionOverTimeForWorldMap({
      filterDimension,
      dimensionName,
    });

    expect(action).toEqual({
      type: '[Organizational View] Load Child AttritionOverTime for world map',
      filterDimension,
      dimensionName,
    });
  });

  test('loadOrgChartEmployees', () => {
    const data = { id: '123' } as unknown as DimensionFluctuationData;

    const action = loadOrgChartEmployees({
      data,
    });

    expect(action).toEqual({
      data,
      type: '[Organizational View] Load Org Chart Employees',
    });
  });

  test('loadOrgChartEmployeesSuccess', () => {
    const employees = [] as OrgChartEmployee[];

    const action = loadOrgChartEmployeesSuccess({ employees });

    expect(action).toEqual({
      employees,
      type: '[Organizational View] Load Org Chart Employees Success',
    });
  });

  test('loadOrgChartEmployeesFailure', () => {
    const action = loadOrgChartEmployeesFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load Org Chart Employees Failure',
    });
  });
});
