import {
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '../../../core/store/models';
import { dummyRowData } from '../../../core/store/reducers/create-case/config/dummy-row-data';
import { TableService } from './table.service';

describe('TableService', () => {
  describe('pasteItems', () => {
    test('should add remove duplicated items', () => {
      const items: MaterialTableItem[] = [
        { quantity: '100', materialNumber: '23457' },
        { quantity: '10', materialNumber: '1234' },
        { quantity: '120', materialNumber: '76543' },
      ];
      const pasteDestination: MaterialTableItem = {
        quantity: '10',
        materialNumber: '1234',
      };
      const currentRowData: MaterialTableItem[] = [
        { quantity: '100', materialNumber: '23457' },
        { quantity: '10', materialNumber: '1234' },
        { quantity: '120', materialNumber: '76543' },
        { quantity: '120', materialNumber: '76543' },
      ];

      const result = TableService.pasteItems(
        items,
        pasteDestination,
        currentRowData
      );

      expect(result).toEqual([
        { quantity: '100', materialNumber: '23457' },
        { quantity: '10', materialNumber: '1234' },
        { quantity: '120', materialNumber: '76543' },
      ]);
    });

    test('should do nothing ', () => {
      const items: MaterialTableItem[] = [
        { quantity: '10', materialNumber: '1234' },
      ];
      const pasteDestination: MaterialTableItem = {
        quantity: '10',
        materialNumber: '1234',
      };
      const currentRowData: MaterialTableItem[] = [
        { quantity: '100', materialNumber: '1234' },
      ];

      const result = TableService.pasteItems(
        items,
        pasteDestination,
        currentRowData
      );

      expect(result).toEqual([{ quantity: '100', materialNumber: '1234' }]);
    });
  });

  describe('deleteItem', () => {
    describe('should delete an Item', () => {
      const materialNumber = '1234';
      const rowData: MaterialTableItem[] = [
        { quantity: '100', materialNumber: '23457' },
        { quantity: '10', materialNumber: '1234' },
        { quantity: '120', materialNumber: '76543' },
      ];

      const result = TableService.deleteItem(materialNumber, rowData);
      expect(result).toEqual([
        { quantity: '100', materialNumber: '23457' },
        { quantity: '120', materialNumber: '76543' },
      ]);
    });

    describe('should delete an Item and return the dummyRowData', () => {
      const materialNumber = '1234';
      const rowData: MaterialTableItem[] = [
        { quantity: '10', materialNumber: '1234' },
      ];

      const result = TableService.deleteItem(materialNumber, rowData);
      expect(result).toEqual([dummyRowData]);
    });
  });

  describe('validateData', () => {
    describe('should return valid information', () => {
      const materialNumber = {
        quantity: 100,
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation[] = [
        { materialNumber15: '23457', valid: true },
      ];

      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: { description: [ValidationDescription.Valid], valid: true },
        materialNumber: '23457',
        quantity: 100,
      });
    });

    describe('should return invalid information', () => {
      const materialNumber: MaterialTableItem = {
        quantity: 100,
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation[] = [
        { materialNumber15: '23457', valid: false },
      ];

      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: {
          description: [ValidationDescription.MaterialNumberInValid],
          valid: false,
        },
        materialNumber: '23457',
        quantity: 100,
      });
    });

    describe('should not change the validation', () => {
      const materialNumber: MaterialTableItem = {
        quantity: 100,
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.MaterialNumberInValid],
          valid: false,
        },
      };
      const rowData: MaterialValidation[] = [
        { materialNumber15: '23457', valid: false },
      ];

      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: {
          description: [ValidationDescription.MaterialNumberInValid],
          valid: false,
        },
        materialNumber: '23457',
        quantity: 100,
      });
    });
    describe('should return invalid information', () => {
      const materialNumber: MaterialTableItem = {
        quantity: '100',
        materialNumber: '2345713',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation[] = [
        { materialNumber15: '23457', valid: true },
      ];

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

    describe('should return invalid information', () => {
      const materialNumber: MaterialTableItem = {
        quantity: '',
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation[] = [
        { materialNumber15: '23457', valid: true },
      ];

      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: {
          description: [ValidationDescription.QuantityInValid],
          valid: false,
        },
        materialNumber: '23457',
        quantity: '',
      });
    });

    describe('should return quantity as number', () => {
      const materialNumber: MaterialTableItem = {
        quantity: 10,
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation[] = [
        { materialNumber15: '23457', valid: true },
      ];

      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: { description: [ValidationDescription.Valid], valid: true },
        materialNumber: '23457',
        quantity: 10,
      });
    });

    describe('should return invalid quantity', () => {
      const materialNumber: MaterialTableItem = {
        quantity: undefined,
        materialNumber: '23457',
        info: {
          description: [ValidationDescription.Not_Validated],
          valid: false,
        },
      };
      const rowData: MaterialValidation[] = [
        { materialNumber15: '23457', valid: true },
      ];

      const result = TableService.validateData(materialNumber, rowData);
      expect(result).toEqual({
        info: {
          description: [ValidationDescription.QuantityInValid],
          valid: false,
        },
        materialNumber: '23457',
        quantity: undefined,
      });
    });
  });
});
