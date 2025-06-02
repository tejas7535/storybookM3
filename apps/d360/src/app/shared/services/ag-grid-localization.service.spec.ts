import { EMPTY, of } from 'rxjs';

import { AG_GRID_LOCALE_EN } from '@ag-grid-community/locale';
import { ValueFormatterParams } from 'ag-grid-enterprise';

import { Stub } from '../test/stub.class';
import { AgGridLocalizationService } from './ag-grid-localization.service';

describe('AgGridLocalizationService', () => {
  let service: AgGridLocalizationService;
  beforeEach(() => {
    service = Stub.get({ component: AgGridLocalizationService });
    jest
      .spyOn(service['translocoLocaleService'], 'getLocale')
      .mockReturnValue('de-DE');
  });
  describe('numberFormatter', () => {
    it('should return an empty string for empty value', () => {
      const translocoLocaleSpy = jest
        .spyOn(service['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('');
      const result = service.numberFormatter({
        value: undefined,
      } as ValueFormatterParams);
      expect(translocoLocaleSpy).not.toHaveBeenCalled();
      expect(result).toBe('');
    });

    it('should return only the localized number when no optional parameter is present', () => {
      const translocoLocaleSpy = jest
        .spyOn(service['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('1.234');
      const result = service.numberFormatter({
        value: 1234,
      } as ValueFormatterParams);
      expect(translocoLocaleSpy).toHaveBeenCalledWith(
        1234,
        'decimal',
        'de-DE',
        {}
      );
      expect(result).toBe('1.234');
    });

    it('should return the localized number with the unit', () => {
      const translocoLocaleSpy = jest
        .spyOn(service['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('1.234,00');
      const result = service.numberFormatter(
        { value: 1234 } as ValueFormatterParams,
        2,
        'EUR'
      );
      expect(translocoLocaleSpy).toHaveBeenCalledWith(
        1234,
        'decimal',
        'de-DE',
        { maximumFractionDigits: 2 }
      );
      expect(result).toBe('1.234,00 EUR');
    });

    it('should handle zero value correctly', () => {
      const translocoLocaleSpy = jest
        .spyOn(service['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('0');

      const result = service.numberFormatter({
        value: 0,
      } as ValueFormatterParams);

      expect(translocoLocaleSpy).toHaveBeenCalledWith(
        0,
        'decimal',
        'de-DE',
        {}
      );
      expect(result).toBe('0');
    });

    it('should handle string numeric values', () => {
      const translocoLocaleSpy = jest
        .spyOn(service['translocoLocaleService'], 'localizeNumber')
        .mockReturnValue('42,00');

      const result = service.numberFormatter({
        value: '42',
      } as ValueFormatterParams);

      expect(translocoLocaleSpy).toHaveBeenCalledWith(
        '42',
        'decimal',
        'de-DE',
        {}
      );
      expect(result).toBe('42,00');
    });
  });

  describe('dateFormatter', () => {
    it('should return an empty string for an empty value', () => {
      const translocoLocaleSpy = jest
        .spyOn(service['translocoLocaleService'], 'localizeDate')
        .mockReturnValue('');
      const result = service.dateFormatter({
        value: undefined,
      } as ValueFormatterParams);
      expect(translocoLocaleSpy).not.toHaveBeenCalled();
      expect(result).toBe('');
    });

    it('should return the localized date for a correct date value', () => {
      const translocoLocaleSpy = jest
        .spyOn(service['translocoLocaleService'], 'localizeDate')
        .mockReturnValue('01.01.2025');
      const result = service.dateFormatter({
        value: '2025-01-01T07:00:00',
      } as ValueFormatterParams);
      expect(translocoLocaleSpy).toHaveBeenCalledWith(
        expect.any(Date),
        'de-DE',
        { day: '2-digit', month: '2-digit', year: 'numeric' }
      );
      expect(result).toBe('01.01.2025');
    });
  });

  describe('constructor and lang signal', () => {
    it('should initialize with the correct language mapping', () => {
      const mockTranslocoService = { langChanges$: of('en') };

      const localService = Stub.get({
        component: AgGridLocalizationService,
        providers: [
          {
            provide: service['translocoService'],
            useValue: mockTranslocoService,
          },
        ],
      });

      expect(localService.lang()).toBe(AG_GRID_LOCALE_EN);
    });

    it('should map active language to the correct locale', () => {
      const mockTranslocoService = { langChanges$: EMPTY };

      const localService = Stub.get({
        component: AgGridLocalizationService,
        providers: [
          {
            provide: service['translocoService'],
            useValue: mockTranslocoService,
          },
        ],
      });

      expect(localService.lang()).toBe(AG_GRID_LOCALE_EN);
    });
  });
});
