import {
  APP_DELIVERY_MOCK,
  APP_STATE_MOCK,
  BEARING_SELECTION_STATE_MOCK,
  CALCULATION_PARAMETERS_STATE_MOCK,
  EMBEDDED_FINISHED,
  INTERNAL_USER_MOCK,
  INVALID_STEP_MOCK,
  PARTNER_VERSION_MOCK,
  SETTINGS_STATE_MOCK,
  STEPS_MOCK,
} from '@ga/testing/mocks';

import {
  getAppDelivery,
  getCurrentStep,
  getEnvironment,
  getInternalUser,
  getPartnerVersion,
  getStepperState,
  getSteps,
} from './settings.selector';

jest.mock('@ga/shared/constants', () => ({
  steps: [...STEPS_MOCK, INVALID_STEP_MOCK],
}));

describe('Settings Selector', () => {
  const mockState = {
    ...APP_STATE_MOCK,
    bearingSelection: {
      ...BEARING_SELECTION_STATE_MOCK,
      selectedBearing: 'testBearing',
      modelCreationSuccess: true,
    },
    calculationParameters: {
      ...CALCULATION_PARAMETERS_STATE_MOCK,
      valid: true,
    },
  };

  describe('getEnvironment', () => {
    it('should return the environment state', () => {
      expect(getEnvironment(mockState)).toEqual(
        SETTINGS_STATE_MOCK.environment
      );
    });
  });

  describe('getAppDelivery', () => {
    it('should return the app delivery state', () => {
      expect(getAppDelivery(mockState)).toEqual(APP_DELIVERY_MOCK);
    });
  });

  describe('getStepperState', () => {
    it('should return the whole stepper state', () => {
      expect(getStepperState(mockState)).toEqual(SETTINGS_STATE_MOCK.stepper);
    });
  });

  describe('getSteps', () => {
    it('should return step 1 comppleted', () => {
      mockState.settings.environment.appDelivery = 'embedded';
      const getStepsReturnValue = getSteps(mockState);
      expect([getStepsReturnValue[0]]).toEqual(EMBEDDED_FINISHED);
    });
  });

  describe('getCurrentStep', () => {
    it('should return the index of the currentStep', () => {
      expect(getCurrentStep(mockState)).toEqual(0);
    });
  });

  describe('getPartnerVersion', () => {
    it('should return the partner version', () => {
      expect(getPartnerVersion(mockState)).toEqual(PARTNER_VERSION_MOCK);
    });
  });

  describe('getInternalUser', () => {
    it('should return the internal user value', () => {
      expect(getInternalUser(mockState)).toBe(INTERNAL_USER_MOCK);
    });
  });
});
