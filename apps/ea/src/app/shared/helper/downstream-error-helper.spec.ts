import {
  getDownstreamErrorTranslationKey,
  parseErrorObject,
} from './downstream-error-helper';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn(() => 'translated error'),
}));

describe('downstreamErrorHelper', () => {
  describe('parseErrorObject', () => {
    it('should return an array of errors', () => {
      const errors = {
        error1: 'TBD: error1',
      };

      const result = parseErrorObject(errors);

      expect(result).toEqual(['translated error']);
    });

    it('should return an array of errors with duplicates removed', () => {
      const errors = {
        error1: 'TBD: error1',
        error2: 'TBD: option2',
        error3: 'TBD: error1',
      };

      const result = parseErrorObject(errors);

      expect(result).toEqual(['translated error']);
    });
  });

  describe('getDownstreamErrorTranslationKey', () => {
    it('should return the translation key', () => {
      const result = getDownstreamErrorTranslationKey('MODEL_NOT_EXISTING');

      expect(result).toEqual(
        'calculationResult.downstreamErrors.modelNotExisting'
      );
    });

    it('should return the generic translation key', () => {
      const result = getDownstreamErrorTranslationKey('error2');

      expect(result).toEqual('calculationResult.downstreamErrors.genericError');
    });
  });
});
