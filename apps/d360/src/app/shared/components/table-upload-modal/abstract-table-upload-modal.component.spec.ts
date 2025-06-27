import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import {
  GridApi,
  GridReadyEvent,
  GridSizeChangedEvent,
  IRowNode,
  PostSortRowsParams,
  ProcessDataFromClipboardParams,
} from 'ag-grid-enterprise';

import { ErrorMessage } from '../../../pages/alert-rules/table/components/modals/alert-rule-logic-helper';
import { MessageType } from '../../models/message-type.enum';
import { Stub } from '../../test/stub.class';
import {
  PostResult,
  ResponseWithResultMessage,
} from '../../utils/error-handling';
import { AbstractTableUploadModalComponent } from './abstract-table-upload-modal.component';
import { ColumnForUploadTable } from './models';

// Mock implementation of the abstract class for testing
@Component({
  template: '',
})
class TestTableUploadModalComponent extends AbstractTableUploadModalComponent<
  TestDataType,
  ResponseWithResultMessage
> {
  protected title = 'Test Title';
  protected modalMode = 'save' as const;
  protected maxRows = 200;
  protected columnDefinitions: ColumnForUploadTable<TestDataType>[] = [
    {
      field: 'id' as keyof TestDataType,
      headerName: 'ID',
      validationFn: (value: any) => (value === 'invalid' ? 'Invalid ID' : null),
    },
    {
      field: 'name' as keyof TestDataType,
      headerName: 'Name',
    },
  ] as any;

  protected specialParseFunctionsForFields = new Map<
    keyof TestDataType,
    (value: string) => string
  >([
    ['id', (value: string) => value.trim()],
    ['name', (value: string) => value.toUpperCase()],
  ]);

  protected async applyFunction(
    _data: TestDataType[],
    dryRun: boolean
  ): Promise<PostResult<ResponseWithResultMessage>> {
    return {
      overallStatus: 'SUCCESS',
      response: [
        {
          result: {
            messageType: dryRun ? MessageType.Warning : MessageType.Success,
            message: 'Test message',
          },
        },
      ],
    } as any;
  }

  protected parseErrorsFromResult(
    result: PostResult<ResponseWithResultMessage>
  ): ErrorMessage<TestDataType>[] {
    return result.response
      .filter((res) => res.result?.messageType === MessageType.Error)
      .map((res) => ({
        dataIdentifier: { id: 'test-id' } as TestDataType,
        errorMessage: (res.result as any).message,
      }));
  }

  protected checkDataForErrors(
    data: TestDataType[]
  ): ErrorMessage<TestDataType>[] {
    return data
      .filter((d) => d.id === 'error')
      .map((d) => ({
        dataIdentifier: d,
        errorMessage: 'Data error',
      }));
  }
}

// Test data types
interface TestDataType {
  id: string;
  name: string;
}

