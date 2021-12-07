import { Action } from '@ngrx/store';

import { EmployeesRequest, TimePeriod } from '../../shared/models';
import { ReasonForLeavingStats } from '../models/reason-for-leaving-stats.model';
import { initialState, reasonsAndCounterMeasuresReducer, reducer } from '.';
import {
  changeComparedFilter,
  changeComparedTimePeriod,
  changeComparedTimeRange,
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

    describe('changeComparedFilter', () => {
      test('should set filter', () => {
        const comparedSelectedOrgUnit = 'Schaeffler_BU';
        const action = changeComparedFilter({
          comparedSelectedOrgUnit,
        });
        const state = reasonsAndCounterMeasuresReducer(initialState, action);

        expect(state.reasonsForLeaving.comparedSelectedOrgUnit).toEqual(
          comparedSelectedOrgUnit
        );
      });
    });

    describe('changeComparedTimePeriod', () => {
      test('should set time period', () => {
        const comparedSelectedTimePeriod = TimePeriod.LAST_12_MONTHS;
        const action = changeComparedTimePeriod({
          comparedSelectedTimePeriod,
        });
        const state = reasonsAndCounterMeasuresReducer(initialState, action);

        expect(state.reasonsForLeaving.comparedSelectedTimePeriod).toEqual(
          comparedSelectedTimePeriod
        );
      });
    });

    describe('changeComparedTimeRange', () => {
      test('should set time range', () => {
        const comparedSelectedTimeRange = '123-321';
        const action = changeComparedTimeRange({
          comparedSelectedTimeRange,
        });
        const state = reasonsAndCounterMeasuresReducer(initialState, action);

        expect(state.reasonsForLeaving.comparedSelectedTimeRange).toEqual(
          comparedSelectedTimeRange
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

        expect(state.reasonsForLeaving.comparedSelectedOrgUnit).toBeUndefined();
        expect(state.reasonsForLeaving.comparedSelectedTimePeriod).toEqual(
          TimePeriod.LAST_12_MONTHS
        );
      });
    });
  });
});
