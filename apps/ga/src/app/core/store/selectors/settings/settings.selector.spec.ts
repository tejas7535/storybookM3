import {
  initialState,
  SettingsState,
} from '../../reducers/settings/settings.reducer';
import {
  getCurrentStep,
  getStepperState,
  getSteps,
  hasNext,
} from './settings.selector';

describe('Settings Selector', () => {
  let mockState: { settings: SettingsState };

  beforeEach(() => {
    mockState = { settings: { ...initialState } };
  });

  describe('getStepperState', () => {
    it('should return the whole stepper state', () => {
      expect(getStepperState(mockState)).toEqual(initialState.stepper);
    });
  });

  describe('getSteps', () => {
    it('should return steps', () => {
      expect(getSteps(mockState)).toEqual(initialState.stepper.steps);
    });
  });

  describe('hasNext', () => {
    it('shoudl return true if there is a next step', () => {
      expect(hasNext(mockState)).toEqual(true);
    });
    it('shoudl return false if there is no next step', () => {
      expect(
        hasNext({
          ...mockState,
          settings: {
            ...mockState.settings,
            stepper: {
              ...mockState.settings.stepper,
              nextStep: undefined,
            },
          },
        })
      ).toEqual(false);
    });
  });

  describe('getCurrentStep', () => {
    it('should return the index of the currentStep', () => {
      expect(getCurrentStep(mockState)).toEqual(0);
    });
  });
});
