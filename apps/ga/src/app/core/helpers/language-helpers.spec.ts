import { isLanguageAvailable } from './language-helpers';

describe('Language helpers', () => {
  describe('isLanguageAvailable', () => {
    it('should return true', () => {
      expect(isLanguageAvailable('de')).toBe(true);
    });

    it('should return false', () => {
      expect(isLanguageAvailable('unknown language')).toBe(false);
    });
  });
});
