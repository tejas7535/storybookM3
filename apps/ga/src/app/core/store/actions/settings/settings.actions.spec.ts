import { setCurrentStep } from './settings.actions';

describe('Settings Actions', () => {
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
