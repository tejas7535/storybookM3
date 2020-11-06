import {
  filterSelected,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  timePeriodSelected,
  timeRangeSelected,
} from '../';
import { Filter, IdValue, TimePeriod } from '../../../../shared/models';

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
        organizations: [new IdValue('Department1', 'Department1')],
        regionsAndSubRegions: [
          new IdValue('Europe', 'Europe'),
          new IdValue('Americas', 'Americas'),
        ],
        countries: [
          new IdValue('germany', 'Germany'),
          new IdValue('usa', 'USA'),
        ],
        locations: [new IdValue('herzogenaurach', 'Herzogenaurach')],
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
      const filter = new Filter('test', []);
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
});
