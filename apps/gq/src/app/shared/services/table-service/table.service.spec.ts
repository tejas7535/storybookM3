import { MATERIAL_TABLE_ITEM_MOCK } from '../../../../testing/mocks';
import {
  MaterialQuantities,
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '../../models/table';
import { TableService } from './table.service';

describe('TableService', () => {
  describe('pasteItems', () => {
    test('should add remove duplicated items', () => {
      const items: MaterialTableItem[] = [
        { quantity: 100, materialNumber: '23457' },
        { quantity: 10, materialNumber: '1234' },
        { quantity: 120, materialNumber: '76543' },
      ];
      const currentRowData: MaterialTableItem[] = [
        { quantity: 100, materialNumber: '23457' },
        { quantity: 10, materialNumber: '1234' },
        { quantity: 120, materialNumber: '76543' },
        { quantity: 120, materialNumber: '76543' },
      ];

      const result = TableService.pasteItems(items, currentRowData);

      expect(result).toEqual([
        { id: 0, quantity: 100, materialNumber: '23457' },
        { id: 1, quantity: 10, materialNumber: '1234' },
        { id: 2, quantity: 120, materialNumber: '76543' },
      ]);
    });

    test('should do nothing', () => {
      const items: MaterialTableItem[] = [
        { quantity: 100, materialNumber: '1234' },
      ];
      const currentRowData: MaterialTableItem[] = [
        { quantity: 100, materialNumber: '1234' },
      ];

      const result = TableService.pasteItems(items, currentRowData);

      expect(result).toEqual([
        { id: 0, quantity: 100, materialNumber: '1234' },
      ]);
    });
  });

  describe('updateItem', () => {
    test('should update matching item in data array', () => {
      const data: MaterialTableItem[] = [
        MATERIAL_TABLE_ITEM_MOCK,
        { ...MATERIAL_TABLE_ITEM_MOCK, id: 2 },
      ];
      const newItem = { id: 1, materialDescription: 'new' };
      const result = TableService.updateItem(newItem, data);

      expect(result).toEqual([newItem, data[1]]);
    });
  });

  describe('deleteItem', () => {
    test('should delete an Item', () => {
      const materialNumber = '1234';
      const quantity = 10;
      const rowData: MaterialTableItem[] = [
        { quantity: 100, materialNumber: '23457' },
        { quantity: 10, materialNumber: '1234' },
        { quantity: 120, materialNumber: '76543' },
      ];

      const result = TableService.deleteItem(materialNumber, quantity, rowData);
      expect(result).toEqual([
        { quantity: 100, materialNumber: '23457' },
        { quantity: 120, materialNumber: '76543' },
      ]);
    });

    test('should delete an Item and set empty array', () => {
      const materialNumber = '1234';
      const quantity = 10;
      const rowData: MaterialTableItem[] = [
        { quantity: 10, materialNumber: '1234' },
      ];

      const result = TableService.deleteItem(materialNumber, quantity, rowData);
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
  });
});
