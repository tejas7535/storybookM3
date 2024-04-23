import { TranslocoModule } from '@jsverse/transloco';

import { getErrorMessage } from './error-helpers';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

describe('ErrorHelpers', () => {
  describe('getErrorMessage', () => {
    it('should return undefined without errors', () => {
      let x; // x is undefined
      expect(getErrorMessage(x)).toBeFalsy();
    });
    it('should return required on requrie errors', () => {
      const errors = { required: true };
      const expected = 'required';

      expect(getErrorMessage(errors)).toBe(expected);
    });
    it('should return min on min errors', () => {
      const errors = { min: { min: 8 } };
      const expected = 'min';

      expect(getErrorMessage(errors)).toBe(expected);
    });
    it('should return max on max errors', () => {
      const errors = { max: { max: 8 } };
      const expected = 'max';

      expect(getErrorMessage(errors)).toBe(expected);
    });
    it('should return generic on generic errors', () => {
      const errors = {};
      const expected = 'generic';

      expect(getErrorMessage(errors)).toBe(expected);
    });
  });
});
