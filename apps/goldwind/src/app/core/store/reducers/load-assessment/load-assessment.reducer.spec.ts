import { Action } from '@ngrx/store';

import { DISPLAY } from '../../../../../testing/mocks';
import {
  setLoadAssessmentDisplay,
  setLoadAssessmentInterval,
} from '../../actions';
import {
  initialState,
  loadAssessmentReducer,
  reducer,
} from './load-assessment.reducer';

describe('Load Assessment Reducer', () => {
  describe('setGreaseDisplay', () => {
    it('should set grease display', () => {
      const action = setLoadAssessmentDisplay({
        loadAssessmentDisplay: DISPLAY,
      });
      const fakeState = {
        ...initialState,
      };

      const state = loadAssessmentReducer(fakeState, action);

      expect(state.display).toEqual(DISPLAY);
    });
  });

  describe('setEdmInterval', () => {
    it('should set interval', () => {
      const mockInterval = {
        startDate: 1_599_651_508,
        endDate: 1_599_651_509,
      };
      const action = setLoadAssessmentInterval({ interval: mockInterval });

      const fakeState = {
        ...initialState,
        interval: mockInterval,
      };

      const state = loadAssessmentReducer(fakeState, action);

      expect(state.interval).toBe(mockInterval);
    });
  });

  describe('Reducer function', () => {
    it('should return loadAssessmentReducer', () => {
      // prepare any action
      const action: Action = setLoadAssessmentDisplay({
        loadAssessmentDisplay: DISPLAY,
      });
      expect(reducer(initialState, action)).toEqual(
        loadAssessmentReducer(initialState, action)
      );
    });
  });
});
