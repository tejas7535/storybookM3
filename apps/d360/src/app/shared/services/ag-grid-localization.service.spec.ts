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
});
