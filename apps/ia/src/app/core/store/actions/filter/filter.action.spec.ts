import { IdValue, SelectedFilter, TimePeriod } from '../../../../shared/models';
import {
  filterSelected,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  timePeriodSelected,
  timeRangeSelected,
  triggerLoad,
} from '../';

describe('Filter Actions', () => {
  const errorMessage = 'An error occured';

  describe('Get initial filters actions', () => {
    test('loadInitialFilters', () => {
      const action = loadInitialFilters();

      expect(action).toEqual({
        type: '[Filter] Load Initial Filters',
      });
    });

    test('loadInitialFiltersSuccess', () => {
      const filters = {
        orgUnits: [new IdValue('Department1', 'Department1')],
      };
      const action = loadInitialFiltersSuccess({ filters });

      expect(action).toEqual({
        filters,
        type: '[Filter] Load Initial Filters Success',
      });
    });

    test('loadInitialFiltersFailure', () => {
      const action = loadInitialFiltersFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Filter] Load Initial Filters Failure',
      });
    });

    test('filterSelected', () => {
      const filter = new SelectedFilter('test', undefined);
      const action = filterSelected({ filter });

      expect(action).toEqual({
        filter,
        type: '[Filter] Filter selected',
      });
    });

    test('timePeriodSelected', () => {
      const timePeriod = TimePeriod.MONTH;
      const action = timePeriodSelected({ timePeriod });

      expect(action).toEqual({
        timePeriod,
        type: '[Filter] Time period selected',
      });
    });

    test('timeRangeSelected', () => {
      const timeRange = '123|456';
      const action = timeRangeSelected({ timeRange });

      expect(action).toEqual({
        timeRange,
        type: '[Filter] Time range selected',
      });
    });
  });

  test('triggerLoad', () => {
    const action = triggerLoad();

    expect(action).toEqual({
      type: '[Filter] Trigger Load',
    });
  });
});
