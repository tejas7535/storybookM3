import { initialState } from '..';
import {
  EMPLOYEES_FOR_SELECTORS,
  EXPECTED_FILTERED_EMPLOYEES,
} from '../../../../mocks/overview-selector.mock';
import { ChartType } from '../../models/chart-type.enum';
import {
  getAttritionDataForOrgchart,
  getFilteredEmployeesForOrgChart,
  getOrgChartLoading,
  getSelectedChartType,
} from './overview.selector';

describe('Overview Selector', () => {
  const fakeState = {
    overview: {
      ...initialState,
      orgChart: EMPLOYEES_FOR_SELECTORS,
      loading: true,
    },
    filter: {
      selectedTimeRange: '1577863715000|1609399715000', // 01.01.2020 - 31.12.2020
    },
  };

  describe('getFilteredEmployeesForOrgChart', () => {
    test('should return filtered employees', () => {
      expect(getFilteredEmployeesForOrgChart(fakeState)).toEqual(
        EXPECTED_FILTERED_EMPLOYEES
      );
    });
  });

  describe('getOrgChartLoading', () => {
    test('should return org chart loading status', () => {
      expect(getOrgChartLoading(fakeState)).toBeTruthy();
    });
  });

  describe('getAttritionDataForOrgchart', () => {
    test('should return attrition meta data', () => {
      const expected = {
        attritionRate: 45.28,
        employeesAdded: 1,
        employeesLost: 2,
        forcedLeavers: 1,
        naturalTurnover: 0,
        openPositions: 0,
        terminationReceived: 0,
        title: 'Schaeffler_IT',
        unforcedLeavers: 1,
      };
      expect(
        getAttritionDataForOrgchart.projector(
          fakeState.overview,
          '1577863715000|1609399715000', // 01.01.2020 - 31.12.2020,
          { employeeId: '123' }
        )
      ).toEqual(expected);
    });
  });

  describe('getSelectedChartType', () => {
    test('should return currently selected chart type', () => {
      expect(getSelectedChartType(fakeState)).toEqual(ChartType.ORG_CHART);
    });
  });
});
