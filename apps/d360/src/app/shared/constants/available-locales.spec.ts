import { DateAdapter } from '@angular/material/core';

import { getBrowserCultureLang } from '@jsverse/transloco';

import { ValidationHelper } from '../utils/validation/validation-helper';
import * as AvailableLocales from './available-locales';

describe('Available Locales', () => {
  describe('Locale constants', () => {
    it('should define LOCALE_DE correctly', () => {
      expect(AvailableLocales.LOCALE_DE).toEqual({
        id: 'de-DE',
        label: 'Deutsch (Deutschland)',
      });
    });

    it('should define LOCALE_EN correctly', () => {
      expect(AvailableLocales.LOCALE_EN).toEqual({
        id: 'en-US',
        label: 'English (United States)',
      });
    });

    // Additional locale constant tests could be added
  });

  describe('AVAILABLE_LOCALES', () => {
    it('should contain all defined locales', () => {
      expect(AvailableLocales.AVAILABLE_LOCALES).toContain(
        AvailableLocales.LOCALE_DE
      );
      expect(AvailableLocales.AVAILABLE_LOCALES).toContain(
        AvailableLocales.LOCALE_EN
      );
      expect(AvailableLocales.AVAILABLE_LOCALES).toContain(
        AvailableLocales.LOCALE_EN_GB
      );
      expect(AvailableLocales.AVAILABLE_LOCALES).toContain(
        AvailableLocales.LOCALE_FR
      );
      expect(AvailableLocales.AVAILABLE_LOCALES).toContain(
        AvailableLocales.LOCALE_ZH
      );
      // We could test for all locales but this shows the pattern
    });

    it('should have the correct number of locales', () => {
      expect(AvailableLocales.AVAILABLE_LOCALES.length).toBe(19);
    });
  });

  describe('DATE_FNS_LOOKUP', () => {
    it('should map locale IDs to date-fns locales', () => {
      expect(AvailableLocales.DATE_FNS_LOOKUP['de-DE']).toBeDefined();
      expect(AvailableLocales.DATE_FNS_LOOKUP['en-US']).toBeDefined();
      expect(AvailableLocales.DATE_FNS_LOOKUP['fr-FR']).toBeDefined();
      expect(AvailableLocales.DATE_FNS_LOOKUP['zh-CN']).toBeDefined();
    });

    it('should contain mappings for all LocaleTypes', () => {
      const localeTypes = Object.keys(AvailableLocales.DATE_FNS_LOOKUP);
      expect(localeTypes.length).toBe(19); // Should match the number of LocaleTypes
    });
  });

  describe('getDefaultLocale', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return the browser locale if it exists in AVAILABLE_LOCALES', () => {
      (getBrowserCultureLang as jest.Mock).mockReturnValue('de-DE');

      const result = AvailableLocales.getDefaultLocale();

      expect(result).toEqual(AvailableLocales.LOCALE_DE);
    });

    it('should return DEFAULT_LOCALE if browser locale is not in AVAILABLE_LOCALES', () => {
      (getBrowserCultureLang as jest.Mock).mockReturnValue(
        'unsupported-locale'
      );

      const result = AvailableLocales.getDefaultLocale();

      expect(result).toEqual(AvailableLocales.DEFAULT_LOCALE);
    });

    it('should return DEFAULT_LOCALE if getBrowserCultureLang returns null', () => {
      (getBrowserCultureLang as jest.Mock).mockReturnValue(null);

      const result = AvailableLocales.getDefaultLocale();

      expect(result).toEqual(AvailableLocales.DEFAULT_LOCALE);
    });
  });

  describe('dateFormatFactory', () => {
    it('should generate correct format based on locale adapter', () => {
      const mockDateFormat = 'DD.MM.YYYY';
      jest
        .spyOn(ValidationHelper, 'getDateFormat')
        .mockReturnValue(mockDateFormat);

      const mockAdapter = {
        locale: { code: 'de-DE' as AvailableLocales.LocaleType },
      } as unknown as DateAdapter<Date>;

      const result = AvailableLocales.dateFormatFactory(mockAdapter);

      expect(result.parse.dateInput).toBe(mockDateFormat);
      expect(result.display.dateInput).toBe(mockDateFormat);
    });
  });

  describe('monthYearDateFormatFactory', () => {
    it('should call getMonthYearDateFormatByCode with the adapter locale code', () => {
      expect(
        AvailableLocales.monthYearDateFormatFactory({
          locale: { code: 'fr-FR' as AvailableLocales.LocaleType },
        } as unknown as DateAdapter<Date>)
      ).toEqual({
        parse: { dateInput: 'MM.yyyy' },
        display: {
          dateInput: 'MM.yyyy',
          monthYearLabel: 'MMMM yyyy',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM yyyy',
        },
      });
    });
  });

  describe('getMonthYearDateFormatByCode', () => {
    it('should return correct format for German locale', () => {
      const result = AvailableLocales.getMonthYearDateFormatByCode('de-DE');

      expect(result.parse.dateInput).toBe('MM.yyyy');
      expect(result.display.dateInput).toBe('MM.yyyy');
    });

    it('should return correct format for English locale', () => {
      const result = AvailableLocales.getMonthYearDateFormatByCode('en-US');

      expect(result.parse.dateInput).toBe('MM/yyyy');
      expect(result.display.dateInput).toBe('MM/yyyy');
    });

    it('should return correct format for Chinese locale', () => {
      const result = AvailableLocales.getMonthYearDateFormatByCode('zh-CN');

      expect(result.parse.dateInput).toBe('yyyy/MM');
      expect(result.display.dateInput).toBe('yyyy/MM');
    });

    it('should handle locale codes without country part', () => {
      const result = AvailableLocales.getMonthYearDateFormatByCode(
        'en' as AvailableLocales.LocaleType
      );

      // Should convert 'en' to 'en-EN' internally
      expect(result.parse.dateInput).toBe('MM/yyyy');
    });

    it('should normalize locale code case', () => {
      const result = AvailableLocales.getMonthYearDateFormatByCode(
        'fr-fr' as AvailableLocales.LocaleType
      );

      // Should normalize to 'fr-FR' internally
      expect(result.parse.dateInput).toBe('MM.yyyy');
    });

    it('should return correct format for Italian locale', () => {
      const result = AvailableLocales.getMonthYearDateFormatByCode('it-IT');

      expect(result.parse.dateInput).toBe('MM.yyyy');
      expect(result.display.dateInput).toBe('MM.yyyy');
      expect(result.display.monthYearLabel).toBe('MMMM yyyy');
    });

    it('should return correct format for Swiss French locale', () => {
      const result = AvailableLocales.getMonthYearDateFormatByCode('fr-CH');

      expect(result.parse.dateInput).toBe('MM.yyyy');
      expect(result.display.dateInput).toBe('MM.yyyy');
    });

    it('should handle zh-ZH and cn-CN as Chinese locales', () => {
      const zhResult = AvailableLocales.getMonthYearDateFormatByCode(
        'zh-ZH' as AvailableLocales.LocaleType
      );
      const cnResult = AvailableLocales.getMonthYearDateFormatByCode(
        'cn-CN' as AvailableLocales.LocaleType
      );

      expect(zhResult.parse.dateInput).toBe('yyyy/MM');
      expect(zhResult.display.monthYearLabel).toBe('yyyy年MM月');

      expect(cnResult.parse.dateInput).toBe('yyyy/MM');
      expect(cnResult.display.monthYearLabel).toBe('yyyy年MM月');
    });

    it('should use default format for unsupported locales', () => {
      // Using type assertion to bypass the TypeScript check
      const result = AvailableLocales.getMonthYearDateFormatByCode(
        'ja-JP' as unknown as AvailableLocales.LocaleType
      );

      // Should fall into the default case
      expect(result.parse.dateInput).toBe('MM/yyyy');
      expect(result.display.dateInput).toBe('MM/yyyy');
    });

    it('should handle Portuguese locales correctly', () => {
      const ptPTResult = AvailableLocales.getMonthYearDateFormatByCode('pt-PT');
      const ptBRResult = AvailableLocales.getMonthYearDateFormatByCode('pt-BR');

      // Both should fall into default case
      expect(ptPTResult.parse.dateInput).toBe('MM/yyyy');
      expect(ptBRResult.parse.dateInput).toBe('MM/yyyy');
    });
  });
});
