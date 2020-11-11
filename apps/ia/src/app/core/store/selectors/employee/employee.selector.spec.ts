import { Employee, IdValue, TimePeriod } from '../../../../shared/models';
import { initialState } from '../../reducers/employee/employee.reducer';
import {
  getAllSelectedFilters,
  getCountries,
  getCurrentFiltersAndTime,
  getEmployees,
  getEmployeesLoading,
  getHrLocations,
  getInitialFiltersLoading,
  getOrgUnits,
  getRegionsAndSubRegions,
  getSelectedFilters,
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
        selectedTimeRange: '123|456',
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
        result: [({ employeeId: '123' } as unknown) as Employee],
        loading: true,
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
      expect(getSelectedTimeRange(fakeState)).toEqual('123|456');
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
        timeRange: '123|456',
      });
    });
  });

  describe('getEmployees', () => {
    test('should return employees', () => {
      expect(getEmployees(fakeState)).toEqual([
        ({ employeeId: '123' } as unknown) as Employee,
      ]);
    });
  });

  describe('getEmployeesLoading', () => {
    test('should return employees loading status', () => {
      expect(getEmployeesLoading(fakeState)).toBeTruthy();
    });
  });
});
