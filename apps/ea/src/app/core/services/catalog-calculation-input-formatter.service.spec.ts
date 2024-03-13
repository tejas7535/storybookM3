import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';
import { SpectatorService } from '@ngneat/spectator/lib/spectator-service/spectator-service';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { CalculationResultReportInput } from '../store/models/calculation-result-report-input.model';
import { CatalogCalculationInputFormatterService } from './catalog-calculation-input-formatter.service';

describe('CatalogCalculationInputFormatterService', () => {
  let service: CatalogCalculationInputFormatterService;
  let spectator: SpectatorService<CatalogCalculationInputFormatterService>;
  const nonNumericValue = 'some string value that cannot be localized';
  const localizeNumber = jest.fn((number) => {
    if (number === nonNumericValue) {
      return '';
    }

    return `${number}`;
  });

  const createService = createServiceFactory({
    service: CatalogCalculationInputFormatterService,
    providers: [mockProvider(TranslocoLocaleService, { localizeNumber })],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('when formatting input has unit', () => {
    let input: CalculationResultReportInput;
    beforeEach(() => {
      input = {
        hasNestedStructure: false,
        value: '123',
        unit: 'mock_unit',
      };
    });

    it('should format input with unit', () => {
      expect(service.formatInputValue(input)).toBe('123 mock_unit');
      expect(localizeNumber).toHaveBeenCalled();
    });
  });

  describe('when formatting input does not has unit', () => {
    let input: CalculationResultReportInput;
    beforeEach(() => {
      input = {
        hasNestedStructure: false,
        value: '123',
      };
    });

    it('should format input without unit', () => {
      expect(service.formatInputValue(input)).toBe('123');
      expect(localizeNumber).toHaveBeenCalled();
    });
  });

  describe('when input is of type designation in supported languages', () => {
    let input: CalculationResultReportInput;
    beforeEach(() => {
      input = {
        hasNestedStructure: false,
        designation: 'Designation',
        value: '123',
        unit: 'mock_unit',
      };
    });

    it('should not format input with designation', () => {
      expect(service.formatInputValue(input)).toBe('123 mock_unit');
      expect(localizeNumber).not.toHaveBeenCalled();
    });
  });

  describe('when value is not provded', () => {
    let input: CalculationResultReportInput;
    beforeEach(() => {
      input = {
        hasNestedStructure: false,
        unit: 'mock_unit',
      };
    });

    it('should return empty string', () => {
      expect(service.formatInputValue(input)).toBe('');
      expect(localizeNumber).toHaveBeenCalledWith('', 'decimal');
    });
  });

  describe('when value is not a number', () => {
    let input: CalculationResultReportInput;
    beforeEach(() => {
      input = {
        hasNestedStructure: false,
        value: nonNumericValue,
        unit: 'mock_unit',
      };
    });

    it('should return original value', () => {
      expect(service.formatInputValue(input)).toBe(nonNumericValue);
      expect(localizeNumber).toHaveBeenCalledWith(nonNumericValue, 'decimal');
    });
  });
});
