import { setCurrentStep, setLanguage } from './settings.actions';

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

  describe('Set language', () => {
    it('setLanguage', () => {
      const language = 'language';
      const action = setLanguage({ language });

      expect(action).toEqual({
        language,
        type: '[Settings] Set Language',
      });
    });
  });
});
