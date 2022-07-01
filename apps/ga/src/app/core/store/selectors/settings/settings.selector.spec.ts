import { BearingState } from '../../reducers/bearing/bearing.reducer';
import { ParameterState } from '../../reducers/parameter/parameter.reducer';
import {
  initialState,
  SettingsState,
} from '../../reducers/settings/settings.reducer';
import {
  getCurrentStep,
  getEnabledSteps,
  getStepperState,
} from './settings.selector';

describe('Settings Selector', () => {
  let mockState: {
    settings: SettingsState;
    bearing: BearingState;
    parameter: ParameterState;
  };

  beforeEach(() => {
    mockState = {
      settings: { ...initialState },
      bearing: {
        selectedBearing: 'testBearing',
        modelCreationSuccess: true,
      } as BearingState,
      parameter: { valid: true } as ParameterState,
    };
  });

  describe('getStepperState', () => {
    it('should return the whole stepper state', () => {
      expect(getStepperState(mockState)).toEqual(initialState.stepper);
    });
  });

  describe('getEnabledSteps', () => {
    it('should return step 1 disabled, others enabled', () => {
      Object.defineProperty(global, 'window', {
        value: {
          self: 'mockValue',
          top: 'otherMockValue',
        },
      });

      const expectedSteps = [
        {
          enabled: false,
          index: 0,
          link: 'bearing',
          name: 'bearingSelection',
        },
        {
          enabled: true,
          index: 1,
          link: 'parameters',
          name: 'parameters',
        },
        {
          enabled: true,
          index: 2,
          link: 'result',
          name: 'report',
        },
      ];

      expect(getEnabledSteps(mockState)).toEqual(expectedSteps);
    });
  });

  describe('getCurrentStep', () => {
    it('should return the index of the currentStep', () => {
      expect(getCurrentStep(mockState)).toEqual(0);
    });
  });
});
