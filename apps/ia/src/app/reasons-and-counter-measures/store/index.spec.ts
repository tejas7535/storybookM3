import { Action } from '@ngrx/store';

import { initialState, reasonsAndCounterMeasuresReducer, reducer } from '.';
import { EmployeesRequest } from '../../shared/models';
import { ReasonForLeavingStats } from '../models/reason-for-leaving-stats.model';
import {
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
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
  });
});
