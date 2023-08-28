import { SAP_ERROR_MESSAGE_CODE } from '@gq/shared/models/quotation-detail';

import { MATERIAL_TABLE_ITEM_MOCK } from '../../../../testing/mocks';
import {
  MaterialQuantities,
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '../../models/table';
import { TableService } from './table.service';

describe('TableService', () => {
  describe('addItems', () => {
    test('should add initial item', () => {
      const currentRowData: MaterialTableItem[] = [];

      const newItems = [{ quantity: 100, materialNumber: '23457' }];

      const result = TableService.addItems(newItems, currentRowData);
      expect(result).toEqual([
        { id: 0, quantity: 100, materialNumber: '23457' },
      ]);
    });
    test('should add items', () => {
      const items: MaterialTableItem[] = [
        { quantity: 100, materialNumber: '23457' },
        { quantity: 10, materialNumber: '1234' },
        { quantity: 120, materialNumber: '76543' },
      ];
      const currentRowData: MaterialTableItem[] = [
        { id: 0, quantity: 120, materialNumber: '76543' },
      ];

      const result = TableService.addItems(items, currentRowData);

      expect(result).toEqual([
        { id: 0, quantity: 120, materialNumber: '76543' },
        { id: 1, quantity: 100, materialNumber: '23457' },
        { id: 2, quantity: 10, materialNumber: '1234' },
        { id: 3, quantity: 120, materialNumber: '76543' },
      ]);
    });
  });
  describe('duplicateItem', () => {
    test('should duplicate item', () => {
      const currentItems = [{ id: 0, quantity: 100, materialNumber: '23457' }];
      const itemId = 0;

      const result = TableService.duplicateItem(itemId, currentItems);
      expect(result).toEqual([
        { id: 0, quantity: 100, materialNumber: '23457' },
        { id: 1, quantity: 100, materialNumber: '23457' },
      ]);
    });
  });
  describe('updateItem', () => {
    test('should update matching materialNumber in data array with validation', () => {
      const data: MaterialTableItem[] = [
        MATERIAL_TABLE_ITEM_MOCK,
        { ...MATERIAL_TABLE_ITEM_MOCK, id: 2 },
      ];
      const newItem = { id: 1, materialNumber: '019014961-0000-02' };
      const result = TableService.updateItem(newItem, data, true);

      expect(result).toEqual([
        {
          ...newItem,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
            errorCode: undefined,
          },
        },
        data[1],
      ]);
    });
    test('should update matching materialNumber in data array WITHOUT validation', () => {
      const data: MaterialTableItem[] = [
        {
          ...MATERIAL_TABLE_ITEM_MOCK,
          currency: 'EUR',
          UoM: '1',
          priceUnit: 100,
          targetPrice: 150,
        },
        { ...MATERIAL_TABLE_ITEM_MOCK, id: 2 },
      ];
      const newItem = { ...MATERIAL_TABLE_ITEM_MOCK, quantity: 5 };
      const result = TableService.updateItem(newItem, data, false);

      expect(result).toEqual([
        {
          ...newItem,
          currency: 'EUR',
          UoM: '1',
          priceUnit: 100,
        },
        data[1],
      ]);
    });
    test('when currency is empty in store, use the currency of updated item instead', () => {
      const data: MaterialTableItem[] = [
        {
          ...MATERIAL_TABLE_ITEM_MOCK,
          currency: undefined,
          UoM: '1',
          priceUnit: 100,
          targetPrice: 150,
        },
        { ...MATERIAL_TABLE_ITEM_MOCK, id: 2 },
      ];
      const newItem = {
        ...MATERIAL_TABLE_ITEM_MOCK,
        quantity: 5,
        currency: 'EUR',
      };
      const result = TableService.updateItem(newItem, data, false);

      expect(result).toEqual([
        {
          ...newItem,
          currency: 'EUR',
          UoM: '1',
          priceUnit: 100,
        },
        data[1],
      ]);
    });
  });

  describe('updateStatusAndCurrencyOnCustomerOrSalesOrgChanged', () => {
    test('should set the validation status of each item', () => {
      const input: MaterialTableItem[] = [
        {
          id: 1,
          info: {
            description: [ValidationDescription.Duplicate],
            errorCodes: [SAP_ERROR_MESSAGE_CODE.SDG1000],
            valid: true,
          },
        },
        {
          id: 2,
          info: {
            description: [ValidationDescription.MaterialNumberInValid],
            valid: true,
          },
        },
      ];
      const expected: MaterialTableItem[] = [
        {
          id: 1,
          currency: undefined,
          info: {
            description: [ValidationDescription.Not_Validated],
            errorCodes: undefined,
            valid: false,
          },
        },
        {
          id: 2,
          currency: undefined,
          info: {
            description: [ValidationDescription.Not_Validated],
            errorCodes: undefined,
            valid: false,
          },
        },
      ];

      const result =
        TableService.updateStatusAndCurrencyOnCustomerOrSalesOrgChanged(input);
      expect(result).toStrictEqual(expected);
    });

    test('should set the currency to the material item', () => {
      const input: MaterialTableItem[] = [
        { id: 1 } as MaterialTableItem,
        { id: 2 } as MaterialTableItem,
      ];
      const expected: MaterialTableItem[] = [
        {
          id: 1,
          currency: 'EUR',
          info: {
            description: [ValidationDescription.Not_Validated],
            errorCodes: undefined,
            valid: false,
          },
        } as MaterialTableItem,
        {
          id: 2,
          currency: 'EUR',
          info: {
            description: [ValidationDescription.Not_Validated],
            errorCodes: undefined,
            valid: false,
          },
        } as MaterialTableItem,
      ];
      const result =
        TableService.updateStatusAndCurrencyOnCustomerOrSalesOrgChanged(
          input,
          'EUR'
        );
      expect(result).toStrictEqual(expected);
    });
  });
  describe('deleteItem', () => {
    test('should delete an Item', () => {
      const rowData: MaterialTableItem[] = [
        { id: 10, quantity: 100, materialNumber: '23457' },
        { id: 20, quantity: 10, materialNumber: '1234' },
        { id: 30, quantity: 120, materialNumber: '76543' },
      ];

      const result = TableService.deleteItem(30, rowData);
      expect(result).toEqual([
        { id: 10, quantity: 100, materialNumber: '23457' },
        { id: 20, quantity: 10, materialNumber: '1234' },
      ]);
    });

    test('should delete an Item and set empty array', () => {
      const rowData: MaterialTableItem[] = [
        { id: 10, quantity: 10, materialNumber: '1234' },
      ];

      const result = TableService.deleteItem(10, rowData);
      expect(result).toEqual([]);
    });
  });

  describe('validateData', () => {
    test('should return valid information', () => {
      const materialNumber = {
        quantity: 100,
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation = {
        materialNumber15: '23457',
        materialDescription: 'desc',
        valid: true,
      };
      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: { description: [ValidationDescription.Valid], valid: true },
        materialDescription: rowData.materialDescription,
        materialNumber: rowData.materialNumber15,
        quantity: 100,
      });
    });

    test('should return invalid information', () => {
      const materialNumber: MaterialTableItem = {
        quantity: 100,
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation = {
        materialNumber15: '23457',
        materialDescription: 'desc',
        valid: false,
      };
      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: {
          description: [ValidationDescription.MaterialNumberInValid],
          valid: false,
        },
        materialDescription: rowData.materialDescription,
        materialNumber: rowData.materialNumber15,
        quantity: 100,
      });
    });

    test('should not change the validation', () => {
      const materialNumber: MaterialTableItem = {
        quantity: 100,
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.MaterialNumberInValid],
          valid: false,
        },
      };
      const rowData: MaterialValidation = {
        materialNumber15: '23457',
        materialDescription: 'desc',
        valid: false,
      };

      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: {
          description: [ValidationDescription.MaterialNumberInValid],
          valid: false,
        },
        materialDescription: rowData.materialDescription,
        materialNumber: rowData.materialNumber15,
        quantity: 100,
      });
    });
    test('should return invalid information for invalid data', () => {
      const materialNumber: MaterialTableItem = {
        quantity: 100,
        materialNumber: '2345713',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation = undefined;

      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: {
          description: [ValidationDescription.MaterialNumberInValid],
          valid: false,
        },
        materialNumber: '2345713',
        quantity: 100,
      });
    });

    test('should return invalid information for negative quantity', () => {
      const materialNumber: MaterialTableItem = {
        quantity: -10,
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation = {
        materialNumber15: '23457',
        materialDescription: 'desc',
        valid: true,
      };

      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: {
          description: [ValidationDescription.QuantityInValid],
          valid: false,
        },
        materialDescription: rowData.materialDescription,
        materialNumber: rowData.materialNumber15,
        quantity: -10,
      });
    });

    test('should return quantity as number', () => {
      const materialNumber: MaterialTableItem = {
        quantity: 10,
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation = {
        materialNumber15: '23457',
        materialDescription: 'desc',
        valid: true,
      };

      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: { description: [ValidationDescription.Valid], valid: true },
        materialDescription: rowData.materialDescription,
        materialNumber: rowData.materialNumber15,
        quantity: 10,
      });
    });

    test('should return invalid quantity', () => {
      const materialNumber: MaterialTableItem = {
        quantity: undefined,
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation = {
        materialNumber15: '23457',
        materialDescription: 'desc',
        valid: true,
      };

      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: {
          description: [ValidationDescription.QuantityInValid],
          valid: false,
        },
        materialDescription: rowData.materialDescription,
        materialNumber: rowData.materialNumber15,
        quantity: undefined,
      });
    });

    test('should not set the errorCode if not present', () => {
      const materialNumber: MaterialTableItem = {};
      const rowData: MaterialValidation = {
        materialNumber15: '23457',
        materialDescription: 'desc',
        valid: true,
      } as unknown as MaterialValidation;

      const result = TableService.validateData(materialNumber, rowData);
      expect(result.info.errorCodes).toBeUndefined();
    });
    test('should set the errorCode if present', () => {
      const materialNumber: MaterialTableItem = {};
      const rowData: MaterialValidation = {
        materialNumber15: '23457',
        materialDescription: 'desc',
        valid: true,
        errorCodes: [SAP_ERROR_MESSAGE_CODE.SDG1000],
      } as unknown as MaterialValidation;

      const result = TableService.validateData(materialNumber, rowData);
      expect(result.info.errorCodes).toEqual([SAP_ERROR_MESSAGE_CODE.SDG1000]);
    });

    test('should set priceUnit and UoM if target price present', () => {
      const materialNumber: MaterialTableItem = { targetPrice: 1000 };
      const rowData: MaterialValidation = {
        materialNumber15: '23457',
        materialDescription: 'desc',
        valid: true,
        materialPriceUnit: 10,
        materialUnitOfMeasurement: 'PC',
      } as unknown as MaterialValidation;

      const result = TableService.validateData(materialNumber, rowData);
      expect(result.priceUnit).toEqual(rowData.materialPriceUnit);
      expect(result.UoM).toEqual(rowData.materialUoM);
    });
  });

  describe('removeDashes', () => {
    test('should remove dashes', () => {
      const matNumberDashes = '000000949-0030-42';
      const result = TableService.removeDashes(matNumberDashes);
      expect(result).toEqual('000000949003042');
    });
  });

  describe('removeDashesFromTableItems', () => {
    test('should return array without dashes', () => {
      const items: MaterialTableItem[] = [
        {
          info: {
            valid: true,
            description: [ValidationDescription.Valid],
          },
          materialNumber: '000000949-0030-42',
          quantity: 20,
        },
      ];
      const expectedResult: MaterialTableItem[] = [
        {
          ...items[0],
          materialNumber: '000000949003042',
        },
      ];
      TableService.removeDashes = jest.fn(
        () => expectedResult[0].materialNumber
      );

      const result = TableService.removeDashesFromTableItems(items);

      expect(result).toEqual(expectedResult);
      expect(TableService.removeDashes).toHaveBeenCalledTimes(1);
    });
  });

  describe('createMaterialQuantitiesFromTableItems', () => {
    test('should return MaterialQuantities', () => {
      const rowData: MaterialTableItem[] = [
        {
          materialNumber: '123',
          quantity: 10,
          info: {
            description: [ValidationDescription.Valid],
            valid: true,
          },
        },
      ];
      const itemId = 0;
      const result = TableService.createMaterialQuantitiesFromTableItems(
        rowData,
        itemId
      );

      const expected: MaterialQuantities[] = [
        { materialId: '123', quantity: 10, quotationItemId: 10 },
      ];
      expect(result).toEqual(expected);
    });

    test('should return material quantities with targetPrice, priceUnit given', () => {
      const rowData: MaterialTableItem[] = [
        {
          materialNumber: '123',
          quantity: 10,
          targetPrice: 100,
          priceUnit: 10,
          info: {
            description: [ValidationDescription.Valid],
            valid: true,
          },
        },
      ];
      const itemId = 0;
      const result = TableService.createMaterialQuantitiesFromTableItems(
        rowData,
        itemId
      );

      const expected: MaterialQuantities[] = [
        {
          materialId: '123',
          quantity: 10,
          quotationItemId: 10,
          targetPrice: 10,
        },
      ];
      expect(result).toEqual(expected);
      expect(true).toBeTruthy();
    });
    test('should return material quantities with targetPrice, priceUnit not given use 1', () => {
      const rowData: MaterialTableItem[] = [
        {
          materialNumber: '123',
          quantity: 10,
          targetPrice: 100,
          info: {
            description: [ValidationDescription.Valid],
            valid: true,
          },
        },
      ];
      const itemId = 0;
      const result = TableService.createMaterialQuantitiesFromTableItems(
        rowData,
        itemId
      );

      const expected: MaterialQuantities[] = [
        {
          materialId: '123',
          quantity: 10,
          quotationItemId: 10,
          targetPrice: 100,
        },
      ];
      expect(result).toEqual(expected);
      expect(true).toBeTruthy();
    });
  });

  describe('addCurrencyToMaterialItems', () => {
    test('should add currency', () => {
      const input: MaterialTableItem[] = [
        { targetPrice: 100 } as MaterialTableItem,
      ];
      const expected: MaterialTableItem[] = [
        { targetPrice: 100, currency: 'EUR' },
      ];
      const result = TableService.addCurrencyToMaterialItems(input, 'EUR');
      expect(result).toStrictEqual(expected);
    });
    test('should NOT add currency', () => {
      const input: MaterialTableItem[] = [{} as MaterialTableItem];
      const expected: MaterialTableItem[] = [{}];
      const result = TableService.addCurrencyToMaterialItems(input, 'EUR');
      expect(result).toStrictEqual(expected);
    });
  });

  describe('addCurrencyToMaterialItem', () => {
    test('should add currency', () => {
      const input: MaterialTableItem = {
        targetPrice: 100,
      } as MaterialTableItem;
      const expected: MaterialTableItem = { targetPrice: 100, currency: 'EUR' };
      const result = TableService.addCurrencyToMaterialItem(input, 'EUR');
      expect(result).toStrictEqual(expected);
    });
    test('should NOT add currency', () => {
      const input: MaterialTableItem = {} as MaterialTableItem;
      const expected: MaterialTableItem = {};
      const result = TableService.addCurrencyToMaterialItem(input, 'EUR');
      expect(result).toStrictEqual(expected);
    });
  });
});
