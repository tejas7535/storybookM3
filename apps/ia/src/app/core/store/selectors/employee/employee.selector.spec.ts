import {
  EMPLOYEES_FOR_SELECTORS,
  EXPECTED_FILTERED_EMPLOYEES,
} from '../../../../../mocks/employees-selector.mock';
import { ChartType } from '../../../../overview/models/chart-type.enum';
import { IdValue, TimePeriod } from '../../../../shared/models';
import { initialState } from '../../reducers/employee/employee.reducer';
import {
  getAllSelectedFilters,
  getAttritionDataForEmployee,
  getCountries,
  getCurrentFiltersAndTime,
  getCurrentRoute,
  getEmployeesLoading,
  getFilteredEmployees,
  getHrLocations,
  getInitialFiltersLoading,
  getOrgUnits,
  getRegionsAndSubRegions,
  getSelectedFilters,
  getSelectedOverviewChartType,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from './employee.selector';

describe('Employee Selector', () => {
  const fakeState = {
    employee: {
      ...initialState,
      filters: {
        ...initialState.filters,
        orgUnits: [new IdValue('dep1', 'Department 1')],
        regionsAndSubRegions: [
          new IdValue('ger', 'Germany'),
          new IdValue('eu', 'Europe'),
        ],
        countries: [new IdValue('ger', 'Germany')],
        hrLocations: [new IdValue('hero', 'Herzogenaurach')],
        selectedTimeRange: '1577863715000|1609399715000', // 01.01.2020 - 31.12.2020
        selectedFilters: {
          ids: ['test'],
          entities: {
            test: {
              name: 'test',
              value: 1234,
            },
          },
        },
      },
      employees: {
        ...initialState.employees,
        result: EMPLOYEES_FOR_SELECTORS,
        loading: true,
      },
    },
    router: {
      state: {
        url: '/overview',
      },
    },
  };

  describe('getInitialFiltersLoading', () => {
    test('should return loading status', () => {
      expect(getInitialFiltersLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getOrgUnits', () => {
    test('should return organizations', () => {
      expect(getOrgUnits(fakeState).options.length).toEqual(1);
    });
  });

  describe('getRegionsAndSubRegions', () => {
    test('should return regions and sub regions', () => {
      expect(getRegionsAndSubRegions(fakeState).options.length).toEqual(2);
    });
  });

  describe('getCountries', () => {
    test('should return countries', () => {
      expect(getCountries(fakeState).options.length).toEqual(1);
      expect(getCountries(fakeState).options[0].value).toEqual('Germany');
    });
  });

  describe('getHrLocations', () => {
    test('should return hrLocations', () => {
      expect(getHrLocations(fakeState).options.length).toEqual(1);
      expect(getHrLocations(fakeState).options[0].value).toEqual(
        'Herzogenaurach'
      );
    });
  });

  describe('getCurrentRoute', () => {
    test('should return current route', () => {
      expect(getCurrentRoute(fakeState)).toEqual('/overview');
    });
  });

  describe('getTimePeriods', () => {
    test('should return time periods', () => {
      expect(getTimePeriods(fakeState).length).toEqual(4);
    });
  });

  describe('getSelectedTimePeriod', () => {
    test('should return selected time period', () => {
      expect(getSelectedTimePeriod(fakeState)).toEqual(TimePeriod.YEAR);
    });
  });

  describe('getSelectedTimeRange', () => {
    test('should return selected time range', () => {
      expect(getSelectedTimeRange(fakeState)).toEqual(
        '1577863715000|1609399715000'
      );
    });
  });

  describe('getSelectedFilters', () => {
    test('should return selected Filters', () => {
      expect(getSelectedFilters(fakeState)).toEqual(
        fakeState.employee.filters.selectedFilters
      );
    });
  });

  describe('getAllSelectedFilters', () => {
    test('should return all selected filters', () => {
      expect(getAllSelectedFilters(fakeState)).toEqual([
        {
          name: 'test',
          value: 1234,
        },
      ]);
    });
  });

  describe('getCurrentFiltersAndTime', () => {
    test('should return currently selected filters and time range', () => {
      expect(getCurrentFiltersAndTime(fakeState)).toEqual({
        test: 1234,
        timeRange: '1577863715000|1609399715000',
      });
    });
  });

  describe('getFilteredEmployees', () => {
    test('should return filtered employees', () => {
      expect(getFilteredEmployees(fakeState)).toEqual(
        EXPECTED_FILTERED_EMPLOYEES
      );
    });
  });

  describe('getEmployeesLoading', () => {
    test('should return employees loading status', () => {
      expect(getEmployeesLoading(fakeState)).toBeTruthy();
    });
  });

  describe('getSelectedOverviewChartType', () => {
    test('should return currently selected chart type', () => {
      expect(getSelectedOverviewChartType(fakeState)).toEqual(
        ChartType.ORG_CHART
      );
    });
  });

  describe('showRegionsAndLocationsFilters', () => {
    test('should return true', () => {
      expect(getSelectedOverviewChartType(fakeState)).toBeTruthy();
    });
  });

  describe('getAttritionDataForEmployee', () => {
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
        getAttritionDataForEmployee.projector(
          fakeState.employee,
          fakeState.employee.filters.selectedTimeRange,
          { employeeId: '123' }
        )
      ).toEqual(expected);
    });
  });
});
