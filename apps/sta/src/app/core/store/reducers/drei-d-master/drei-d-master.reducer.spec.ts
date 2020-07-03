import { DREI_D_MASTER_STATE_MOCK } from '../../../../../testing/mocks/drei-d-master/drei-d-master-values.mock';
import {
  loadClassificationForText,
  loadClassificationForTextFailure,
  loadClassificationForTextSuccess,
  resetClassifications,
} from '../../actions/drei-d-master/dreid-d-master.actions';
import {
  dreiDMasterReducer,
  initialState,
  reducer,
} from './drei-d-master.reducer';

describe('DreiDMaster Reducer', () => {
  describe('LoadClassificationForText', () => {
    test('should set the textInput and loading', () => {
      const action = loadClassificationForText({
        textInput: DREI_D_MASTER_STATE_MOCK.classificationTextInput,
      });
      const state = dreiDMasterReducer(initialState, action);

      expect(state.classificationTextInput).toEqual(
        DREI_D_MASTER_STATE_MOCK.classificationTextInput
      );
      expect(state.classificationForText.loading).toBeTruthy();
    });
  });

  describe('LoadClassificationForTextSuccess', () => {
    test('should set the classificationForText', () => {
      const action = loadClassificationForTextSuccess({
        classification: DREI_D_MASTER_STATE_MOCK.classificationForText,
      });
      const state = dreiDMasterReducer(initialState, action);

      expect(state.classificationForText).toEqual(
        DREI_D_MASTER_STATE_MOCK.classificationForText
      );
    });
  });

  describe('LoadClassificationForTextFailure', () => {
    test('should set loading', () => {
      const action = loadClassificationForTextFailure();
      const state = dreiDMasterReducer(initialState, action);

      expect(state.classificationForText.loading).toBeFalsy();
    });
  });

  describe('ResetClassifications', () => {
    test('should set to initialState', () => {
      const action = loadClassificationForText({
        textInput: DREI_D_MASTER_STATE_MOCK.classificationTextInput,
      });
      const state = dreiDMasterReducer(initialState, action);

      const action2 = resetClassifications();
      const state2 = dreiDMasterReducer(state, action2);

      expect(state2).toEqual(initialState);
    });
  });

  describe('Reducer function', () => {
    test('should return dreiDMasterReducer', () => {
      const action = loadClassificationForText({
        textInput: DREI_D_MASTER_STATE_MOCK.classificationTextInput,
      });
      expect(reducer(initialState, action)).toEqual(
        dreiDMasterReducer(initialState, action)
      );
    });
  });
});
