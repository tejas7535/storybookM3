import {
  APP_STATE_MOCK,
  BEARING_STATE_MOCK,
  INVALID_STEP_MOCK,
  PARAMETERS_STATE_MOCK,
  SETTINGS_STATE_MOCK,
  STEPS_MOCK,
} from '@ga/testing/mocks';

import { getCurrentStep, getStepperState, getSteps } from './settings.selector';

jest.mock('@ga/shared/constants', () => ({
  steps: [...STEPS_MOCK, INVALID_STEP_MOCK],
}));

describe('Settings Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
    bearing: {
      ...BEARING_STATE_MOCK,
      selectedBearing: 'testBearing',
      modelCreationSuccess: true,
    },
    parameter: { ...PARAMETERS_STATE_MOCK, valid: true },
  };

  describe('getStepperState', () => {
    it('should return the whole stepper state', () => {
      expect(getStepperState(mockState)).toEqual(SETTINGS_STATE_MOCK.stepper);
    });
  });

  describe('getSteps', () => {
    it('should return step 1 disabled, others enabled', () => {
      Object.defineProperty(global, 'window', {
        value: {
          self: 'mockValue',
          top: 'otherMockValue',
        },
      });

      expect(getSteps(mockState)).toEqual([...STEPS_MOCK, INVALID_STEP_MOCK]);
    });
  });

  describe('getCurrentStep', () => {
    it('should return the index of the currentStep', () => {
      expect(getCurrentStep(mockState)).toEqual(0);
    });
  });
});
