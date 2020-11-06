import { IdValue, TimePeriod } from '../../../../shared/models';
import { initialState } from '../../reducers/employee/employee.reducer';
import {
  getCountries,
  getInitialFiltersLoading,
  getLocations,
  getOrganizations,
  getRegionsAndSubRegions,
  getSelectedTimePeriod,
  getTimePeriods,
} from './employee.selector';

describe('Employee Selector', () => {
  const fakeState = {
    employee: {
      ...initialState,
      filters: {
        ...initialState.filters,
        organizations: [new IdValue('dep1', 'Department 1')],
        regionsAndSubRegions: [
          new IdValue('ger', 'Germany'),
          new IdValue('eu', 'Europe'),
        ],
        countries: [new IdValue('ger', 'Germany')],
        locations: [new IdValue('hero', 'Herzogenaurach')],
      },
    },
  };

  describe('getInitialFiltersLoading', () => {
    test('should return loading status', () => {
      expect(getInitialFiltersLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getOrganizations', () => {
    test('should return organizations', () => {
      expect(getOrganizations(fakeState).options.length).toEqual(1);
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

  describe('getLocations', () => {
    test('should return locations', () => {
      expect(getLocations(fakeState).options.length).toEqual(1);
      expect(getLocations(fakeState).options[0].value).toEqual(
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
});
