import { IdValue, SelectedFilter, TimePeriod } from '../../../../shared/models';
import {
  filterSelected,
  loadOrgUnits,
  loadOrgUnitsFailure,
  loadOrgUnitsSuccess,
  timePeriodSelected,
  triggerLoad,
} from '../';

describe('Filter Actions', () => {
  const errorMessage = 'An error occured';

  describe('Get initial filters actions', () => {
    test('loadOrgUnits', () => {
      const searchFor = 'search';
      const action = loadOrgUnits({ searchFor });

      expect(action).toEqual({
        searchFor,
        type: '[Filter] Load Org Units',
      });
    });

    test('loadOrgUnitsSuccess', () => {
      const items = [new IdValue('Department1', 'Department1')];
      const action = loadOrgUnitsSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Filter] Load Org Units Success',
      });
    });

    test('loadOrgUnitsFailure', () => {
      const action = loadOrgUnitsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Filter] Load Org Units Failure',
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
  });

  test('triggerLoad', () => {
    const action = triggerLoad();

    expect(action).toEqual({
      type: '[Filter] Trigger Load',
    });
  });
});
