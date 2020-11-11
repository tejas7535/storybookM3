import {
  filterSelected,
  loadEmployees,
  loadEmployeesFailure,
  loadEmployeesSuccess,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  timePeriodSelected,
  timeRangeSelected,
} from '../';
import {
  Employee,
  EmployeesRequest,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';

describe('Search Actions', () => {
  const errorMessage = 'An error occured';

  describe('Get initial filters actions', () => {
    test('loadInitialFilters', () => {
      const action = loadInitialFilters();

      expect(action).toEqual({
        type: '[Employee] Load Initial Filters',
      });
    });

    test('loadInitialFiltersSuccess', () => {
      const filters = {
        orgUnits: [new IdValue('Department1', 'Department1')],
        regionsAndSubRegions: [
          new IdValue('Europe', 'Europe'),
          new IdValue('Americas', 'Americas'),
        ],
        countries: [
          new IdValue('germany', 'Germany'),
          new IdValue('usa', 'USA'),
        ],
        hrLocations: [new IdValue('herzogenaurach', 'Herzogenaurach')],
      };
      const action = loadInitialFiltersSuccess({ filters });

      expect(action).toEqual({
        filters,
        type: '[Employee] Load Initial Filters Success',
      });
    });

    test('loadInitialFiltersFailure', () => {
      const action = loadInitialFiltersFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Employee] Load Initial Filters Failure',
      });
    });

    test('filterSelected', () => {
      const filter = new SelectedFilter('test', undefined);
      const action = filterSelected({ filter });

      expect(action).toEqual({
        filter,
        type: '[Employee] Filter selected',
      });
    });

    test('timePeriodSelected', () => {
      const timePeriod = TimePeriod.MONTH;
      const action = timePeriodSelected({ timePeriod });

      expect(action).toEqual({
        timePeriod,
        type: '[Employee] Time period selected',
      });
    });

    test('timeRangeSelected', () => {
      const timeRange = '123|456';
      const action = timeRangeSelected({ timeRange });

      expect(action).toEqual({
        timeRange,
        type: '[Employee] Time range selected',
      });
    });
  });

  test('loadEmployees', () => {
    const request = ({} as unknown) as EmployeesRequest;
    const action = loadEmployees({ request });

    expect(action).toEqual({
      request,
      type: '[Employee] Load Employees',
    });
  });

  test('loadEmployeesSuccess', () => {
    const employees: Employee[] = [];

    const action = loadEmployeesSuccess({ employees });

    expect(action).toEqual({
      employees,
      type: '[Employee] Load Employees Success',
    });
  });

  test('loadEmployeesFailure', () => {
    const action = loadEmployeesFailure({ errorMessage });

    expect(action).toEqual({
      errorMessage,
      type: '[Employee] Load Employees Failure',
    });
  });
});
