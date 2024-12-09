import { Params } from '@angular/router';

import { ColumnFields } from '../ag-grid/constants/column-fields.enum';
import { FilterNames } from '../components/autocomplete-input/filter-names.enum';
import { SearchbarGridContext } from '../components/global-search-bar/config/searchbar-grid-context.interface';
import { MaterialsCriteriaSelection } from '../components/global-search-bar/materials-result-table/material-criteria-selection.enum';
import { FILTER_PARAM_INDICATOR } from '../constants/filter-from-query-params.const';
import { Keyboard, QuotationStatus, SAP_SYNC_STATUS } from '../models';
import { TargetPriceSource } from '../models/quotation/target-price-source.enum';
import { MaterialValidation } from '../models/table';
import { VALIDATION_CODE } from '../models/table/customer-validation-info.enum';
import { ValidationDescription } from '../models/table/validation-description.enum';
import { Severity, ValidatedDetail } from '../services/rest/material/models';
import * as miscUtils from './misc.utils';

describe('MiscUtils', () => {
  describe('calculateDuration', () => {
    test('should return undefined if startDate is undefined', (done) => {
      expect(
        miscUtils.calculateDuration(
          undefined,
          '2023-07-10T06:36:46.8018708Z',
          'de-DE'
        )
      ).toBeUndefined();
      done();
    });

    test('should return undefined if endDate is empty', (done) => {
      expect(
        miscUtils.calculateDuration(
          '2023-07-10T06:36:46.8018708Z',
          undefined,
          'de-DE'
        )
      ).toBeUndefined();
      done();
    });

    test('should return correct duration', (done) => {
      expect(
        miscUtils.calculateDuration(
          '2021-02-28T00:00:00Z',
          '2023-06-12T00:00:00Z',
          'de-DE'
        )
      ).toEqual({ years: 2, months: 3, days: 12 });
      done();
    });
    test('should return correct duration switch winter to summertime', (done) => {
      expect(
        miscUtils.calculateDuration(
          '2022-02-28T00:00:00Z',
          '2022-06-12T00:00:00Z',
          'de-DE'
        )
      ).toEqual({ years: 0, months: 3, days: 12 });
      done();
    });

    test('should return the correct duration (bug reported incl. summer to winter time switch)', (done) => {
      expect(
        miscUtils.calculateDuration(
          '2023-09-20T00:00:00Z',
          '2023-11-30T00:00:00Z',
          'de-DE'
        )
      ).toEqual({ years: 0, months: 2, days: 10 });
      done();
    });
    test('should return the correct duration both summer time', (done) => {
      expect(
        miscUtils.calculateDuration(
          '2023-06-30T00:00:00Z',
          '2023-09-20T00:00:00Z',
          'de-DE'
        )
      ).toEqual({ years: 0, months: 2, days: 21 });
      done();
    });
  });

  describe('getMomentUtcStartOfDayDate', () => {
    test('should return the correct moment date when it is already midnight', () => {
      const date = '2023-06-30T00:00:00Z';
      const result = miscUtils.getMomentUtcStartOfDayDate(date);
      expect(result.format()).toEqual('2023-06-30T00:00:00Z');
    });
    test('should return the correct moment date when it is not midnight', () => {
      const date = '2023-06-30T12:00:00Z';
      const result = miscUtils.getMomentUtcStartOfDayDate(date);
      expect(result.format()).toEqual('2023-06-30T00:00:00Z');
    });
  });
  describe('getCurrentYear', () => {
    test('getCurrentYear', () => {
      Date.prototype.getFullYear = jest.fn(() => 2020);
      expect(miscUtils.getCurrentYear()).toEqual(2020);
      expect(Date.prototype.getFullYear).toHaveBeenCalledTimes(1);
    });

    test('getLastYear', () => {
      jest.spyOn(miscUtils, 'getCurrentYear').mockReturnValue(2020);
      expect(miscUtils.getLastYear()).toEqual(2019);
      expect(miscUtils.getCurrentYear).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateQuantityInputKeyPress', () => {
    test('should prevent default on invalid input', () => {
      const event = { key: 'a', preventDefault: jest.fn() } as any;
      miscUtils.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
    test('should not prevent default when input is a number', () => {
      const event = { key: '1', preventDefault: jest.fn() } as any;
      miscUtils.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
    test('should not prevent default when input is paste event', () => {
      const event = {
        key: 'v',
        preventDefault: jest.fn(),
        ctrlKey: true,
      } as any;
      miscUtils.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });

    test('should not prevent default when input is paste event on macOs', () => {
      const event = {
        key: 'v',
        preventDefault: jest.fn(),
        ctrlKey: false,
        metaKey: true,
      } as any;
      miscUtils.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });

    test('should not prevent default when input is delete key', () => {
      const event = {
        key: Keyboard.BACKSPACE,
        preventDefault: jest.fn(),
      } as any;
      miscUtils.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
  });

  describe('parseLocalizedInputValue', () => {
    [
      {
        locale: 'de-DE',
        inputs: [
          undefined,
          '100',
          '1.000',
          '1.000.000',
          '1.000.000,45678',
          '10,23',
          '1,5',
        ],
        expectedOutputs: [
          0, 100, 1000, 1_000_000, 1_000_000.456_78, 10.23, 1.5,
        ],
      },
      {
        locale: 'en-US',
        inputs: [
          undefined,
          '100',
          '1,000',
          '1,000,000',
          '1,000,000.45678',
          '10.23',
          '1.5',
        ],
        expectedOutputs: [
          0, 100, 1000, 1_000_000, 1_000_000.456_78, 10.23, 1.5,
        ],
      },
    ].forEach((testCase) => {
      testCase.inputs.forEach((input, index) => {
        test(`should return ${testCase.expectedOutputs[index]} for ${testCase.inputs[index]} for locale ${testCase.locale}`, () => {
          const result = miscUtils.parseLocalizedInputValue(
            input,
            testCase.locale
          );

          expect(result).toEqual(testCase.expectedOutputs[index]);
        });
      });
    });
  });

  describe('parseNullableLocalizedInputValue', () => {
    [
      {
        locale: 'de-DE',
        inputs: [
          undefined,
          '100',
          '1.000',
          '1.000.000',
          '1.000.000,45678',
          '10,23',
          '1,5',
        ],
        expectedOutputs: [
          undefined,
          100,
          1000,
          1_000_000,
          1_000_000.456_78,
          10.23,
          1.5,
        ],
      },
      {
        locale: 'en-US',
        inputs: [
          undefined,
          '100',
          '1,000',
          '1,000,000',
          '1,000,000.45678',
          '10.23',
          '1.5',
        ],
        expectedOutputs: [
          undefined,
          100,
          1000,
          1_000_000,
          1_000_000.456_78,
          10.23,
          1.5,
        ],
      },
    ].forEach((testCase) => {
      testCase.inputs.forEach((input, index) => {
        test(`should return ${testCase.expectedOutputs[index]} for ${testCase.inputs[index]} for locale ${testCase.locale}`, () => {
          const result = miscUtils.parseNullableLocalizedInputValue(
            input,
            testCase.locale
          );

          expect(result).toEqual(testCase.expectedOutputs[index]);
        });
      });
    });
  });

  describe('groupBy', () => {
    test('should group array by item', () => {
      const array = [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
        { id: 1, name: 'test3' },
        { id: 2, name: 'test4' },
      ];

      const result = miscUtils.groupBy(array, (item) => item.id);

      expect(result).toEqual(
        new Map([
          [
            1,
            [
              { id: 1, name: 'test1' },
              { id: 1, name: 'test3' },
            ],
          ],
          [
            2,
            [
              { id: 2, name: 'test2' },
              { id: 2, name: 'test4' },
            ],
          ],
        ])
      );
    });
  });

  describe('addMaterialFilterToQueryParams', () => {
    test('should return Params without adding any filter', () => {
      const params: Params = {};
      miscUtils.addMaterialFilterToQueryParams(params, null, {});
      expect(params).toEqual({});
    });
    test('should add filter for MaterialsCriteriaSelection.MATERIAL_NUMBER', () => {
      const params: Params = {};
      const context = {
        filter: MaterialsCriteriaSelection.MATERIAL_NUMBER,
        columnUtilityService: {
          materialTransform: jest.fn(() => '123'),
        },
      } as unknown as SearchbarGridContext;
      const data = { materialNumber15: '123' };
      miscUtils.addMaterialFilterToQueryParams(params, context, data);
      expect(
        params[`${FILTER_PARAM_INDICATOR}${ColumnFields.MATERIAL_NUMBER_15}`]
      ).toEqual('123');
    });
    test('should add filter for MaterialsCriteriaSelection.MATERIAL_DESCRIPTION', () => {
      const params: Params = {};
      const context = {
        filter: MaterialsCriteriaSelection.MATERIAL_DESCRIPTION,
      } as unknown as SearchbarGridContext;
      const data = { materialDescription: 'description' };

      miscUtils.addMaterialFilterToQueryParams(params, context, data);

      expect(
        params[`${FILTER_PARAM_INDICATOR}${ColumnFields.MATERIAL_DESCRIPTION}`]
      ).toEqual('description');
    });
    test('should add filter for MaterialsCriteriaSelection.CUSTOMER_MATERIAL_NUMBER', () => {
      const params: Params = {};
      const context = {
        filter: MaterialsCriteriaSelection.CUSTOMER_MATERIAL_NUMBER,
      } as unknown as SearchbarGridContext;
      const data = { customerMaterial: 'customerMaterial' };
      miscUtils.addMaterialFilterToQueryParams(params, context, data);
      expect(
        params[`${FILTER_PARAM_INDICATOR}${ColumnFields.CUSTOMER_MATERIAL}`]
      ).toEqual('customerMaterial');
    });
  });

  describe('getTagTypeByStatus', () => {
    test('should return info for QuotationStatus.IN_APPROVAL', () => {
      expect(miscUtils.getTagTypeByStatus(QuotationStatus.IN_APPROVAL)).toEqual(
        'info'
      );
    });
    test('should return success for QuotationStatus.APPROVED', () => {
      expect(miscUtils.getTagTypeByStatus(QuotationStatus.APPROVED)).toEqual(
        'success'
      );
    });
    test('should return error for QuotationStatus.REJECTED', () => {
      expect(miscUtils.getTagTypeByStatus(QuotationStatus.REJECTED)).toEqual(
        'error'
      );
    });
    test('should return info for SAP_SYNC_STATUS.SYNCED', () => {
      expect(miscUtils.getTagTypeByStatus(SAP_SYNC_STATUS.SYNCED)).toEqual(
        'info'
      );
    });
    test('should return neutral for SAP_SYNC_STATUS.NOT_SYNCED', () => {
      expect(miscUtils.getTagTypeByStatus(SAP_SYNC_STATUS.NOT_SYNCED)).toEqual(
        'neutral'
      );
    });
    test('should return warning for SAP_SYNC_STATUS.SYNC_PENDING', () => {
      expect(
        miscUtils.getTagTypeByStatus(SAP_SYNC_STATUS.SYNC_PENDING)
      ).toEqual('warning');
    });
    test('should return warning for SAP_SYNC_STATUS.PARTIAL_SYNCED', () => {
      expect(
        miscUtils.getTagTypeByStatus(SAP_SYNC_STATUS.PARTIALLY_SYNCED)
      ).toEqual('warning');
    });
  });

  describe('mapMaterialAutocompleteToIdValue', () => {
    test('should map to IdValue when filter is MaterialNumber', () => {
      const value = {
        materialNumber15: '123',
        materialDescription: 'desc',
        customerMaterial: 'cust',
      };
      const result = miscUtils.mapMaterialAutocompleteToIdValue(
        value,
        FilterNames.MATERIAL_NUMBER
      );
      expect(result).toEqual({
        id: '123',
        value: 'desc',
        value2: 'cust',
        selected: false,
      });
    });
    test('should map to IdValue when filter is MaterialDescription', () => {
      const value = {
        materialNumber15: '123',
        materialDescription: 'desc',
        customerMaterial: 'cust',
      };
      const result = miscUtils.mapMaterialAutocompleteToIdValue(
        value,
        FilterNames.MATERIAL_DESCRIPTION
      );
      expect(result).toEqual({
        id: 'desc',
        value: '123',
        value2: 'cust',
        selected: false,
      });
    });
    test('should map to IdValue when filter is CustomerMaterial', () => {
      const value = {
        materialNumber15: '123',
        materialDescription: 'desc',
        customerMaterial: 'cust',
      };
      const result = miscUtils.mapMaterialAutocompleteToIdValue(
        value,
        FilterNames.CUSTOMER_MATERIAL
      );
      expect(result).toEqual({
        id: 'cust',
        value: '123',
        value2: 'desc',
        selected: false,
      });
    });
  });

  describe('mapIdValueToMaterialAutoComplete', () => {
    test('should map to MaterialAutoComplete when filter is MaterialNumber', () => {
      const value = {
        id: '123',
        value: 'desc',
        value2: 'cust',
        selected: false,
      };
      const result = miscUtils.mapIdValueToMaterialAutoComplete(
        value,
        FilterNames.MATERIAL_NUMBER
      );
      expect(result).toEqual({
        materialNumber15: '123',
        materialDescription: 'desc',
        customerMaterial: 'cust',
      });
    });
    test('should map to MaterialAutoComplete when filter is MaterialDescription', () => {
      const value = {
        id: 'desc',
        value: '123',
        value2: 'cust',
        selected: false,
      };
      const result = miscUtils.mapIdValueToMaterialAutoComplete(
        value,
        FilterNames.MATERIAL_DESCRIPTION
      );
      expect(result).toEqual({
        materialNumber15: '123',
        materialDescription: 'desc',
        customerMaterial: 'cust',
      });
    });
    test('should map to MaterialAutoComplete when filter is CustomerMaterial', () => {
      const value = {
        id: 'cust',
        value: '123',
        value2: 'desc',
        selected: false,
      };
      const result = miscUtils.mapIdValueToMaterialAutoComplete(
        value,
        FilterNames.CUSTOMER_MATERIAL
      );
      expect(result).toEqual({
        materialNumber15: '123',
        materialDescription: 'desc',
        customerMaterial: 'cust',
      });
    });
  });

  describe('getNextHigherPossibleMultiple', () => {
    test('should return the next higher possible multiple', () => {
      expect(miscUtils.getNextHigherPossibleMultiple(101, 50)).toBe(150);
      expect(miscUtils.getNextHigherPossibleMultiple(100, 50)).toBe(100);
    });
  });

  describe('getNextLowerPossibleMultiple', () => {
    test('should return the next lower possible multiple', () => {
      expect(miscUtils.getNextLowerPossibleMultiple(101, 50)).toBe(100);
      expect(miscUtils.getNextLowerPossibleMultiple(100, 50)).toBe(100);
    });
  });

  describe('mapToAddDetailsValidationRequest', () => {
    test('create AddDetailsValidationRequest', () => {
      const customer = { customerId: '12345', salesOrg: '0615' };
      const tableData = [
        {
          id: 1,
          materialNumber: '1234',
          materialDescription: 'matDESC',
          customerMaterialNumber: '1234_customer',
          quantity: 20,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
      ];
      const expected = {
        customerId: customer,
        details: [
          {
            id: 1,
            data: {
              materialNumber15: '1234',
              customerMaterial: '1234_customer',
              quantity: 20,
            },
          },
        ],
      };
      const result = miscUtils.mapToAddDetailsValidationRequest(
        customer,
        tableData
      );
      expect(result).toEqual(expected);
    });
  });

  describe('mapValidatedDetailToMaterialValidation', () => {
    test('map ValidatedDetail to MaterialValidation', () => {
      const validatedDetail = {
        id: 1,
        userInput: {
          materialNumber15: 'MatNummer',
          quantity: 4,
          customerMaterial: 'CustMatNummer',
        },
        materialData: {
          materialNumber15: 'MatNummer',
          materialDescription: 'MatDesc',
          materialPriceUnit: 1,
          materialUoM: 'PC',
        },
        customerData: {
          correctedQuantity: 7,
          customerMaterial: 'CustMatNummer',
          deliveryUnit: 5,
        },
        valid: true,
        validationCodes: [
          {
            code: VALIDATION_CODE.QDV001,
            description: 'quantatiy updated',
            severity: Severity.INFO,
          },
        ],
      } as ValidatedDetail;
      const expected = {
        id: 1,
        valid: true,
        materialNumber15: 'MatNummer',
        customerMaterial: 'CustMatNummer',
        correctedQuantity: 7,
        materialDescription: 'MatDesc',
        materialPriceUnit: 1,
        materialUoM: 'PC',
        validationCodes: [
          {
            code: VALIDATION_CODE.QDV001,
            description: 'quantatiy updated',
            severity: Severity.INFO,
          },
        ],
      } as MaterialValidation;
      const result =
        miscUtils.mapValidatedDetailToMaterialValidation(validatedDetail);
      expect(result).toEqual(expected);
    });
  });
  describe('getTargetPriceSourceValue', () => {
    test('should return Internal when targetPrice is set', () => {
      const result = miscUtils.getTargetPriceSourceValue(
        '1',
        true,
        TargetPriceSource.NO_ENTRY
      );
      expect(result).toEqual(TargetPriceSource.INTERNAL);
    });

    test('should still return Customer when already been set', () => {
      const result = miscUtils.getTargetPriceSourceValue(
        '1',
        true,
        TargetPriceSource.CUSTOMER
      );
      expect(result).toEqual(TargetPriceSource.CUSTOMER);
    });

    test('should return No_Entry when target Price is not set', () => {
      const result = miscUtils.getTargetPriceSourceValue(
        '',
        true,
        TargetPriceSource.INTERNAL
      );
      expect(result).toEqual(TargetPriceSource.NO_ENTRY);
    });
  });
  describe('getTargetPriceValue', () => {
    test('should return null when TargetPriceSOurce is net To no_Entry', () => {
      const result = miscUtils.getTargetPriceValue(
        TargetPriceSource.NO_ENTRY,
        null
      );
      expect(result).toBeNull();
    });
    test('should return targetPriceValue when TargetPriceSource is not no_Entry', () => {
      const result = miscUtils.getTargetPriceValue(
        TargetPriceSource.INTERNAL,
        100
      );
      expect(result).toBe(100);
    });
  });
});
