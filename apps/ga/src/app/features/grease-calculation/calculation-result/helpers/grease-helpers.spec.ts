import { TranslocoModule } from '@jsverse/transloco';

import { LabelValue } from '@schaeffler/label-value';

import { GREASE_CONCEPT1_SUITABILITY } from '@ga/testing/mocks/models/grease-concept1-suitability.mock';
import * as subordinateDataMock from '@ga/testing/mocks/models/grease-report-subordinate-data.mock';
import { GreaseReportConcept1HintMock } from '@ga/testing/mocks/models/grease-report-subordinate-data.mock';
import { greaseResultConcept1Mock } from '@ga/testing/mocks/models/grease-result.mock';

import {
  CONCEPT1,
  CONCEPT1_SIZES,
  GreaseReportSubordinateDataItem,
  SubordinateDataItemField,
  SUITABILITY,
  SUITABILITY_LABEL,
} from '../models';
import * as helpers from './grease-helpers';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

describe('Grease helpers', () => {
  describe('adaptLabelValuesFromGreaseResultData', () => {
    it('should convert custom data with tooltip into a set of label-value pairs', () => {
      const validResultData = helpers.adaptLabelValuesFromGreaseResultData([
        greaseResultConcept1Mock,
      ]);

      const labelValueFromValidResultData: LabelValue[] = [
        {
          label: 'calculationResult.concept1',
          labelHint: GreaseReportConcept1HintMock,
          value: undefined,
          custom: {
            selector: CONCEPT1,
            data: GREASE_CONCEPT1_SUITABILITY,
          },
        },
      ];

      expect(validResultData).toStrictEqual(labelValueFromValidResultData);
    });

    it('should convert custom data without tooltip into a set of label-value pairs', () => {
      const data = {
        ...GREASE_CONCEPT1_SUITABILITY,
        hint: undefined,
      } as any;

      const validResultData = helpers.adaptLabelValuesFromGreaseResultData([
        {
          title: 'concept1',
          custom: {
            selector: CONCEPT1,
            data,
          },
        },
      ]);

      const labelValueFromValidResultData: LabelValue[] = [
        {
          label: 'calculationResult.concept1',
          labelHint: undefined,
          value: undefined,
          custom: {
            selector: 'CONCEPT1',
            data,
          },
        },
      ];

      expect(validResultData).toStrictEqual(labelValueFromValidResultData);
    });

    it('should convert custom data without available values into a set of label-value pairs', () => {
      const data = {
        ...GREASE_CONCEPT1_SUITABILITY,
        hint: 'some hint',
        c1_60: undefined,
        c1_125: undefined,
      } as any;

      const validResultData = helpers.adaptLabelValuesFromGreaseResultData([
        {
          title: 'concept1',
          custom: {
            selector: CONCEPT1,
            data,
          },
        },
      ]);

      const labelValueFromValidResultData: LabelValue[] = [
        {
          label: 'calculationResult.concept1',
          labelHint: undefined,
          value: undefined,
          custom: {
            selector: 'CONCEPT1',
            data,
          },
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

    it('should return result for input with special characters', () => {
      const value = helpers.greaseServiceLife([
        {
          value: '> 39420',
          field: SubordinateDataItemField.TFG_MIN,
        },
        {
          value: '< 43800',
          field: SubordinateDataItemField.TFG_MAX,
        },
      ]);

      expect(value).toBe(1734);
    });
  });

  describe('relubricationQuantityUnit', () => {
    it('should return a unit', () => {
      const unit = helpers.relubricationQuantityUnit([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVIN,
        },
      ]);

      expect(unit).toBe(subordinateDataMock.dataItemUnitMock);
    });

    it('should return an empty string', () => {
      const unitItemsUndefined = helpers.relubricationQuantityUnit();
      const unitFieldUnknown = helpers.relubricationQuantityUnit([
        subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
      ]);

      expect(unitItemsUndefined).toBe('');
      expect(unitFieldUnknown).toBe('');
    });
  });

  describe('relubricationQuantityPer1000OperatingHours', () => {
    it('should return a value', () => {
      const numberOfOperatingHours = 1000;
      const numberOfHoursInDay = 24;
      const expected =
        (subordinateDataMock.dataItemValueNumberMock / numberOfHoursInDay) *
        numberOfOperatingHours;
      const value = helpers.relubricationPerOperatingHours(
        numberOfOperatingHours,
        [
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MIN,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MAX,
          },
        ]
      );

      expect(value).toBe(expected);
    });

    it('should return 0', () => {
      const numberOfOperatingHours = 1000;

      const valueItemsUndefined = helpers.relubricationPerOperatingHours(
        numberOfOperatingHours
      );
      const valueFieldUnknown = helpers.relubricationPerOperatingHours(
        numberOfOperatingHours,
        [subordinateDataMock.greaseReportSubordinateDataItemNumberMock]
      );

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('relubricationIntervalInDays', () => {
    it('should return a value', () => {
      const value = helpers.relubricationIntervalInDays([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          value: 19_710,
          field: SubordinateDataItemField.TFR_MIN,
        },
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          value: 21_900,
          field: SubordinateDataItemField.TFR_MAX,
        },
      ]);

      expect(value).toBe(867);
    });

    describe('when values are not specified', () => {
      it('should return undefined', () => {
        const value = helpers.relubricationIntervalInDays([
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            value: undefined,
            field: SubordinateDataItemField.TFR_MIN,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            value: undefined,
            field: SubordinateDataItemField.TFR_MAX,
          },
        ]);

        expect(value).toBe(undefined);
      });
    });
  });

  describe('relubricationPer7days', () => {
    it('should return a value', () => {
      const numberOfDays = 7;
      const value = helpers.relubricationPerDays(numberOfDays, [
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
      const numberOfDays = 7;
      const valueItemsUndefined = helpers.relubricationPerDays(numberOfDays);
      const valueFieldUnknown = helpers.relubricationPerDays(numberOfDays, [
        subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
      ]);

      expect(valueItemsUndefined).toBeUndefined();
      expect(valueFieldUnknown).toBeUndefined();
    });
  });

  describe('relubricationPer30days', () => {
    it('should return a value', () => {
      const nummberOfDays = 30;
      const value = helpers.relubricationPerDays(nummberOfDays, [
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
  });

  describe('relubricationPer365days', () => {
    it('should return a value', () => {
      const numberOfDays = 365;
      const value = helpers.relubricationPerDays(numberOfDays, [
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
  });

  describe('getConcept1Setting', () => {
    it('should return a number', () => {
      const mockItems: GreaseReportSubordinateDataItem[] =
        subordinateDataMock.GreaseReportConcept1ItemsMock;
      const value = helpers.getConcept1Setting(
        mockItems,
        SubordinateDataItemField.C1_125
      );

      expect(value).toBe(subordinateDataMock.GreaseReportConcept1125ValueMock);
    });

    it('should return undefined, if there is eg. "- "', () => {
      const mockValue = '- ';
      const mockItems: GreaseReportSubordinateDataItem[] = [
        { field: SubordinateDataItemField.C1_125, value: mockValue },
      ];
      const value = helpers.getConcept1Setting(
        mockItems,
        SubordinateDataItemField.C1_125
      );

      expect(value).toBe(undefined);
    });
  });

  describe('getLabel', () => {
    it('should return suited label if the suitability is yes and there is a value', () => {
      expect(helpers.getLabel(SUITABILITY.YES, true)).toBe(
        SUITABILITY_LABEL.SUITED
      );
    });

    it('should return not suited label if the suitability is yes and there is no value', () => {
      expect(helpers.getLabel(SUITABILITY.YES, undefined)).toBe(
        SUITABILITY_LABEL.NOT_SUITED
      );
    });

    it('should return unsuited label if the suitability is no and there is no value', () => {
      expect(helpers.getLabel(SUITABILITY.NO, undefined)).toBe(
        SUITABILITY_LABEL.UNSUITED
      );
    });

    it('should return not suited label if the suitability is no and there is a value', () => {
      expect(helpers.getLabel(SUITABILITY.NO, true)).toBe(
        SUITABILITY_LABEL.NOT_SUITED
      );
    });

    it('should return conditional label if the suitability is condition and there is a value', () => {
      expect(helpers.getLabel(SUITABILITY.CONDITION, true)).toBe(
        SUITABILITY_LABEL.CONDITIONAL
      );
    });

    it('should return not suited label if the suitability is condition and there is no value', () => {
      expect(helpers.getLabel(SUITABILITY.CONDITION, false)).toBe(
        SUITABILITY_LABEL.NOT_SUITED
      );
    });

    it('should return unknown label if the suitability is unknown and there is a value', () => {
      expect(helpers.getLabel(SUITABILITY.UNKNOWN, true)).toBe(
        SUITABILITY_LABEL.UNKNOWN
      );
    });

    it('should return not suited label if the suitability is unknown an there is no value', () => {
      expect(helpers.getLabel(SUITABILITY.UNKNOWN, false)).toBe(
        SUITABILITY_LABEL.NOT_SUITED
      );
    });
  });

  describe('shortTitle', () => {
    it('should return a title that excludes the "Arcanol" word', () => {
      expect(helpers.shortTitle('Arcanol POMMESFETT 2')).toBe('POMMESFETT 2');
    });
  });

  describe('concept1InShop', () => {
    it('should return the existing concept1Queries entry', () => {
      const mockTitle = 'Arcanol FOOD 2';

      expect(helpers.concept1InShop(mockTitle, CONCEPT1_SIZES['60ML'])).toBe(
        'ARCALUB-C1-60-FOOD2'
      );
    });

    it('should return undefined if not in shop', () => {
      const mockTitle = 'Arcanol POMMESFETT 2';

      expect(helpers.concept1InShop(mockTitle, CONCEPT1_SIZES['60ML'])).toBe(
        undefined
      );
    });
  });

  describe('concept1ShopQuery', () => {
    it('should return the same thing that concept1InShop does', () => {
      const mockTitle = 'Arcanol FOOD 2';

      expect(helpers.concept1ShopQuery(mockTitle, CONCEPT1_SIZES['60ML'])).toBe(
        'ARCALUB-C1-60-FOOD2'
      );
    });

    it('should return undefined if not in shop', () => {
      const mockTitle = 'Arcanol POMMESFETT 2';

      expect(helpers.concept1ShopQuery(mockTitle, CONCEPT1_SIZES['60ML'])).toBe(
        'ARCALUB-C1-60-REFILLABLE'
      );
    });
  });

  describe('greaseShopQuery', () => {
    it('should return the shop query for 1kg if the grease is no exception', () => {
      const mockTitle = 'Arcanol Olive Oil';

      expect(helpers.greaseShopQuery(mockTitle)).toBe('Arcanol-Olive-Oil-1kg');
    });

    it('should return the shop query for the size defined in the exceptions', () => {
      const mockTitle = 'Arcanol LOAD1000';

      expect(helpers.greaseShopQuery(mockTitle)).toBe('Arcanol-LOAD1000-180kg');
    });
  });

  describe('greaseLinkText', () => {
    it('should return the link text for 1kg if the grease is no exception', () => {
      const mockTitle = 'Arcanol Olive Oil';

      expect(helpers.greaseLinkText(mockTitle)).toBe('Arcanol Olive Oil 1kg');
    });

    it('should return the link text for the size defined in the exceptions', () => {
      const mockTitle = 'Arcanol LOAD1000';

      expect(helpers.greaseLinkText(mockTitle)).toBe('Arcanol LOAD1000 180kg');
    });
  });

  describe('isGreaseSuited', () => {
    it('Should return true if grease is suited', () => {
      expect(helpers.isGreaseSuited(SUITABILITY_LABEL.SUITED)).toBe(true);
    });

    it('Should return false if grease is not suited', () => {
      expect(helpers.isGreaseSuited(SUITABILITY_LABEL.UNKNOWN)).toBe(false);
      expect(helpers.isGreaseSuited(SUITABILITY_LABEL.NOT_SUITED)).toBe(false);
      expect(helpers.isGreaseSuited(SUITABILITY_LABEL.UNSUITED)).toBe(false);
      expect(helpers.isGreaseSuited(SUITABILITY_LABEL.CONDITIONAL)).toBe(false);
      expect(helpers.isGreaseSuited('abc' as SUITABILITY_LABEL)).toBe(false);
    });
  });

  describe('isGreaseUnSuited', () => {
    it('Should return true if grease is unsuited', () => {
      expect(helpers.isGreaseUnSuited(SUITABILITY_LABEL.UNSUITED)).toBe(true);
    });

    it('Should return false if grease is not unsuited', () => {
      expect(helpers.isGreaseUnSuited(SUITABILITY_LABEL.SUITED)).toBe(false);
      expect(helpers.isGreaseUnSuited(SUITABILITY_LABEL.UNKNOWN)).toBe(false);
      expect(helpers.isGreaseUnSuited(SUITABILITY_LABEL.NOT_SUITED)).toBe(
        false
      );
      expect(helpers.isGreaseUnSuited(SUITABILITY_LABEL.CONDITIONAL)).toBe(
        false
      );
      expect(helpers.isGreaseUnSuited('abc' as SUITABILITY_LABEL)).toBe(false);
    });
  });
});
