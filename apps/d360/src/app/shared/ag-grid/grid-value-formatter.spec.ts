import { ValueFormatterParams } from 'ag-grid-enterprise';

import { ReplacementType } from '../../feature/internal-material-replacement/model';
import * as parseUtils from '../utils/parse-values';
import {
  changeTypeValueFormatter,
  demandCharacteristicValueFormatter,
  listUploadPeriodTypeValueFormatter,
  planningLevelValueFormatter,
  planningMonthValueFormatter,
  portfolioStatusValueFormatter,
  replacementTypeValueFormatter,
  translateOr,
} from './grid-value-formatter';

describe('Grid Value Formatter', () => {
  describe('translateOr', () => {
    it('should return alternative when key is not translated', () => {
      expect(translateOr('some.key', {}, 'Alternative')).toBe('Alternative');
    });

    it('should return translation when no alternative provided', () => {
      expect(translateOr('some.key')).toBe('some.key');
    });
  });

  describe('portfolioStatusValueFormatter', () => {
    it('should return fallback for unknown portfolio status', () => {
      const formatter = portfolioStatusValueFormatter();
      expect(formatter({ value: 'NON_EXISTENT' })).toBe(
        'material_customer.portfolio_status.unknown'
      );
    });
  });

  describe('demandCharacteristicValueFormatter', () => {
    it('should return error message for unknown demand characteristic', () => {
      const formatter = demandCharacteristicValueFormatter();
      expect(formatter({ value: 'NON_EXISTENT' })).toBe('error.valueUnknown');
    });
  });

  describe('changeTypeValueFormatter', () => {
    it('should return error message for unknown change type', () => {
      const formatter = changeTypeValueFormatter();
      expect(formatter({ value: 'NON_EXISTENT' })).toBe('error.valueUnknown');
    });
  });

  describe('planningLevelValueFormatter', () => {
    it('should translate planning level correctly', () => {
      const formatter = planningLevelValueFormatter();
      expect(formatter({ value: 'MATERIAL' } as ValueFormatterParams)).toBe(
        'MATERIAL'
      );
    });

    it('should return original value for unknown planning level', () => {
      const formatter = planningLevelValueFormatter();
      expect(formatter({ value: 'UNKNOWN' } as ValueFormatterParams)).toBe(
        'UNKNOWN'
      );
    });
  });

  describe('planningMonthValueFormatter', () => {
    it('should return empty string for month "00"', () => {
      const formatter = planningMonthValueFormatter();
      expect(formatter({ value: '00' } as ValueFormatterParams)).toBe('');
    });

    it('should translate month correctly', () => {
      const formatter = planningMonthValueFormatter();
      expect(formatter({ value: '01' } as ValueFormatterParams)).toBe('01');
    });

    it('should return original value for unknown month', () => {
      const formatter = planningMonthValueFormatter();
      expect(formatter({ value: '13' } as ValueFormatterParams)).toBe('13');
    });
  });

  describe('replacementTypeValueFormatter', () => {
    it('should handle null values', () => {
      const formatter = replacementTypeValueFormatter();
      expect(formatter({ value: null })).toBeNull();
    });

    it('should handle undefined values', () => {
      const formatter = replacementTypeValueFormatter();
      expect(formatter({ value: undefined })).toBeNull();
    });

    it('should translate replacement type correctly', () => {
      jest
        .spyOn(parseUtils, 'parseToStringLiteralTypeIfPossible')
        .mockReturnValue('IDENTICAL' as ReplacementType);

      const formatter = replacementTypeValueFormatter();
      expect(formatter({ value: 'IDENTICAL' })).toBe(
        'replacement_type.IDENTICAL'
      );
    });

    it('should return original value if parsing fails', () => {
      jest
        .spyOn(parseUtils, 'parseToStringLiteralTypeIfPossible')
        .mockReturnValue(undefined as any);

      const formatter = replacementTypeValueFormatter();
      expect(formatter({ value: 'UNKNOWN_TYPE' })).toBe('UNKNOWN_TYPE');
    });
  });

  describe('listUploadPeriodTypeValueFormatter', () => {
    it('should handle null values', () => {
      const formatter = listUploadPeriodTypeValueFormatter();
      expect(formatter({ value: null } as ValueFormatterParams)).toBe('');
    });

    it('should handle undefined values', () => {
      const formatter = listUploadPeriodTypeValueFormatter();
      expect(formatter({ value: undefined } as ValueFormatterParams)).toBe('');
    });

    it('should handle empty string', () => {
      const formatter = listUploadPeriodTypeValueFormatter();
      expect(formatter({ value: '' } as ValueFormatterParams)).toBe('');
    });

    it('should translate upload period type correctly', () => {
      const formatter = listUploadPeriodTypeValueFormatter();
      expect(formatter({ value: 'MONTHLY' } as ValueFormatterParams)).toBe(
        'MONTHLY'
      );
    });

    it('should return original value for unknown upload period type', () => {
      const formatter = listUploadPeriodTypeValueFormatter();
      expect(formatter({ value: 'UNKNOWN' } as ValueFormatterParams)).toBe(
        'UNKNOWN'
      );
    });
  });
});
