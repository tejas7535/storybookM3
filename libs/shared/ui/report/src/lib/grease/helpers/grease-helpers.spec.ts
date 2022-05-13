import { TranslocoModule } from '@ngneat/transloco';

import { LabelValue } from '@schaeffler/label-value';

import * as resultMock from '../../../mocks/grease-result.mock';
import * as tableMock from '../../../mocks/table.mock';
import { Field } from '../../models';
import * as helpers from '../helpers/grease-helpers';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('Grease helpers', () => {
  describe('adaptLabelValuesFromGreaseResultData', () => {
    it('should convert result data into a set of label-value pairs', () => {
      const validResultData = helpers.adaptLabelValuesFromGreaseResultData([
        resultMock.greaseResultDataItemMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
        ),
      ]);

      const labelValueFromValidResultData: LabelValue[] = [
        {
          label: resultMock.greaseResultDataItemTitleMock,
          labelHint: resultMock.greaseResultDataItemTooltipMock,
          value: resultMock.greaseResultDataItemValuesMock(
            tableMock.mockTableItemValueNumber,
            tableMock.mockTableItemUnit
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
        [tableMock.tableItemStringMock],
        tableMock.mockTableItemFieldString
      );

      expect(value).toBe(tableMock.mockTableItemValueString);
    });

    it('should return a number value', () => {
      const valueByFieldName = helpers.itemValue(
        [tableMock.tableItemNumberMock],
        tableMock.mockTableItemFieldNumber
      );
      const valueByIndex = helpers.itemValue(
        [tableMock.tableItemNumberMock],
        undefined,
        0
      );

      expect(valueByFieldName).toBe(tableMock.mockTableItemValueNumber);
      expect(valueByIndex).toBe(tableMock.mockTableItemValueNumber);
    });

    it('should return an empty string', () => {
      const valueItemsUndefined = helpers.itemValue(
        undefined,
        tableMock.mockTableItemFieldString
      );
      const valueFieldUnknown = helpers.itemValue(
        [tableMock.tableItemNumberMock],
        tableMock.mockTableItemFieldString
      );
      const valueFieldUndefined = helpers.itemValue([
        tableMock.tableItemNumberMock,
      ]);
      const valueIndexInvalid = helpers.itemValue(
        [tableMock.tableItemNumberMock],
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
        [tableMock.tableItemNumberMock],
        tableMock.mockTableItemFieldNumber
      );

      expect(value).toBe(tableMock.mockTableItemUnit);
    });

    it('should return an empty string', () => {
      const unitItemsUndefined = helpers.itemUnit(
        undefined,
        tableMock.mockTableItemFieldString
      );
      const unitFieldUnknown = helpers.itemUnit(
        [tableMock.tableItemNumberMock],
        tableMock.mockTableItemFieldString
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
        { ...tableMock.tableItemNumberMock, field: Field.QVRE_MAN_MIN },
        { ...tableMock.tableItemNumberMock, field: Field.QVRE_MAN_MAX },
      ]);

      expect(value).toBe(tableMock.mockTableItemValueNumber);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.manualRelubricationQuantity();
      const valueFieldUnknown = helpers.manualRelubricationQuantity([
        tableMock.tableItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('manualRelubricationQuantityTimeSpan', () => {
    it('should return a value', () => {
      const value = helpers.manualRelubricationQuantityTimeSpan([
        { ...tableMock.tableItemNumberMock, field: Field.TFR_MIN },
        { ...tableMock.tableItemNumberMock, field: Field.TFR_MAX },
      ]);

      expect(value).toBe(51_440);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.manualRelubricationQuantityTimeSpan();
      const valueFieldUnknown = helpers.manualRelubricationQuantityTimeSpan([
        tableMock.tableItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('greaseServiceLife', () => {
    it('should return a value', () => {
      const value = helpers.greaseServiceLife([
        { ...tableMock.tableItemNumberMock, field: Field.TFG_MIN },
        { ...tableMock.tableItemNumberMock, field: Field.TFG_MAX },
      ]);

      expect(value).toBe(51_440);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.greaseServiceLife();
      const valueFieldUnknown = helpers.greaseServiceLife([
        tableMock.tableItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('automaticRelubricationQuantityUnit', () => {
    it('should return a unit', () => {
      const unit = helpers.automaticRelubricationQuantityUnit([
        { ...tableMock.tableItemNumberMock, field: Field.QVIN },
      ]);

      expect(unit).toBe(tableMock.mockTableItemUnit);
    });

    it('should return an empty string', () => {
      const unitItemsUndefined = helpers.automaticRelubricationQuantityUnit();
      const unitFieldUnknown = helpers.automaticRelubricationQuantityUnit([
        tableMock.tableItemNumberMock,
      ]);

      expect(unitItemsUndefined).toBe('');
      expect(unitFieldUnknown).toBe('');
    });
  });

  describe('automaticRelubricationQuantityPerDay', () => {
    it('should return a value', () => {
      const value = helpers.automaticRelubricationQuantityPerDay([
        { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MIN },
        { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MAX },
      ]);

      expect(value).toBe(tableMock.mockTableItemValueNumber);
    });

    it('should return 0', () => {
      const valueItemsUndefined =
        helpers.automaticRelubricationQuantityPerDay();
      const valueFieldUnknown = helpers.automaticRelubricationQuantityPerDay([
        tableMock.tableItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBe(0);
      expect(valueFieldUnknown).toBe(0);
    });
  });

  describe('automaticRelubricationPerWeek', () => {
    it('should return a value', () => {
      const value = helpers.automaticRelubricationPerWeek([
        { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MIN },
        { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MAX },
      ]);

      expect(value).toBe(8_641_975.229_999_999);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.automaticRelubricationPerWeek();
      const valueFieldUnknown = helpers.automaticRelubricationPerWeek([
        tableMock.tableItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('automaticRelubricationPerMonth', () => {
    it('should return a value', () => {
      const value = helpers.automaticRelubricationPerMonth([
        { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MIN },
        { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MAX },
      ]);

      expect(value).toBe(37_037_036.699_999_996);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.automaticRelubricationPerMonth();
      const valueFieldUnknown = helpers.automaticRelubricationPerMonth([
        tableMock.tableItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('automaticRelubricationPerYear', () => {
    it('should return a value', () => {
      const value = helpers.automaticRelubricationPerYear([
        { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MIN },
        { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MAX },
      ]);

      expect(value).toBe(450_617_279.849_999_96);
    });

    it('should return undefined', () => {
      const valueItemsUndefined = helpers.automaticRelubricationPerYear();
      const valueFieldUnknown = helpers.automaticRelubricationPerYear([
        tableMock.tableItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });
});
