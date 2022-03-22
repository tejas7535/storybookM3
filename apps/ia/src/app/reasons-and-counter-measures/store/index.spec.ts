import { Action } from '@ngrx/store';

import {
  EmployeesRequest,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../shared/models';
import { ReasonForLeavingStats } from '../models/reason-for-leaving-stats.model';
import { initialState, reasonsAndCounterMeasuresReducer, reducer } from '.';
import {
  comparedFilterSelected,
  comparedTimePeriodSelected,
  loadComparedOrgUnits,
  loadComparedOrgUnitsFailure,
  loadComparedOrgUnitsSuccess,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
  resetCompareMode,
} from './actions/reasons-and-counter-measures.actions';

describe('ReasonsAndCounterMeasures Reducer', () => {
  const errorMessage = 'Failure!';
  describe('Reducer function', () => {
    test('should return reasonsAndCounterMeasuresReducer', () => {
      // prepare any action
      const action: Action = { type: 'Test' };
      expect(reducer(initialState, action)).toEqual(
        reasonsAndCounterMeasuresReducer(initialState, action)
      );
    });
  });

  describe('loadReasonsWhyPeopleLeft', () => {
    test('should set loading', () => {
      const action = loadReasonsWhyPeopleLeft({
        request: {} as unknown as EmployeesRequest,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.reasons.loading).toBeTruthy();
    });
  });

  describe('loadReasonsWhyPeopleLeftSuccess', () => {
    test('should set data and unset loading', () => {
      const action = loadReasonsWhyPeopleLeftSuccess({
        data: [{} as ReasonForLeavingStats],
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.reasons.data).toBeDefined();
      expect(state.reasonsForLeaving.reasons.data).toHaveLength(1);
      expect(state.reasonsForLeaving.reasons.loading).toBeFalsy();
    });
  });

  describe('loadReasonsWhyPeopleLeftFailure', () => {
    test('should clear data and unset loading', () => {
      const action = loadReasonsWhyPeopleLeftFailure({
        errorMessage,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.reasons.data).toBeUndefined();
      expect(state.reasonsForLeaving.reasons.loading).toBeFalsy();
    });
  });

  describe('loadComparedReasonsWhyPeopleLeft', () => {
    test('should set loading', () => {
      const action = loadComparedReasonsWhyPeopleLeft({
        request: {} as unknown as EmployeesRequest,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.comparedReasons.loading).toBeTruthy();
    });
  });

  describe('loadComparedReasonsWhyPeopleLeftSuccess', () => {
    test('should set data and unset loading', () => {
      const action = loadComparedReasonsWhyPeopleLeftSuccess({
        data: [{} as ReasonForLeavingStats],
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.comparedReasons.data).toBeDefined();
      expect(state.reasonsForLeaving.comparedReasons.data).toHaveLength(1);
      expect(state.reasonsForLeaving.comparedReasons.loading).toBeFalsy();
    });
  });

  describe('loadComparedReasonsWhyPeopleLeftFailure', () => {
    test('should clear data and unset loading', () => {
      const action = loadComparedReasonsWhyPeopleLeftFailure({
        errorMessage,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.comparedReasons.data).toBeUndefined();
      expect(state.reasonsForLeaving.comparedReasons.loading).toBeFalsy();
    });
  });

  describe('comparedFilterSelected', () => {
    test('should set filter', () => {
      const filter = new SelectedFilter('test', {
        id: '1',
        value: '1',
      });
      const action = comparedFilterSelected({ filter });

      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(
        state.reasonsForLeaving.comparedSelectedFilters.entities.test
      ).toEqual(filter);
    });

    test('should update existing selection', () => {
      const filter = new SelectedFilter('test', {
        id: '1',
        value: '1',
      });

      const fakeState = {
        ...initialState,
        reasonsForLeaving: {
          ...initialState.reasonsForLeaving,
          comparedSelectedFilters: {
            ids: ['test'],
            entities: {
              test: filter,
            },
          },
        },
      };

      const update = new SelectedFilter('test', {
        id: '3',
        value: '3',
      });

      const action = comparedFilterSelected({ filter: update });

      const state = reasonsAndCounterMeasuresReducer(fakeState, action);

      expect(state.reasonsForLeaving.comparedSelectedFilters.entities).toEqual({
        test: update,
      });
    });
  });

  describe('comparedTimePeriodSelected', () => {
    test('should set time period', () => {
      const timePeriod = TimePeriod.LAST_12_MONTHS;
      const action = comparedTimePeriodSelected({
        timePeriod,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.comparedSelectedTimePeriod).toEqual(
        timePeriod
      );
    });
  });

  describe('loadComparedOrgUnits', () => {
    test('should set loading', () => {
      const searchFor = 'search';
      const action = loadComparedOrgUnits({ searchFor });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.comparedOrgUnits.loading).toBeTruthy();
    });
  });

  describe('loadComparedOrgUnitsSuccess', () => {
    test('should unset loading and set possible org units', () => {
      const items = [new IdValue('Department1', 'Department1')];

      const action = loadComparedOrgUnitsSuccess({ items });

      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.comparedOrgUnits.loading).toBeFalsy();
      expect(state.reasonsForLeaving.comparedOrgUnits.items).toEqual(items);
    });
  });

  describe('loadComparedOrgUnitsFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadComparedOrgUnitsFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        reasonsForLeaving: {
          ...initialState.reasonsForLeaving,
          comparedOrgUnits: {
            ...initialState.reasonsForLeaving.comparedOrgUnits,
            loading: true,
            errorMessage: '',
          },
        },
      };

      const state = reasonsAndCounterMeasuresReducer(fakeState, action);

      expect(state.reasonsForLeaving.comparedOrgUnits.loading).toBeFalsy();
      expect(state.reasonsForLeaving.comparedOrgUnits.errorMessage).toEqual(
        errorMessage
      );
    });
  });

  describe('resetCompareMode', () => {
    test('should set compare filter', () => {
      const fakeState = {
        ...initialState,
        reasonsForLeaving: {
          ...initialState.reasonsForLeaving,
          comparedSelectedOrgUnit: 'Schaeffler_123',
          comparedSelectedTimePeriod: TimePeriod.LAST_THREE_YEARS,
        },
      };
      const action = resetCompareMode();
      const state = reasonsAndCounterMeasuresReducer(fakeState, action);

      expect(
        state.reasonsForLeaving.comparedSelectedFilters.entities.orgUnit
      ).toBeUndefined();
      expect(state.reasonsForLeaving.comparedSelectedTimePeriod).toEqual(
        TimePeriod.LAST_12_MONTHS
      );
    });
  });
});
