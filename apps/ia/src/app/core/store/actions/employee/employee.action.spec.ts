import {
  filterSelected,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
} from '../';
import { Filter, IdValue } from '../../../../shared/models';

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
        regionAndSubRegions: [
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
  });
});
