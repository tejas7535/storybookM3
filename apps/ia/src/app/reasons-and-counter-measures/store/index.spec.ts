import { Action } from '@ngrx/store';

import { ReasonForLeavingTab } from '../models';
import { ReasonForLeavingStats } from '../models/reason-for-leaving-stats.model';
import { initialState, reasonsAndCounterMeasuresReducer, reducer } from '.';
import {
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadReasonsWhyPeopleLeft,
  loadReasonsWhyPeopleLeftFailure,
  loadReasonsWhyPeopleLeftSuccess,
  selectReasonsForLeavingTab,
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

  describe('selectReasonsForLeavingTab', () => {
    test('should set selected tab', () => {
      const action = selectReasonsForLeavingTab({
        selectedTab: ReasonForLeavingTab.TOP_REASONS,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.selectedTab).toBe(
        ReasonForLeavingTab.TOP_REASONS
      );
    });
  });

  describe('loadReasonsWhyPeopleLeft', () => {
    test('should set loading', () => {
      const action = loadReasonsWhyPeopleLeft();
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.reasons.loading).toBeTruthy();
    });
  });

  describe('loadReasonsWhyPeopleLeftSuccess', () => {
    test('should set data and unset loading', () => {
      const action = loadReasonsWhyPeopleLeftSuccess({
        data: {} as ReasonForLeavingStats,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.reasons.data).toBeDefined();
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
      const action = loadComparedReasonsWhyPeopleLeft();
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.comparedReasons.loading).toBeTruthy();
    });
  });

  describe('loadComparedReasonsWhyPeopleLeftSuccess', () => {
    test('should set data and unset loading', () => {
      const action = loadComparedReasonsWhyPeopleLeftSuccess({
        data: {} as ReasonForLeavingStats,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.comparedReasons.data).toBeDefined();
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
});
