import { TranslocoModule } from '@ngneat/transloco';

import { LabelValue } from '@schaeffler/label-value';

import * as subordinateDataMock from '@ga/testing/mocks/models/grease-report-subordinate-data.mock';
import * as resultMock from '@ga/testing/mocks/models/grease-result.mock';

import { SubordinateDataItemField } from '../models';
import * as helpers from './grease-helpers';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('Grease helpers', () => {
  describe('adaptLabelValuesFromGreaseResultData', () => {
    it('should convert result data into a set of label-value pairs', () => {
      const validResultData = helpers.adaptLabelValuesFromGreaseResultData([
        resultMock.greaseResultDataItemMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        ),
      ]);

      const labelValueFromValidResultData: LabelValue[] = [
        {
          label: `calculationResult.${resultMock.greaseResultDataItemTitleMock}`,
          labelHint: `calculationResult.${resultMock.greaseResultDataItemTooltipMock}`,
          value: resultMock.greaseResultDataItemValuesMock(
            subordinateDataMock.dataItemValueNumberMock,
            subordinateDataMock.dataItemUnitMock
          ),
        },
      ];

      expect(validResultData).toStrictEqual(labelValueFromValidResultData);
    });

    it('should handle invalid or incomplete data', () => {
      const invalidResultData = helpers.adaptLabelValuesFromGreaseResultData();
      const invalidResultDataItem =
        helpers.adaptLabelValuesFromGreaseResultData([undefined]);

      const labelValueFromInvalidResultData: LabelValue[] = [
        {
          label: '',
          labelHint: undefined,
          value: undefined,
        },
      ];

      expect(invalidResultData).toStrictEqual([]);
      expect(invalidResultDataItem).toStrictEqual(
        labelValueFromInvalidResultData
      );
    });
  });

  describe('itemValue', () => {
    it('should return a string value', () => {
      const value = helpers.itemValue(
        [subordinateDataMock.greaseReportSubordinateDataItemStringMock],
        subordinateDataMock.dataItemFieldStringMock
      );

      expect(value).toBe(subordinateDataMock.dataItemValueStringMock);
    });

    it('should return a number value', () => {
      const valueByFieldName = helpers.itemValue(
        [subordinateDataMock.greaseReportSubordinateDataItemNumberMock],
        subordinateDataMock.dataItemFieldNumberMock
      );
      const valueByIndex = helpers.itemValue(
        [subordinateDataMock.greaseReportSubordinateDataItemNumberMock],
        undefined,
        0
      );

      expect(valueByFieldName).toBe(
        subordinateDataMock.dataItemValueNumberMock
      );
      expect(valueByIndex).toBe(subordinateDataMock.dataItemValueNumberMock);
    });

    it('should return an empty string', () => {
      const valueItemsUndefined = helpers.itemValue(
        undefined,
        subordinateDataMock.dataItemFieldStringMock
      );
      const valueFieldUnknown = helpers.itemValue(
        [subordinateDataMock.greaseReportSubordinateDataItemNumberMock],
        subordinateDataMock.dataItemFieldStringMock
      );
      const valueFieldUndefined = helpers.itemValue([
        subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
      ]);
      const valueIndexInvalid = helpers.itemValue(
        [subordinateDataMock.greaseReportSubordinateDataItemNumberMock],
        undefined,
        2
      );

      expect(valueItemsUndefined).toBe('');
      expect(valueFieldUnknown).toBe('');
      expect(valueFieldUndefined).toBe('');
      expect(valueIndexInvalid).toBe('');
    });
  });

  describe('itemUnit', () => {
    it('should return a unit', () => {
      const value = helpers.itemUnit(
        [subordinateDataMock.greaseReportSubordinateDataItemNumberMock],
        subordinateDataMock.dataItemFieldNumberMock
      );

      expect(value).toBe(subordinateDataMock.dataItemUnitMock);
    });

    it('should return an empty string', () => {
      const unitItemsUndefined = helpers.itemUnit(
        undefined,
        subordinateDataMock.dataItemFieldStringMock
      );
      const unitFieldUnknown = helpers.itemUnit(
        [subordinateDataMock.greaseReportSubordinateDataItemNumberMock],
        subordinateDataMock.dataItemFieldStringMock
      );

      expect(unitItemsUndefined).toBe('');
      expect(unitFieldUnknown).toBe('');
    });
  });

  describe('secondaryValue', () => {
    it('should return a template string', () => {
      const mockValue = 'value';

      const valueTemplate = helpers.secondaryValue(mockValue);

      expect(valueTemplate).toBe(
        `<span class="text-low-emphasis">${mockValue}</span>`
      );
    });
  });

  describe('mapSuitabilityLevel', () => {
    it('should return a level description', () => {
      const validLevel = '++';
      const invalidLevel = '++--';

      const validResult = helpers.mapSuitabilityLevel(validLevel);

      expect(validResult).toBeTruthy();
      expect(validResult).toBe('ExtremelySuitable');

      const invalidResult = helpers.mapSuitabilityLevel(invalidLevel);

      expect(invalidResult).toBeFalsy();
      expect(invalidResult).toBe('');
    });
  });

  describe('manualRelubricationQuantity', () => {
    it('should return a value', () => {
      const value = helpers.manualRelubricationQuantity([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVRE_MAN_MIN,
        },
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVRE_MAN_MAX,
        },
      ]);

      expect(value).toBe(subordinateDataMock.dataItemValueNumberMock);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.manualRelubricationQuantity();
      const valueFieldUnknown = helpers.manualRelubricationQuantity([
        subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('manualRelubricationQuantityTimeSpan', () => {
    it('should return a value', () => {
      const value = helpers.manualRelubricationQuantityTimeSpan([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.TFR_MIN,
        },
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.TFR_MAX,
        },
      ]);

      expect(value).toBe(51_440);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.manualRelubricationQuantityTimeSpan();
      const valueFieldUnknown = helpers.manualRelubricationQuantityTimeSpan([
        subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('greaseServiceLife', () => {
    it('should return a value', () => {
      const value = helpers.greaseServiceLife([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.TFG_MIN,
        },
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.TFG_MAX,
        },
      ]);

      expect(value).toBe(51_440);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.greaseServiceLife();
      const valueFieldUnknown = helpers.greaseServiceLife([
        subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('automaticRelubricationQuantityUnit', () => {
    it('should return a unit', () => {
      const unit = helpers.automaticRelubricationQuantityUnit([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVIN,
        },
      ]);

      expect(unit).toBe(subordinateDataMock.dataItemUnitMock);
    });

    it('should return an empty string', () => {
      const unitItemsUndefined = helpers.automaticRelubricationQuantityUnit();
      const unitFieldUnknown = helpers.automaticRelubricationQuantityUnit([
        subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
      ]);

      expect(unitItemsUndefined).toBe('');
      expect(unitFieldUnknown).toBe('');
    });
  });

  describe('automaticRelubricationQuantityPerDay', () => {
    it('should return a value', () => {
      const value = helpers.automaticRelubricationQuantityPerDay([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVRE_AUT_MIN,
        },
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVRE_AUT_MAX,
        },
      ]);

      expect(value).toBe(subordinateDataMock.dataItemValueNumberMock);
    });

    it('should return 0', () => {
      const valueItemsUndefined =
        helpers.automaticRelubricationQuantityPerDay();
      const valueFieldUnknown = helpers.automaticRelubricationQuantityPerDay([
        subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBe(0);
      expect(valueFieldUnknown).toBe(0);
    });
  });

  describe('automaticRelubricationPerWeek', () => {
    it('should return a value', () => {
      const value = helpers.automaticRelubricationPerWeek([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVRE_AUT_MIN,
        },
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVRE_AUT_MAX,
        },
      ]);

      expect(value).toBe(8_641_975.229_999_999);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.automaticRelubricationPerWeek();
      const valueFieldUnknown = helpers.automaticRelubricationPerWeek([
        subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('automaticRelubricationPerMonth', () => {
    it('should return a value', () => {
      const value = helpers.automaticRelubricationPerMonth([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVRE_AUT_MIN,
        },
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVRE_AUT_MAX,
        },
      ]);

      expect(value).toBe(37_037_036.699_999_996);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.automaticRelubricationPerMonth();
      const valueFieldUnknown = helpers.automaticRelubricationPerMonth([
        subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('automaticRelubricationPerYear', () => {
    it('should return a value', () => {
      const value = helpers.automaticRelubricationPerYear([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVRE_AUT_MIN,
        },
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVRE_AUT_MAX,
        },
      ]);

      expect(value).toBe(450_617_279.849_999_96);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.automaticRelubricationPerYear();
      const valueFieldUnknown = helpers.automaticRelubricationPerYear([
        subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });
});
