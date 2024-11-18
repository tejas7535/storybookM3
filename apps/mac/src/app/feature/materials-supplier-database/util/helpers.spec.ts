import { TranslocoModule } from '@jsverse/transloco';

import { Co2Classification } from '../constants';
import {
  NONE_OPTION,
  SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION,
  SCHAEFFLER_EXPERTS_OPTION,
  SCHAEFFLER_EXPERTS_PCF_OPTION,
  THIRD_PARTY_VERIFIED_OPTION,
} from '../constants/co2-classification-options';
import {
  asStringOption,
  asStringOptionOrUndefined,
  determineCo2ClassificationNew,
  determineCo2ClassificationNewSecondary,
  useFormData,
} from './helpers';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

describe('helpers', () => {
  describe('asStringOption', () => {
    it('should return an object with id, title and tooltip', () => {
      const id = 'id';
      const title = 'title';
      const tooltip = 'tooltip';
      const result = asStringOption(id, title, tooltip);
      expect(result).toEqual({ id, title, tooltip });
    });

    it('should return an object with id and title', () => {
      const id = 'id';
      const title = 'title';
      const result = asStringOption(id, title);
      expect(result).toEqual({ id, title, tooltip: undefined });
    });

    it('should return an object with id and id as title', () => {
      const id = 'id';
      const result = asStringOption(id);
      expect(result).toEqual({ id, title: id, tooltip: undefined });
    });
  });

  describe('asStringOptionOrUndefined', () => {
    it('should return an object with id, title, tooltip and data', () => {
      const value = 'value';
      const title = 'title';
      const tooltip = 'tooltip';
      const data = 'data';
      const result = asStringOptionOrUndefined(value, title, tooltip, data);
      expect(result).toEqual({ id: value, title, tooltip, data });
    });

    it('should return an object with id, title and tooltip', () => {
      const value = 'value';
      const title = 'title';
      const tooltip = 'tooltip';
      const result = asStringOptionOrUndefined(value, title, tooltip);
      expect(result).toEqual({ id: value, title, tooltip, data: undefined });
    });

    it('should return an object with id and title', () => {
      const value = 'value';
      const title = 'title';
      const result = asStringOptionOrUndefined(value, title);
      expect(result).toEqual({
        id: value,
        title,
        tooltip: undefined,
        data: undefined,
      });
    });

    it('should return an object with id and id as title', () => {
      const value = 'value';
      const result = asStringOptionOrUndefined(value);
      expect(result).toEqual({
        id: value,
        title: value,
        tooltip: undefined,
        data: undefined,
      });
    });

    it('should return undefined if value is undefined', () => {
      const result = asStringOptionOrUndefined();
      expect(result).toBe(undefined);
    });
  });

  describe('useFormData', () => {
    it('should return true if co2UploadFileId is defined', () => {
      const co2UploadFileId = 1;
      const result = useFormData(co2UploadFileId);
      expect(result).toBe(true);
    });

    it('should return true if co2UploadFile is defined', () => {
      const co2UploadFile = new File([], 'file');
      const result = useFormData(undefined, co2UploadFile);
      expect(result).toBe(true);
    });

    it('should return false if co2UploadFileId and co2UploadFile are undefined', () => {
      const result = useFormData();
      expect(result).toBe(false);
    });
  });

  describe('determineCo2ClassificationNew', () => {
    it('should return SCHAEFFLER_EXPERTS_OPTION if co2Classification is CHECKED_BY_SCHAEFFLER_EXPERTS_CALCULATION_TOOL', () => {
      const co2Classification =
        Co2Classification.CHECKED_BY_SCHAEFFLER_EXPERTS_CALCULATION_TOOL;
      const result = determineCo2ClassificationNew(co2Classification);
      expect(result).toEqual(SCHAEFFLER_EXPERTS_OPTION);
    });

    it('should return SCHAEFFLER_EXPERTS_OPTION if co2Classification is CHECKED_BY_SCHAEFFLER_EXPERTS_PCF', () => {
      const co2Classification =
        Co2Classification.CHECKED_BY_SCHAEFFLER_EXPERTS_PCF;
      const result = determineCo2ClassificationNew(co2Classification);
      expect(result).toEqual(SCHAEFFLER_EXPERTS_OPTION);
    });

    it('should return NONE_OPTION if co2Classification is NONE', () => {
      const co2Classification = Co2Classification.NONE;
      const result = determineCo2ClassificationNew(co2Classification);
      expect(result).toEqual(NONE_OPTION);
    });

    it('should return NONE_OPTION if co2Classification is undefined', () => {
      const result = determineCo2ClassificationNew();
      expect(result).toEqual(NONE_OPTION);
    });

    it('should return THIRD_PARTY_VERIFIED_OPTION if co2Classification is not CHECKED_BY_SCHAEFFLER_EXPERTS_CALCULATION_TOOL, CHECKED_BY_SCHAEFFLER_EXPERTS_PCF, NONE or undefined', () => {
      const co2Classification = Co2Classification.THIRD_PARTY_VERIFIED;
      const result = determineCo2ClassificationNew(co2Classification);
      expect(result).toEqual(THIRD_PARTY_VERIFIED_OPTION);
    });
  });

  describe('determineCo2ClassificationNewSecondary', () => {
    it('should return SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION if co2Classification is CHECKED_BY_SCHAEFFLER_EXPERTS_CALCULATION_TOOL', () => {
      const co2Classification =
        Co2Classification.CHECKED_BY_SCHAEFFLER_EXPERTS_CALCULATION_TOOL;
      const result = determineCo2ClassificationNewSecondary(co2Classification);
      expect(result).toEqual(SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION);
    });

    it('should return SCHAEFFLER_EXPERTS_PCF_OPTION if co2Classification is CHECKED_BY_SCHAEFFLER_EXPERTS_PCF', () => {
      const co2Classification =
        Co2Classification.CHECKED_BY_SCHAEFFLER_EXPERTS_PCF;
      const result = determineCo2ClassificationNewSecondary(co2Classification);
      expect(result).toEqual(SCHAEFFLER_EXPERTS_PCF_OPTION);
    });

    it('should return SCHAEFFLER_EXPERTS_PCF_OPTION by default', () => {
      const co2Classification = Co2Classification.NONE;
      const result = determineCo2ClassificationNewSecondary(co2Classification);
      const result2 = determineCo2ClassificationNewSecondary();
      const result3 = determineCo2ClassificationNewSecondary(
        'anything' as Co2Classification
      );

      expect(result).toEqual(SCHAEFFLER_EXPERTS_PCF_OPTION);
      expect(result2).toEqual(SCHAEFFLER_EXPERTS_PCF_OPTION);
      expect(result3).toEqual(SCHAEFFLER_EXPERTS_PCF_OPTION);
    });
  });
});
