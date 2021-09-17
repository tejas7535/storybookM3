import { Step } from '../../../../shared/models';
import {
  completeStep,
  previousStep,
  setCurrentStep,
  setStepper,
  updateStep,
} from './settings.actions';

describe('Settings Actions', () => {
  describe('Update Steps', () => {
    it('updateStep', () => {
      const step = {} as Step;
      const action = updateStep({ step });

      expect(action).toEqual({
        step,
        type: '[Settings] Update Steps',
      });
    });
  });

  describe('Set Stepper', () => {
    it('setStepper', () => {
      const newStepperState = {
        steps: [] as Step[],
        currentStep: 2,
        previousStep: 1,
        nextStep: 3,
      };
      const action = setStepper({ stepper: { ...newStepperState } });

      expect(action).toEqual({
        stepper: newStepperState,
        type: '[Settings] Set Steps',
      });
    });
  });

  describe('Complete Step', () => {
    it('completeStep', () => {
      const action = completeStep();

      expect(action).toEqual({
        type: '[Settings] Complete Step',
      });
    });
  });

  describe('Previous Step', () => {
    it('previousStep', () => {
      const action = previousStep();

      expect(action).toEqual({
        type: '[Settings] Previous Step',
      });
    });
  });

  describe('Set Current Step', () => {
    it('setCurrentStep', () => {
      const step = 3;
      const action = setCurrentStep({ step });

      expect(action).toEqual({
        step,
        type: '[Settings] Set Current Step',
      });
    });
  });
});
