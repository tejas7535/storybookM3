import { Action } from '@ngrx/store';
import moment from 'moment';

import { IdValue, SelectedFilter, TimePeriod } from '../../../../shared/models';
import {
  filterSelected,
  loadOrgUnits,
  loadOrgUnitsFailure,
  loadOrgUnitsSuccess,
  timePeriodSelected,
} from '../../actions/filter/filter.action';
import {
  filterReducer,
  getInitialSelectedTimeRange,
  initialState,
  reducer,
} from './filter.reducer';

describe('Filter Reducer', () => {
  const errorMessage = 'An error occured';

  describe('loadOrgUnits', () => {
    test('should set loading', () => {
      const searchFor = 'search';
      const action = loadOrgUnits({ searchFor });
      const state = filterReducer(initialState, action);

      expect(state.orgUnits.loading).toBeTruthy();
    });
  });

  describe('loadOrgUnitsSuccess', () => {
    test('should unset loading and set possible org units', () => {
      const items = [new IdValue('Department1', 'Department1')];

      const action = loadOrgUnitsSuccess({ items });

      const state = filterReducer(initialState, action);

      expect(state.orgUnits.loading).toBeFalsy();
      expect(state.orgUnits.items).toEqual(items);
    });
  });

  describe('loadOrgUnitsFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOrgUnitsFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        orgUnits: {
          ...initialState.orgUnits,
          loading: true,
          errorMessage: '',
        },
      };

      const state = filterReducer(fakeState, action);

      expect(state.orgUnits.loading).toBeFalsy();
      expect(state.orgUnits.errorMessage).toEqual(errorMessage);
    });
  });

  describe('filterSelected', () => {
    test('should add selection', () => {
      const filter = new SelectedFilter('test', {
        id: '1',
        value: '1',
      });
      const action = filterSelected({ filter });

      const state = filterReducer(initialState, action);

      expect(state.selectedFilters.entities.test).toEqual(filter);
    });

    test('should update existing selection', () => {
      const filter = new SelectedFilter('test', {
        id: '1',
        value: '1',
      });

      const fakeState = {
        ...initialState,
        selectedFilters: {
          ids: ['test'],
          entities: {
            test: filter,
          },
        },
      };

      const update = new SelectedFilter('test', {
        id: '3',
        value: '3',
      });

      const action = filterSelected({ filter: update });

      const state = filterReducer(fakeState, action);

      expect(state.selectedFilters.entities).toEqual({
        test: update,
      });
    });
  });

  describe('timePeriodSelected', () => {
    test('should set time period', () => {
      const timePeriod = TimePeriod.LAST_12_MONTHS;
      const action = timePeriodSelected({ timePeriod });

      const state = filterReducer(initialState, action);

      expect(state.selectedTimePeriod).toEqual(timePeriod);
    });
  });

  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = { type: 'Test' };
      expect(reducer(initialState, action)).toEqual(
        filterReducer(initialState, action)
      );
    });
  });

  describe('getInitialSelectedTimeRange', () => {
    test('should return one month earlier when 8th day of month', () => {
      const today = moment.utc({ year: 2022, month: 5, day: 8 });

      const result = getInitialSelectedTimeRange(today);

      expect(result).toBe('1619827200|1651363199'); // 01-05-2021|30-04-2022
    });

    test('should return one month later when 9th day of month', () => {
      const today = moment.utc({ year: 2022, month: 5, day: 9 });

      const result = getInitialSelectedTimeRange(today);

      expect(result).toBe('1622505600|1654041599'); // 01-06-2021|31-05-2022
    });
  });
});
