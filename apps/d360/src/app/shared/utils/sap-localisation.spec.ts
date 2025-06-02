import { Stub } from '../test/stub.class';
import { checkForDateAndLocalize, messageFromSAP } from './sap-localisation';
import { ValidationHelper } from './validation/validation-helper';

describe('SAPLocalization', () => {
  beforeEach(() => Stub.initValidationHelper());

  describe('messageFromSAP', () => {
    it('should return the default error message if fallbackMessage is null and no valid translation exists', () => {
      const fallbackMessage: any = null;
      const messageNumber = 0;
      const messageId = '/SGD/SCM_SOP_SALES';
      const messageV1: any = null;
      const messageV2: any = null;
      const messageV3: any = null;
      const messageV4: any = null;

      const result = messageFromSAP(
        fallbackMessage,
        messageNumber,
        messageId,
        messageV1,
        messageV2,
        messageV3,
        messageV4
      );

      expect(result).toBe(`sap_message.error`);
    });
  });

  describe('checkForDateAndLocalize', () => {
    it('should return a localized date string for a valid YYYYMMDD date', () => {
      const mockDate = '20230101';
      const localizedDate = '01/01/2023'; // Example localized date
      jest
        .spyOn(ValidationHelper.localeService, 'localizeDate')
        .mockReturnValue(localizedDate);

      const result = checkForDateAndLocalize(mockDate);

      expect(result).toBe(localizedDate);
      expect(ValidationHelper.localeService.localizeDate).toHaveBeenCalledWith(
        new Date(2023, 0, 1)
      );
    });

    it('should return the original value if the input is not a valid YYYYMMDD date', () => {
      const invalidDate = 'invalid-date';

      const result = checkForDateAndLocalize(invalidDate);

      expect(result).toBe(invalidDate);
    });

    it('should return null if the input is null', () => {
      const result = checkForDateAndLocalize(null);

      expect(result).toBeNull();
    });

    it('should handle boundary dates correctly', () => {
      const minDate = '19000101'; // January 1, 1900
      const maxDate = '20991231'; // December 31, 2099

      const localizedMinDate = '01/01/1900';
      const localizedMaxDate = '12/31/2099';

      const localizeSpy = jest.spyOn(
        ValidationHelper.localeService,
        'localizeDate'
      );
      localizeSpy
        .mockReturnValueOnce(localizedMinDate)
        .mockReturnValueOnce(localizedMaxDate);

      expect(checkForDateAndLocalize(minDate)).toBe(localizedMinDate);
      expect(checkForDateAndLocalize(maxDate)).toBe(localizedMaxDate);
    });

    it('should not attempt to localize dates with invalid format', () => {
      const localizeSpy = jest.spyOn(
        ValidationHelper.localeService,
        'localizeDate'
      );

      // Test with valid length but invalid format
      expect(checkForDateAndLocalize('20232020')).toBe('20232020');

      // Test with incomplete dates
      expect(checkForDateAndLocalize('2023010')).toBe('2023010');
      expect(checkForDateAndLocalize('202301')).toBe('202301');

      // Test with non-numeric characters
      expect(checkForDateAndLocalize('2023X101')).toBe('2023X101');

      // Check the localization function wasn't called
      expect(localizeSpy).not.toHaveBeenCalled();
    });
  });
});