describe('AbstractTableUploadModalComponent', () => {
  let component: TestTableUploadModalComponent;
  let gridApi: GridApi;
  let dialogRef: MatDialogRef<AbstractTableUploadModalComponent<any, any>>;

  beforeEach(() => {
    component = Stub.get<TestTableUploadModalComponent>({
      component: TestTableUploadModalComponent,
    });
    dialogRef = component['dialogRef'];
    gridApi = Stub.getGridApi();
    component['gridApi'].set(gridApi);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call updateColumnDefinitions', () => {
      const spy = jest.spyOn(component as any, 'updateColumnDefinitions');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('updateColumnDefinitions', () => {
    it('should update column definitions with validation functions', () => {
      const setGridOptionSpy = jest.spyOn(gridApi, 'setGridOption');
      component['updateColumnDefinitions']();
      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'columnDefs',
        expect.any(Array)
      );
      expect(setGridOptionSpy.mock.calls[0][1].length).toBe(3); // 2 columns + delete button
    });

    it('should not update column definitions when gridApi is null', () => {
      component['gridApi'].set(null);
      const spy = jest.spyOn(component as any, 'validateFunctionWithErrors');
      component['updateColumnDefinitions']();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should apply background color function when provided', () => {
      const bgColorFn = jest.fn().mockReturnValue('red');
      component['columnDefinitions'] = [
        {
          field: 'id' as keyof TestDataType,
          headerName: 'ID',
          bgColorFn,
        },
      ] as any;

      const setGridOptionSpy = jest.spyOn(gridApi, 'setGridOption');
      component['updateColumnDefinitions']();

      expect(setGridOptionSpy).toHaveBeenCalled();
      expect(bgColorFn).toHaveBeenCalled();
    });
  });

  describe('onGridReady', () => {
    it('should set gridApi and configure the grid', () => {
      const event = {
        api: gridApi,
      } as GridReadyEvent;

      const apiSignalSpy = jest.spyOn(component['gridApi'], 'set');
      const updateColumnsSpy = jest.spyOn(
        component as any,
        'updateColumnDefinitions'
      );
      const applyTransactionSpy = jest.spyOn(gridApi, 'applyTransaction');
      const sizeColumnsSpy = jest.spyOn(gridApi, 'sizeColumnsToFit');
      const setGridOptionSpy = jest.spyOn(gridApi, 'setGridOption');

      component['onGridReady'](event);

      expect(apiSignalSpy).toHaveBeenCalledWith(gridApi);
      expect(updateColumnsSpy).toHaveBeenCalled();
      expect(applyTransactionSpy).toHaveBeenCalledWith({ add: [{}] });
      expect(sizeColumnsSpy).toHaveBeenCalled();
      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'postSortRows',
        expect.any(Function)
      );
    });

    it('should sort empty rows to the bottom', () => {
      jest
        .spyOn(component as any, 'updateColumnDefinitions')
        .mockImplementation(() => {});

      const event = {
        api: gridApi,
      } as GridReadyEvent;

      component['onGridReady'](event);

      // Get the sort function from the mock call
      const sortFn = jest.spyOn(gridApi, 'setGridOption').mock.calls[0][1] as (
        params: PostSortRowsParams
      ) => void;

      const emptyNode = { data: {} } as IRowNode;
      const nonEmptyNode = { data: { id: '1' } } as IRowNode;

      const params = {
        nodes: [emptyNode, nonEmptyNode],
      } as PostSortRowsParams;

      sortFn(params);

      // After sorting, empty node should be last
      expect(params.nodes[0]).toBe(nonEmptyNode);
      expect(params.nodes[1]).toBe(emptyNode);
    });

    it('should properly handle sorting when both nodes have data', () => {
      jest
        .spyOn(component as any, 'updateColumnDefinitions')
        .mockImplementation(() => {});

      const event = {
        api: gridApi,
      } as GridReadyEvent;

      component['onGridReady'](event);

      const sortFn = jest.spyOn(gridApi, 'setGridOption').mock.calls[0][1] as (
        params: PostSortRowsParams
      ) => void;

      const node1 = { data: { id: '1' } } as IRowNode;
      const node2 = { data: { id: '2' } } as IRowNode;

      const params = {
        nodes: [node1, node2],
      } as PostSortRowsParams;

      sortFn(params);

      // No sorting should happen when both have data
      expect(params.nodes[0]).toBe(node1);
      expect(params.nodes[1]).toBe(node2);
    });
  });

  describe('onGridSizeChanged', () => {
    it('should fit columns to size', () => {
      const event = {
        api: gridApi,
      } as GridSizeChangedEvent;

      const sizeColumnsSpy = jest.spyOn(gridApi, 'sizeColumnsToFit');
      component['onGridSizeChanged'](event);
      expect(sizeColumnsSpy).toHaveBeenCalled();
    });
  });

  describe('onClipboard', () => {
    it('should process clipboard data', () => {
      const params = {
        data: 'test-id\ttest-name',
      } as any;

      const result = component['onClipboard'](params);
      expect(result).toBeNull();
    });

    it('should handle complex clipboard data with multiple rows', () => {
      const params: ProcessDataFromClipboardParams<TestDataType> = {
        data: 'id1\tname1\nid2\tname2',
      } as any;

      const result = component['onClipboard'](params);
      expect(result).toBeNull();
    });

    it('should handle empty clipboard data', () => {
      const params: ProcessDataFromClipboardParams<TestDataType> = {
        data: '',
      } as any;

      const result = component['onClipboard'](params);
      expect(result).toBeNull();
    });
  });

  describe('addEmptyRow', () => {
    it('should add empty row and update column definitions', () => {
      const updateColumnsSpy = jest.spyOn(
        component as any,
        'updateColumnDefinitions'
      );
      component['addEmptyRow']();
      expect(updateColumnsSpy).toHaveBeenCalled();
    });

    it('should not try to add empty row when gridApi is null', () => {
      component['gridApi'].set(null);
      const updateColumnsSpy = jest.spyOn(
        component as any,
        'updateColumnDefinitions'
      );

      component['addEmptyRow']();

      expect(updateColumnsSpy).toHaveBeenCalled();
    });
  });

  describe('onReset', () => {
    it('should clear errors and reset grid', () => {
      const backendErrorsSpy = jest.spyOn(component['backendErrors'], 'set');
      const frontendErrorsSpy = jest.spyOn(component['frontendErrors'], 'set');

      component['onReset']();

      expect(backendErrorsSpy).toHaveBeenCalledWith([]);
      expect(frontendErrorsSpy).toHaveBeenCalledWith([]);
    });
  });

  describe('onClose', () => {
    it('should close the dialog with hasChangedData', () => {
      const closeSpy = jest.spyOn(dialogRef, 'close');
      component['hasChangedData'] = true;
      component['onClose']();
      expect(closeSpy).toHaveBeenCalledWith(true);
    });

    it('should close the dialog with false when hasChangedData is false', () => {
      const closeSpy = jest.spyOn(dialogRef, 'close');
      component['hasChangedData'] = false;
      component['onClose']();
      expect(closeSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('onAdded', () => {
    it('should call onClose', () => {
      const closeSpy = jest.spyOn(component as any, 'onClose');
      component['onAdded']();
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('setHasChangedData', () => {
    it('should set hasChangedData to true when response has success', () => {
      const postResult: PostResult<ResponseWithResultMessage> = {
        overallStatus: 'SUCCESS',
        response: [
          {
            result: {
              messageType: MessageType.Success,
              message: 'Success',
            },
          },
        ],
      } as any;

      component['hasChangedData'] = false;
      component['setHasChangedData'](postResult);
      expect(component['hasChangedData']).toBe(true);
    });

    it('should not change hasChangedData when response has no success', () => {
      const postResult: PostResult<ResponseWithResultMessage> = {
        overallStatus: 'ERROR',
        response: [
          {
            result: {
              messageType: MessageType.Error,
              message: 'Error',
            },
          },
        ],
      } as any;

      component['hasChangedData'] = false;
      component['setHasChangedData'](postResult);
      expect(component['hasChangedData']).toBe(false);
    });

    it('should preserve hasChangedData when already true', () => {
      const postResult: PostResult<ResponseWithResultMessage> = {
        overallStatus: 'ERROR',
        response: [
          {
            result: {
              messageType: MessageType.Error,
              message: 'Error',
            },
          },
        ],
      } as any;

      component['hasChangedData'] = true;
      component['setHasChangedData'](postResult);
      expect(component['hasChangedData']).toBe(true);
    });

    it('should handle empty response array', () => {
      const postResult: PostResult<ResponseWithResultMessage> = {
        overallStatus: 'SUCCESS',
        response: [],
      } as any;

      component['hasChangedData'] = false;
      component['setHasChangedData'](postResult);
      expect(component['hasChangedData']).toBe(false);
    });

    it('should handle response with missing result property', () => {
      const postResult: PostResult<ResponseWithResultMessage> = {
        overallStatus: 'SUCCESS',
        response: [{}] as any,
      } as any;

      component['hasChangedData'] = false;
      component['setHasChangedData'](postResult);
      expect(component['hasChangedData']).toBe(false);
    });
  });

  describe('validateFunctionWithErrors', () => {
    it('should validate data and return error messages', () => {
      component['backendErrors'].set([
        {
          dataIdentifier: { id: 'test-id' } as TestDataType,
          errorMessage: 'Backend error',
          specificField: 'id',
        },
      ]);

      const validateFn = (component as any).validateFunctionWithErrors();
      const error = validateFn(
        'value',
        { data: { id: 'test-id' } } as IRowNode,
        'id'
      );
      expect(error).toBe('Backend error');
    });

    it('should use custom validation function if provided', () => {
      const customValidationFn = jest.fn().mockReturnValue('Custom error');

      const validateFn = (component as any).validateFunctionWithErrors(
        customValidationFn
      );
      const error = validateFn('value', { data: {} } as IRowNode);

      expect(customValidationFn).toHaveBeenCalledWith(
        'value',
        expect.any(Object),
        gridApi
      );
      expect(error).toBe('Custom error');
    });

    it('should return undefined when no errors', () => {
      component['backendErrors'].set([]);
      component['frontendErrors'].set([]);

      const validateFn = (component as any).validateFunctionWithErrors();
      const error = validateFn('value', { data: {} } as IRowNode);

      expect(error).toBeUndefined();
    });

    it('should not call validation function if value is empty', () => {
      const customValidationFn = jest.fn();

      const validateFn = (component as any).validateFunctionWithErrors(
        customValidationFn
      );
      validateFn('', { data: {} } as IRowNode);

      expect(customValidationFn).not.toHaveBeenCalled();
    });

    it('should find errors by id when partial matching fails', () => {
      component['backendErrors'].set([
        {
          id: '123',
          dataIdentifier: { id: '456' } as TestDataType, // Doesn't match directly
          errorMessage: 'Backend error with ID',
          specificField: 'id',
        },
      ]);

      const rowNode = {
        data: {
          id: '123', // Matches error ID
        },
        id: '789', // Doesn't match dataIdentifier
      } as IRowNode;

      const validateFn = (component as any).validateFunctionWithErrors();
      const error = validateFn('value', rowNode, 'id');

      expect(error).toBe('Backend error with ID');
    });

    it('should return the first row error when no field specific error is found', () => {
      component['backendErrors'].set([
        {
          dataIdentifier: { id: 'test-id' } as TestDataType,
          errorMessage: 'General row error',
        },
      ]);

      const validateFn = (component as any).validateFunctionWithErrors();
      const error = validateFn(
        'value',
        { data: { id: 'test-id' } } as IRowNode,
        'name' // Different field than the error is for
      );

      expect(error).toBe('General row error');
    });
  });

  describe('isPartialDataMatching', () => {
    it('should match matching data identifiers', () => {
      const result = (component as any).isPartialDataMatching(
        { id: '123' },
        { id: '123', name: 'Test' }
      );
      expect(result).toBe(true);
    });

    it('should not match non-matching data identifiers', () => {
      const result = (component as any).isPartialDataMatching(
        { id: '123' },
        { id: '456', name: 'Test' }
      );
      expect(result).toBe(false);
    });

    it('should skip empty string values in identifier', () => {
      const result = (component as any).isPartialDataMatching(
        { id: '', name: 'Test' },
        { id: '123', name: 'Test' }
      );
      expect(result).toBe(true);
    });

    it('should handle hyphens in string values', () => {
      const result = (component as any).isPartialDataMatching(
        { id: '123-456' },
        { id: '123456', name: 'Test' }
      );
      expect(result).toBe(true);
    });

    it('should handle undefined or missing fields in target data', () => {
      const result = (component as any).isPartialDataMatching(
        { id: '123', name: 'Test' },
        { id: '123' } // name is missing
      );
      expect(result).toBe(false);
    });

    it('should handle null values in data', () => {
      const result = (component as any).isPartialDataMatching(
        { id: '123', name: null },
        { id: '123', name: null }
      );
      expect(result).toBe(true);
    });

    it('should properly compare numeric values', () => {
      const result = (component as any).isPartialDataMatching(
        { id: 123 },
        { id: 123 }
      );
      expect(result).toBe(true);
    });
  });

  describe('getTypedRowData', () => {
    it('should return data from row node', () => {
      const rowNode = { data: { id: '123', name: 'Test' } } as IRowNode;
      const result = component['getTypedRowData'](rowNode);
      expect(result).toEqual({ id: '123', name: 'Test' });
    });

    it('should handle row node with undefined data', () => {
      const rowNode = { data: undefined } as IRowNode;
      const result = component['getTypedRowData'](rowNode);
      expect(result).toBeUndefined();
    });
  });

  describe('dataFromRowModel', () => {
    it('should collect non-empty rows from grid', () => {
      const nodes: IRowNode[] = [
        { data: { id: '1', name: 'One' } } as IRowNode,
        { data: {} } as IRowNode, // Empty, should be skipped
        { data: { id: '2', name: 'Two' } } as IRowNode,
      ];

      gridApi.forEachNode = jest.fn((callback) => {
        nodes.forEach((element) => {
          callback(element, undefined as any);
        });
      });

      const result = (component as any).dataFromRowModel();
      expect(result).toEqual([
        { id: '1', name: 'One' },
        { id: '2', name: 'Two' },
      ]);
    });

    it('should return empty array when all rows are empty', () => {
      const nodes: IRowNode[] = [
        { data: {} } as IRowNode,
        { data: {} } as IRowNode,
      ];

      gridApi.forEachNode = jest.fn((callback) => {
        nodes.forEach((element) => {
          callback(element, undefined as any);
        });
      });

      const result = (component as any).dataFromRowModel();
      expect(result).toEqual([]);
    });
  });

  describe('checkForNoRows', () => {
    it('should return true and show a message when no data', () => {
      const snackbarSpy = jest.spyOn(component['snackbarService'], 'warning');

      const result = (component as any).checkForNoRows([]);

      expect(result).toBe(true);
      expect(snackbarSpy).toHaveBeenCalledWith(
        'generic.validation.upload.no_entries'
      );
    });

    it('should return false when data exists', () => {
      const snackbarSpy = jest.spyOn(component['snackbarService'], 'warning');

      const result = (component as any).checkForNoRows([
        { id: '1', name: 'Test' },
      ]);

      expect(result).toBe(false);
      expect(snackbarSpy).not.toHaveBeenCalled();
    });
  });

  describe('checkForTooManyRows', () => {
    it('should return true and show a message when too many rows', () => {
      const snackbarSpy = jest.spyOn(component['snackbarService'], 'warning');

      // Component's maxRows is 200, so 202 rows (201 + empty row) is too many
      jest.spyOn(gridApi, 'getDisplayedRowCount').mockReturnValue(202);

      const result = (component as any).checkForTooManyRows();

      expect(result).toBe(true);
      expect(snackbarSpy).toHaveBeenCalled();
    });

    it('should return false when row count is acceptable', () => {
      const snackbarSpy = jest.spyOn(component['snackbarService'], 'warning');

      jest.spyOn(gridApi, 'getDisplayedRowCount').mockReturnValue(200);

      const result = (component as any).checkForTooManyRows();

      expect(result).toBe(false);
      expect(snackbarSpy).not.toHaveBeenCalled();
    });
  });

  describe('getValidationErrors', () => {
    it('should collect validation errors from columns', () => {
      const testColumnDefs: ColumnForUploadTable<TestDataType>[] = [
        {
          field: 'id' as keyof TestDataType,
          headerName: 'ID',
          validationFn: jest.fn().mockReturnValue('Error message'),
        },
      ] as any;

      const nodes: IRowNode[] = [
        { data: { id: 'test', name: 'Test' } } as IRowNode,
      ];

      gridApi.forEachNode = jest.fn((callback) => {
        nodes.forEach((element) => {
          callback(element, undefined as any);
        });
      });

      const result = (component as any).getValidationErrors(testColumnDefs);

      expect(result.length).toBe(1);
      expect(result[0].errorMessage).toBe('Error message');
    });

    it('should not collect errors for empty fields', () => {
      const testColumnDefs: ColumnForUploadTable<TestDataType>[] = [
        {
          field: 'id' as keyof TestDataType,
          headerName: 'ID',
          validationFn: jest.fn().mockReturnValue('Error message'),
        },
      ] as any;

      const nodes: IRowNode[] = [
        { data: { name: 'Test' } } as IRowNode, // No id field
      ];

      gridApi.forEachNode = jest.fn((callback) => {
        nodes.forEach((element) => {
          callback(element, undefined as any);
        });
      });

      const result = (component as any).getValidationErrors(testColumnDefs);
      expect(result.length).toBe(0);
    });

    it('should include row id in error message when available', () => {
      const testColumnDefs: ColumnForUploadTable<TestDataType>[] = [
        {
          field: 'id' as keyof TestDataType,
          headerName: 'ID',
          validationFn: jest.fn().mockReturnValue('Error message'),
        },
      ] as any;

      const nodes: IRowNode[] = [
        { id: 'row-1', data: { id: 'test', name: 'Test' } } as IRowNode,
      ];

      gridApi.forEachNode = jest.fn((callback) => {
        nodes.forEach((element) => {
          callback(element, undefined as any);
        });
      });

      const result = (component as any).getValidationErrors(testColumnDefs);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('row-1');
    });
  });

  describe('countErrorRows', () => {
    it('should count unique rows with errors', () => {
      const errors: ErrorMessage<TestDataType>[] = [
        {
          dataIdentifier: { id: '1', name: 'Test1' } as TestDataType,
          errorMessage: 'Error 1',
          specificField: 'id',
        },
        {
          dataIdentifier: { id: '1', name: 'Test1' } as TestDataType,
          errorMessage: 'Error 2',
          specificField: 'name',
        },
        {
          dataIdentifier: { id: '2', name: 'Test2' } as TestDataType,
          errorMessage: 'Error 3',
        },
      ];

      const result = (component as any).countErrorRows(errors);
      expect(result).toBe(2); // 2 unique rows with errors
    });

    it('should return 0 for empty error array', () => {
      const result = (component as any).countErrorRows([]);
      expect(result).toBe(0);
    });

    it('should count rows with partial matching correctly', () => {
      const errors: ErrorMessage<TestDataType>[] = [
        {
          dataIdentifier: { id: '1' } as TestDataType,
          errorMessage: 'Error 1',
        },
        {
          dataIdentifier: { name: 'Test1' } as TestDataType, // Different identifier property
          errorMessage: 'Error 2',
        },
        {
          dataIdentifier: { id: '1', name: 'Different' } as TestDataType, // Same id, should be counted as same row
          errorMessage: 'Error 3',
        },
      ];

      const result = (component as any).countErrorRows(errors);
      expect(result).toBe(2); // First and third error are for the same row with id=1
    });
  });

  describe('getErrorMessageFn', () => {
    it('should return a function that translates error messages', () => {
      const messageFn = component['getErrorMessageFn']('save');
      expect(messageFn(5)).toBe('generic.validation.upload.save.error');
    });
  });

  describe('getSuccessMessageFn', () => {
    it('should return a function that translates success messages', () => {
      const messageFn = component['getSuccessMessageFn']('check');
      expect(messageFn(3)).toBe('generic.validation.upload.check.success');
    });

    it('should work with save action', () => {
      const messageFn = component['getSuccessMessageFn']('save');
      expect(messageFn(10)).toBe('generic.validation.upload.save.success');
    });
  });

  describe('getMultiPostResultsToUserMessages', () => {
    it('should convert post results to user messages', () => {
      const postResult: PostResult<ResponseWithResultMessage> = {
        overallStatus: 'SUCCESS',
        response: [
          {
            result: {
              messageType: MessageType.Success,
              message: 'Success message',
            },
          },
        ],
      } as any;

      jest
        .spyOn(component as any, 'getSuccessMessageFn')
        .mockReturnValue(() => 'Success');
      jest
        .spyOn(component as any, 'getErrorMessageFn')
        .mockReturnValue(() => 'Error');

      const result = component['getMultiPostResultsToUserMessages']({
        postResult,
        action: 'save',
        errorRowCount: 0,
      });

      expect(result).toHaveProperty('length');
    });

    it('should include errorRowCount in messages when provided', () => {
      const postResult: PostResult<ResponseWithResultMessage> = {
        overallStatus: 'SUCCESS',
        response: [
          {
            result: {
              messageType: MessageType.Success,
              message: 'Success message',
            },
          },
        ],
      } as any;

      const errorMessageFn = jest.fn().mockReturnValue('Error message');
      jest
        .spyOn(component as any, 'getErrorMessageFn')
        .mockReturnValue(errorMessageFn);
      jest
        .spyOn(component as any, 'getSuccessMessageFn')
        .mockReturnValue(() => 'Success');

      component['getMultiPostResultsToUserMessages']({
        postResult,
        action: 'save',
        errorRowCount: 3,
      });

      expect(errorMessageFn).toHaveBeenCalledWith(3);
    });

    it('should handle postResult with mixed message types', () => {
      const postResult: PostResult<ResponseWithResultMessage> = {
        overallStatus: 'WARNING',
        response: [
          {
            result: {
              messageType: MessageType.Success,
              message: 'Success message',
            },
          },
          {
            result: {
              messageType: MessageType.Warning,
              message: 'Warning message',
            },
          },
          {
            result: {
              messageType: MessageType.Error,
              message: 'Error message',
            },
          },
        ],
      } as any;

      jest
        .spyOn(component as any, 'getSuccessMessageFn')
        .mockReturnValue(() => 'Success');
      jest
        .spyOn(component as any, 'getErrorMessageFn')
        .mockReturnValue(() => 'Error');

      const result = component['getMultiPostResultsToUserMessages']({
        postResult,
        action: 'save',
      });

      // There should be messages for each type
      expect(result.length).toBe(3);
    });
  });

  describe('onApplyData', () => {
    it('should handle successful validation without errors', async () => {
      jest
        .spyOn(component as any, 'dataFromRowModel')
        .mockReturnValue([{ id: 'valid', name: 'Test' }]);
      jest.spyOn(component as any, 'checkForNoRows').mockReturnValue(false);
      jest
        .spyOn(component as any, 'checkForTooManyRows')
        .mockReturnValue(false);
      jest.spyOn(component as any, 'getValidationErrors').mockReturnValue([]);
      jest.spyOn(component as any, 'checkDataForErrors').mockReturnValue([]);
      const applyFnSpy = jest
        .spyOn(component, 'applyFunction' as any)
        .mockResolvedValue({
          overallStatus: 'SUCCESS',
          response: [
            {
              result: {
                messageType: MessageType.Success,
                message: 'Success',
              },
            },
          ],
        });
      const setHasChangedSpy = jest.spyOn(
        component as any,
        'setHasChangedData'
      );
      const updateColumnsSpy = jest.spyOn(
        component as any,
        'updateColumnDefinitions'
      );
      const getMultiPostSpy = jest
        .spyOn(component as any, 'getMultiPostResultsToUserMessages')
        .mockReturnValue([{ message: 'Success', variant: 'success' }]);
      const onAddedSpy = jest.spyOn(component as any, 'onAdded');
      const snackbarSpy = jest.spyOn(component['snackbarService'], 'show');

      await component['onApplyData'](false);

      expect(component['loading']()).toBe(false);
      expect(applyFnSpy).toHaveBeenCalledWith(
        [{ id: 'valid', name: 'Test' }],
        false
      );
      expect(setHasChangedSpy).toHaveBeenCalled();
      expect(updateColumnsSpy).toHaveBeenCalled();
      expect(getMultiPostSpy).toHaveBeenCalled();
      expect(snackbarSpy).toHaveBeenCalled();
      expect(onAddedSpy).toHaveBeenCalled();
    });

    it('should handle validation with errors', async () => {
      jest.spyOn(component as any, 'dataFromRowModel').mockReturnValue([
        { id: 'valid', name: 'Test' },
        { id: 'error', name: 'Error' },
      ]);
      jest.spyOn(component as any, 'checkForNoRows').mockReturnValue(false);
      jest
        .spyOn(component as any, 'checkForTooManyRows')
        .mockReturnValue(false);
      jest.spyOn(component as any, 'getValidationErrors').mockReturnValue([]);

      await component['onApplyData'](true);

      expect(component['frontendErrors']().length).toBe(1);
      expect(component['loading']()).toBe(false);
    });

    it('should handle no valid data scenario', async () => {
      jest
        .spyOn(component as any, 'dataFromRowModel')
        .mockReturnValue([{ id: 'error', name: 'Error' }]);
      jest.spyOn(component as any, 'checkForNoRows').mockReturnValue(false);
      jest
        .spyOn(component as any, 'checkForTooManyRows')
        .mockReturnValue(false);
      jest.spyOn(component as any, 'getValidationErrors').mockReturnValue([]);
      jest.spyOn(component as any, 'countErrorRows').mockReturnValue(1);
      const applyFnSpy = jest.spyOn(component, 'applyFunction' as any);
      const snackbarSpy = jest.spyOn(component['snackbarService'], 'warning');

      await component['onApplyData'](true);

      expect(applyFnSpy).not.toHaveBeenCalled();
      expect(snackbarSpy).toHaveBeenCalled();
      expect(component['loading']()).toBe(false);
    });

    it('should handle exceptions during apply', async () => {
      jest
        .spyOn(component as any, 'dataFromRowModel')
        .mockReturnValue([{ id: 'valid', name: 'Test' }]);
      jest.spyOn(component as any, 'checkForNoRows').mockReturnValue(false);
      jest
        .spyOn(component as any, 'checkForTooManyRows')
        .mockReturnValue(false);
      jest.spyOn(component as any, 'getValidationErrors').mockReturnValue([]);
      jest.spyOn(component as any, 'checkDataForErrors').mockReturnValue([]);
      jest
        .spyOn(component, 'applyFunction' as any)
        .mockRejectedValue(new Error('Test error'));
      const snackbarSpy = jest.spyOn(component['snackbarService'], 'error');

      await component['onApplyData'](true);

      expect(snackbarSpy).toHaveBeenCalled();
      expect(component['loading']()).toBe(false);
    });

    it('should skip processing if there are no rows', async () => {
      jest.spyOn(component as any, 'checkForNoRows').mockReturnValue(true);
      const loadingSpy = jest.spyOn(component['loading'], 'set');

      await component['onApplyData'](false);

      expect(loadingSpy).not.toHaveBeenCalled();
    });

    it('should skip processing if there are too many rows', async () => {
      jest.spyOn(component as any, 'checkForNoRows').mockReturnValue(false);
      jest.spyOn(component as any, 'checkForTooManyRows').mockReturnValue(true);
      const loadingSpy = jest.spyOn(component['loading'], 'set');

      await component['onApplyData'](false);

      expect(loadingSpy).not.toHaveBeenCalled();
    });

    it('should not call onAdded when multiple user messages are present', async () => {
      jest
        .spyOn(component as any, 'dataFromRowModel')
        .mockReturnValue([{ id: 'valid', name: 'Test' }]);
      jest.spyOn(component as any, 'checkForNoRows').mockReturnValue(false);
      jest
        .spyOn(component as any, 'checkForTooManyRows')
        .mockReturnValue(false);
      jest.spyOn(component as any, 'getValidationErrors').mockReturnValue([]);
      jest.spyOn(component as any, 'checkDataForErrors').mockReturnValue([]);
      jest.spyOn(component, 'applyFunction' as any).mockResolvedValue({
        overallStatus: 'SUCCESS',
        response: [{ result: { messageType: MessageType.Success } }],
      });

      // Return multiple messages to prevent onAdded from being called
      jest
        .spyOn(component as any, 'getMultiPostResultsToUserMessages')
        .mockReturnValue([
          { message: 'Success 1', variant: 'success' },
          { message: 'Success 2', variant: 'success' },
        ]);

      const onAddedSpy = jest.spyOn(component as any, 'onAdded');

      await component['onApplyData'](false);

      expect(onAddedSpy).not.toHaveBeenCalled();
    });

    it('should not call onAdded for error messages', async () => {
      jest
        .spyOn(component as any, 'dataFromRowModel')
        .mockReturnValue([{ id: 'valid', name: 'Test' }]);
      jest.spyOn(component as any, 'checkForNoRows').mockReturnValue(false);
      jest
        .spyOn(component as any, 'checkForTooManyRows')
        .mockReturnValue(false);
      jest.spyOn(component as any, 'getValidationErrors').mockReturnValue([]);
      jest.spyOn(component as any, 'checkDataForErrors').mockReturnValue([]);
      jest.spyOn(component, 'applyFunction' as any).mockResolvedValue({
        overallStatus: 'ERROR',
        response: [{ result: { messageType: MessageType.Error } }],
      });

      jest
        .spyOn(component as any, 'getMultiPostResultsToUserMessages')
        .mockReturnValue([{ message: 'Error message', variant: 'error' }]);

      const onAddedSpy = jest.spyOn(component as any, 'onAdded');

      await component['onApplyData'](false);

      expect(onAddedSpy).not.toHaveBeenCalled();
    });

    it('should not call onAdded for dry runs', async () => {
      jest
        .spyOn(component as any, 'dataFromRowModel')
        .mockReturnValue([{ id: 'valid', name: 'Test' }]);
      jest.spyOn(component as any, 'checkForNoRows').mockReturnValue(false);
      jest
        .spyOn(component as any, 'checkForTooManyRows')
        .mockReturnValue(false);
      jest.spyOn(component as any, 'getValidationErrors').mockReturnValue([]);
      jest.spyOn(component as any, 'checkDataForErrors').mockReturnValue([]);
      jest.spyOn(component, 'applyFunction' as any).mockResolvedValue({
        overallStatus: 'SUCCESS',
        response: [{ result: { messageType: MessageType.Success } }],
      });

      jest
        .spyOn(component as any, 'getMultiPostResultsToUserMessages')
        .mockReturnValue([{ message: 'Success message', variant: 'success' }]);

      const onAddedSpy = jest.spyOn(component as any, 'onAdded');

      await component['onApplyData'](true); // true = dry run

      expect(onAddedSpy).not.toHaveBeenCalled();
    });

    it('should call snackbarService with warning for dryRun', async () => {
      jest.spyOn(component as any, 'dataFromRowModel').mockReturnValue([]);
      jest.spyOn(component as any, 'checkForNoRows').mockReturnValue(false);
      const snackbarSpy = jest.spyOn(component['snackbarService'], 'warning');

      await component['onApplyData'](true);

      expect(snackbarSpy).toHaveBeenCalledWith(
        expect.stringContaining('generic.validation.upload.check.error')
      );
    });

    it('should call snackbarService with error for non-dryRun', async () => {
      jest.spyOn(component as any, 'dataFromRowModel').mockReturnValue([]);
      jest.spyOn(component as any, 'checkForNoRows').mockReturnValue(false);
      const snackbarSpy = jest.spyOn(component['snackbarService'], 'error');

      await component['onApplyData'](false);

      expect(snackbarSpy).toHaveBeenCalledWith(
        expect.stringContaining('generic.validation.upload.save.error')
      );
    });
  });
});
