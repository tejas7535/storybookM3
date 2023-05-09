import {
  clearProcessCaseRowData,
  deleteMaterialRowDataItem,
  processCaseActions,
  validateAddMaterialsOnCustomerAndSalesOrg,
  validateAddMaterialsOnCustomerAndSalesOrgFailure,
  validateAddMaterialsOnCustomerAndSalesOrgSuccess,
} from './process-case.action';

describe('processCaseActions', () => {
  let action: processCaseActions;
  let errorMessage: string;

  beforeEach(() => {
    action = undefined;
    errorMessage = 'An error occured';
  });

  describe('Quotation Details Actions', () => {
    test('clearRowData', () => {
      action = clearProcessCaseRowData();

      expect(action).toEqual({
        type: '[Process Case] Clear RowData',
      });
    });
  });

  describe('Row Data Actions', () => {
    test('deleteMaterialRowDataItem', () => {
      const id = 10;

      action = deleteMaterialRowDataItem({ id });

      expect(action).toEqual({
        id,
        type: '[Process Case] Delete Item from Material Table',
      });
    });
  });

  describe('validate Materials', () => {
    test('should validateAddMaterialsOnCustomerAndSalesOrg', () => {
      action = validateAddMaterialsOnCustomerAndSalesOrg();

      expect(action).toEqual({
        type: '[Process Case] Get Validation for RowData Materials on Customer and SalesOrg',
      });
    });

    test('should validateAddMaterialsOnCustomerAndSalesOrgSuccess', () => {
      const materialValidations: any[] = [];
      action = validateAddMaterialsOnCustomerAndSalesOrgSuccess({
        materialValidations,
      });

      expect(action).toEqual({
        materialValidations,
        type: '[Process Case] Get Validation for RowData Materials on Customer and SalesOrg: Validation Success',
      });
    });

    test('should validateAddMaterialsOnCustomerAndSalesOrgFailure', () => {
      action = validateAddMaterialsOnCustomerAndSalesOrgFailure({
        errorMessage,
      });

      expect(action).toEqual({
        errorMessage,
        type: '[Process Case] Get Validation for RowData Materials on Customer and SalesOrg: Validation Failure',
      });
    });
  });
});
