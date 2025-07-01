import { Action } from '@ngrx/store';

import { ReasonForLeavingTab, TextAnalysisResponse } from '../models';
import { ReasonForLeavingStats } from '../models/reason-for-leaving-stats.model';
import {
  initialState,
  reasonsAndCounterMeasuresReducer,
  ReasonsAndCounterMeasuresState,
  reducer,
} from '.';
import {
  loadComparedLeaversByReason,
  loadComparedReasonAnalysis,
  loadComparedReasonAnalysisFailure,
  loadComparedReasonAnalysisSuccess,
  loadComparedReasonsWhyPeopleLeft,
  loadComparedReasonsWhyPeopleLeftFailure,
  loadComparedReasonsWhyPeopleLeftSuccess,
  loadLeaversByReason,
  loadLeaversByReasonSuccess,
  loadReasonAnalysis,
  loadReasonAnalysisFailure,
  loadReasonAnalysisSuccess,
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

      expect(state.reasonsForLeaving.reasons.reasonsData.loading).toBeTruthy();
    });
  });

  describe('loadReasonsWhyPeopleLeftSuccess', () => {
    test('should set data and unset loading', () => {
      const action = loadReasonsWhyPeopleLeftSuccess({
        data: {} as ReasonForLeavingStats,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.reasons.reasonsData.data).toBeDefined();
      expect(state.reasonsForLeaving.reasons.reasonsData.loading).toBeFalsy();
    });
  });

  describe('loadReasonsWhyPeopleLeftFailure', () => {
    test('should clear data and unset loading', () => {
      const action = loadReasonsWhyPeopleLeftFailure({
        errorMessage,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.reasons.reasonsData.data).toBeUndefined();
      expect(state.reasonsForLeaving.reasons.reasonsData.loading).toBeFalsy();
    });
  });

  describe('loadComparedReasonsWhyPeopleLeft', () => {
    test('should set loading', () => {
      const action = loadComparedReasonsWhyPeopleLeft();
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(
        state.reasonsForLeaving.comparedReasons.reasonsData.loading
      ).toBeTruthy();
    });
  });

  describe('loadComparedReasonsWhyPeopleLeftSuccess', () => {
    test('should set data and unset loading', () => {
      const action = loadComparedReasonsWhyPeopleLeftSuccess({
        data: {} as ReasonForLeavingStats,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(
        state.reasonsForLeaving.comparedReasons.reasonsData.data
      ).toBeDefined();
      expect(
        state.reasonsForLeaving.comparedReasons.reasonsData.loading
      ).toBeFalsy();
    });
  });

  describe('loadComparedReasonsWhyPeopleLeftFailure', () => {
    test('should clear data and unset loading', () => {
      const action = loadComparedReasonsWhyPeopleLeftFailure({
        errorMessage,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(
        state.reasonsForLeaving.comparedReasons.reasonsData.data
      ).toBeUndefined();
      expect(
        state.reasonsForLeaving.comparedReasons.reasonsData.loading
      ).toBeFalsy();
    });
  });

  describe('loadLeaversByReason', () => {
    test('should set loading and data as undefined', () => {
      const action = loadLeaversByReason({ reasonId: 12 });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.leavers.loading).toBeTruthy();
      expect(state.reasonsForLeaving.leavers.data).toBeUndefined();
    });
  });

  describe('loadComparedLeaversByReason', () => {
    test('should set loading and data as undefined', () => {
      const action = loadComparedLeaversByReason({ reasonId: 12 });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.leavers.loading).toBeTruthy();
      expect(state.reasonsForLeaving.leavers.data).toBeUndefined();
    });
  });

  describe('loadLeaversByReasonSuccess', () => {
    test('should set data and unset loading', () => {
      const action = loadLeaversByReasonSuccess({
        data: {} as any,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.leavers.data).toBeDefined();
      expect(state.reasonsForLeaving.leavers.errorMessage).toBeUndefined();
      expect(state.reasonsForLeaving.leavers.loading).toBeFalsy();
    });
  });

  describe('loadLeaversByReasonFailure', () => {
    test('should clear data and unset loading', () => {
      const action = loadReasonsWhyPeopleLeftFailure({
        errorMessage,
      });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(state.reasonsForLeaving.reasons.reasonsData.data).toBeUndefined();
      expect(state.reasonsForLeaving.reasons.reasonsData.loading).toBeFalsy();
    });
  });

  describe('loadReasonAnalysis', () => {
    test('should create new reason analysis', () => {
      const action = loadReasonAnalysis({ reasonIds: [99] });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(
        state.reasonsForLeaving.reasons.reasonAnalysis.data.answer.reasons
          .length
      ).toBe(1);
      expect(
        state.reasonsForLeaving.reasons.reasonAnalysis.data.answer.reasons[0]
          .reasonId
      ).toBe(99);
      expect(
        state.reasonsForLeaving.reasons.reasonAnalysis.data.answer.reasons[0]
          .show
      ).toBeTruthy();
    });
  });

  describe('loadReasonAnalysisSuccess', () => {
    test('should set data and unset loading', () => {
      const action = loadReasonAnalysisSuccess({
        data: {
          answer: {
            reasons: [
              { reasonId: 0, show: true, fullWidth: true, title: 'A' },
              { reasonId: 1, show: true, fullWidth: true, title: 'B' },
            ],
          },
        } as TextAnalysisResponse,
        selectedReasonIds: [0, 1],
      });
      const fakeState: ReasonsAndCounterMeasuresState = {
        ...initialState,
        reasonsForLeaving: {
          ...initialState.reasonsForLeaving,
          reasons: {
            ...initialState.reasonsForLeaving.reasons,
            reasonAnalysis: {
              data: {
                answer: {
                  reasons: [
                    { reasonId: 0, show: true, fullWidth: true },
                    { reasonId: 1, show: true, fullWidth: true },
                  ],
                },
              } as TextAnalysisResponse,
              loading: false,
            },
          },
        },
      };

      const state = reasonsAndCounterMeasuresReducer(fakeState, action);

      expect(
        state.reasonsForLeaving.reasons.reasonAnalysis.loading
      ).toBeFalsy();
      expect(
        state.reasonsForLeaving.reasons.reasonAnalysis.data.answer.reasons[0]
          .title
      ).toBe('A');
      expect(
        state.reasonsForLeaving.reasons.reasonAnalysis.data.answer.reasons[1]
          .title
      ).toBe('B');
    });
  });

  describe('loadReasonAnalysisFailure', () => {
    test('should unset loading and set error message', () => {
      const action = loadReasonAnalysisFailure({
        errorMessage,
      });
      const fakeState: ReasonsAndCounterMeasuresState = {
        ...initialState,
        reasonsForLeaving: {
          ...initialState.reasonsForLeaving,
          reasons: {
            ...initialState.reasonsForLeaving.reasons,
            reasonAnalysis: {
              data: {
                answer: {
                  reasons: [
                    { reasonId: 0, show: true, fullWidth: true },
                    { reasonId: 1, show: true, fullWidth: true },
                  ],
                },
              } as TextAnalysisResponse,
              loading: false,
            },
          },
        },
      };
      const state = reasonsAndCounterMeasuresReducer(fakeState, action);

      expect(
        state.reasonsForLeaving.reasons.reasonAnalysis.loading
      ).toBeFalsy();
      expect(state.reasonsForLeaving.reasons.reasonAnalysis.errorMessage).toBe(
        'Failure!'
      );
    });
  });

  describe('loadComparedReasonAnalysis', () => {
    test('should create new compared reason analysis', () => {
      const action = loadComparedReasonAnalysis({ reasonIds: [99] });
      const state = reasonsAndCounterMeasuresReducer(initialState, action);

      expect(
        state.reasonsForLeaving.comparedReasons.reasonAnalysis.data.answer
          .reasons.length
      ).toBe(1);
      expect(
        state.reasonsForLeaving.comparedReasons.reasonAnalysis.data.answer
          .reasons[0].reasonId
      ).toBe(99);
      expect(
        state.reasonsForLeaving.comparedReasons.reasonAnalysis.data.answer
          .reasons[0].show
      ).toBeTruthy();
      expect(
        state.reasonsForLeaving.comparedReasons.reasonAnalysis.data.answer
          .reasons[0].fullWidth
      ).toBeTruthy();
    });
  });

  describe('loadComparedReasonAnalysisSuccess', () => {
    test('should set data and unset loading', () => {
      const action = loadComparedReasonAnalysisSuccess({
        data: {
          answer: {
            reasons: [
              { reasonId: 0, show: true, fullWidth: true, title: 'A' },
              { reasonId: 1, show: true, fullWidth: true, title: 'B' },
            ],
          },
        } as TextAnalysisResponse,
        selectedReasonIds: [0, 1],
      });
      const fakeState: ReasonsAndCounterMeasuresState = {
        ...initialState,
        reasonsForLeaving: {
          ...initialState.reasonsForLeaving,
          comparedReasons: {
            ...initialState.reasonsForLeaving.comparedReasons,
            reasonAnalysis: {
              data: {
                answer: {
                  reasons: [
                    { reasonId: 0, show: true, fullWidth: true },
                    { reasonId: 1, show: true, fullWidth: true },
                  ],
                },
              } as TextAnalysisResponse,
              loading: false,
            },
          },
        },
      };

      const state = reasonsAndCounterMeasuresReducer(fakeState, action);

      expect(
        state.reasonsForLeaving.comparedReasons.reasonAnalysis.loading
      ).toBeFalsy();
      expect(
        state.reasonsForLeaving.comparedReasons.reasonAnalysis.data.answer
          .reasons[0].title
      ).toBe('A');
      expect(
        state.reasonsForLeaving.comparedReasons.reasonAnalysis.data.answer
          .reasons[1].title
      ).toBe('B');
    });
  });

  describe('loadComparedReasonAnalysisFailure', () => {
    test('should unset loading and set error message', () => {
      const action = loadComparedReasonAnalysisFailure({
        errorMessage,
      });
      const fakeState: ReasonsAndCounterMeasuresState = {
        ...initialState,
        reasonsForLeaving: {
          ...initialState.reasonsForLeaving,
          comparedReasons: {
            ...initialState.reasonsForLeaving.comparedReasons,
            reasonAnalysis: {
              data: {
                answer: {
                  reasons: [
                    { reasonId: 0, show: true, fullWidth: true },
                    { reasonId: 1, show: true, fullWidth: true },
                  ],
                },
              } as TextAnalysisResponse,
              loading: false,
            },
          },
        },
      };

      const state = reasonsAndCounterMeasuresReducer(fakeState, action);

      expect(
        state.reasonsForLeaving.comparedReasons.reasonAnalysis.loading
      ).toBeFalsy();
      expect(
        state.reasonsForLeaving.comparedReasons.reasonAnalysis.errorMessage
      ).toBe(errorMessage);
    });
  });
});
