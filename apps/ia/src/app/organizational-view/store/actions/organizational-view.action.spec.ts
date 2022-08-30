import {
  AttritionOverTime,
  EmployeesRequest,
  IdValue,
} from '../../../shared/models';
import { ChartType } from '../../models/chart-type.enum';
import { OrgUnitFluctuationData } from '../../models/org-unit-fluctuation-data.model';
import { OrgUnitFluctuationRate } from '../../org-chart/models';
import { CountryData } from '../../world-map/models/country-data.model';
import {
  chartTypeSelected,
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartFailure,
  loadAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadOrgUnitFluctuationMeta,
  loadOrgUnitFluctuationRate,
  loadOrgUnitFluctuationRateFailure,
  loadOrgUnitFluctuationRateSuccess,
  loadParent,
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
    const data: OrgUnitFluctuationData[] = [];

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

  test('loadOrgUnitFluctuationMeta', () => {
    const data = {
      orgUnit: 'SH/ZHZ',
      id: '1',
    } as OrgUnitFluctuationData;
    const action = loadOrgUnitFluctuationMeta({ data });

    expect(action).toEqual({
      data,
      type: '[Organizational View] Load Org Unit Fluctuation Meta',
    });
  });

  test('loadOrgUnitFluctuationRate', () => {
    const request = {} as unknown as EmployeesRequest;
    const action = loadOrgUnitFluctuationRate({ request });

    expect(action).toEqual({
      request,
      type: '[Organizational View] Load Org Unit Fluctuation Rate',
    });
  });

  test('loadOrgUnitFluctuationRateSuccess', () => {
    const rate: OrgUnitFluctuationRate = {
      value: '123',
      timeRange: '123|456',
      fluctuationRate: 0.1,
      unforcedFluctuationRate: 0.01,
    };

    const action = loadOrgUnitFluctuationRateSuccess({ rate });

    expect(action).toEqual({
      rate,
      type: '[Organizational View] Load Org Unit Fluctuation Rate Success',
    });
  });

  test('loadOrgUnitFluctuationRateFailure', () => {
    const action = loadOrgUnitFluctuationRateFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load Org Unit Fluctuation Rate Failure',
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
    const data: CountryData[] = [];

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
    } as OrgUnitFluctuationData;

    const action = loadParent({ data });

    expect(action).toEqual({
      data,
      type: '[Organizational View] Load Parent',
    });
  });

  test('loadParentSuccess', () => {
    const idValue = {
      id: '1515',
      value: 'Sh/ZHZ',
    } as IdValue;

    const action = loadParentSuccess({ idValue });

    expect(action).toEqual({
      idValue,
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

  test('loadAttritionOverTimeOrgChart', () => {
    const orgUnit = 'ACB';

    const action = loadAttritionOverTimeOrgChart({
      request: { value: orgUnit } as EmployeesRequest,
    });

    expect(action).toEqual({
      request: { value: orgUnit },
      type: '[Organizational View] Load AttritionOverTime for plus minus three months',
    });
  });

  test('loadAttritionOverTimeOrgChartSuccess', () => {
    const data = {} as unknown as AttritionOverTime;

    const action = loadAttritionOverTimeOrgChartSuccess({ data });

    expect(action).toEqual({
      data,
      type: '[Organizational View] Load AttritionOverTime for plus minus three months Success',
    });
  });

  test('loadAttritionOverTimeOrgChartFailure', () => {
    const action = loadAttritionOverTimeOrgChartFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Organizational View] Load AttritionOverTime for plus minus three months Failure',
    });
  });
});
