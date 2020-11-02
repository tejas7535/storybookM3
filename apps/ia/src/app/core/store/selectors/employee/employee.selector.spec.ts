import { IdValue } from '../../../../shared/models';
import { initialState } from '../../reducers/employee/employee.reducer';
import {
  getInitialFiltersLoading,
  getOrganizations,
} from './employee.selector';

describe('Employee Selector', () => {
  const fakeState = {
    employee: {
      ...initialState,
      filters: {
        ...initialState.filters,
        organizations: [new IdValue('dep1', 'Department 1')],
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
});
