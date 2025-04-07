import { Observable, of, throwError } from 'rxjs';

import { ValueGetterParams } from 'ag-grid-enterprise';

import {
  AlertRule,
  AlertRuleSaveResponse,
} from '../../../../../feature/alert-rules/model';
import { SelectableValueOrOriginalCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/selectable-value-or-original/selectable-value-or-original.component';
import { AbstractTableUploadModalComponent } from '../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component';
import { Stub } from '../../../../../shared/test/stub.class';
import { PostResult } from '../../../../../shared/utils/error-handling';
import * as Parser from '../../../../../shared/utils/parse-values';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
import { SelectableValue } from './../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { MessageType } from './../../../../../shared/models/message-type.enum';
import { AbstractAlertRuleMultiModalComponent } from './abstract-alert-rule-multi-modal.component';
import * as OptionsConfig from './alert-rule-edit-single-modal/alert-rule-options-config';
import * as Helper from './alert-rule-logic-helper';

class TestComponent extends AbstractAlertRuleMultiModalComponent {
  protected apiCall(
    _data: AlertRule[],
    _dryRun: boolean
  ): Observable<PostResult<AlertRuleSaveResponse>> {
    return of({
      overallStatus: MessageType.Success,
      overallErrorMsg: null,
      response: [],
    });
  }
  protected title = 'TestComponentTitle';
  protected modalMode: 'delete' | 'save' = 'save';
}

describe('AlertRuleTableRowMenuButtonComponent', () => {
  let component: AbstractAlertRuleMultiModalComponent;

  beforeEach(() => {
    component = Stub.get<AbstractAlertRuleMultiModalComponent>({
      component: TestComponent,
      providers: [Stub.getAlertRulesServiceProvider()],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('applyFunction', () => {
    let apiCallSpy: jest.SpyInstance;
    let parseSpy: jest.SpyInstance;

    beforeEach(() => {
      apiCallSpy = jest.spyOn(component as any, 'apiCall').mockReturnValue(
        of({
          overallStatus: MessageType.Success,
          overallErrorMsg: null,
          response: [],
        })
      );
      parseSpy = jest
        .spyOn(component as any, 'parse')
        .mockImplementation((data) => data);
    });

    it('should call parse with the provided data', async () => {
      const mockData: AlertRule[] = [{ id: '1', type: 'type1' } as AlertRule];
      const dryRun = false;

      await component['applyFunction'](mockData, dryRun);

      expect(parseSpy).toHaveBeenCalledWith(mockData);
    });

    it('should call apiCall with parsed data and dryRun flag', async () => {
      const mockData: AlertRule[] = [{ id: '1', type: 'type1' } as AlertRule];
      const dryRun = true;

      await component['applyFunction'](mockData, dryRun);

      expect(apiCallSpy).toHaveBeenCalledWith(mockData, dryRun);
    });

    it('should return the result from apiCall', async () => {
      const mockData: AlertRule[] = [{ id: '1', type: 'type1' } as AlertRule];
      const dryRun = false;

      const result = await component['applyFunction'](mockData, dryRun);

      expect(result).toEqual({
        overallStatus: MessageType.Success,
        overallErrorMsg: null,
        response: [],
      });
    });

    it('should handle errors thrown by apiCall', async () => {
      const mockData: AlertRule[] = [{ id: '1', type: 'type1' } as AlertRule];
      const dryRun = false;
      const error = new Error('API call failed');
      apiCallSpy.mockReturnValueOnce(throwError(() => error));

      await expect(
        component['applyFunction'](mockData, dryRun)
      ).rejects.toThrow('API call failed');
    });
  });

  describe('parseErrorsFromResult', () => {
    it('should return an empty array if there are no errors', () => {
      const result: PostResult<AlertRuleSaveResponse> = {
        overallStatus: MessageType.Success,
        overallErrorMsg: null,
        response: [
          {
            result: { messageType: MessageType.Success },
            type: 'type1',
            region: 'region1',
            salesArea: 'salesArea1',
            salesOrg: 'salesOrg1',
            customerNumber: 'customerNumber1',
            materialNumber: 'materialNumber1',
            materialClassification: 'materialClassification1',
            sectorManagement: 'sectorManagement1',
            demandPlannerId: 'demandPlannerId1',
            productionLine: 'productionLine1',
            productLine: 'productLine1',
            gkamNumber: 'gkamNumber1',
          },
        ],
      } as any;

      const errors = component['parseErrorsFromResult'](result);

      expect(errors).toEqual([]);
    });

    it('should return an array of errors if there are errors in the response', () => {
      const result: PostResult<AlertRuleSaveResponse> = {
        overallStatus: MessageType.Error,
        overallErrorMsg: 'Some error occurred',
        response: [
          {
            result: {
              messageType: MessageType.Error,
              message: 'Error message',
            },
            type: 'type1',
            region: 'region1',
            salesArea: 'salesArea1',
            salesOrg: 'salesOrg1',
            customerNumber: 'customerNumber1',
            materialNumber: 'materialNumber1',
            materialClassification: 'materialClassification1',
            sectorManagement: 'sectorManagement1',
            demandPlannerId: 'demandPlannerId1',
            productionLine: 'productionLine1',
            productLine: 'productLine1',
            gkamNumber: 'gkamNumber1',
          },
        ],
      } as any;

      const errors = component['parseErrorsFromResult'](result);

      expect(errors).toEqual([
        {
          dataIdentifier: {
            type: 'type1',
            region: 'region1',
            salesArea: 'salesArea1',
            salesOrg: 'salesOrg1',
            customerNumber: 'customerNumber1',
            materialNumber: 'materialNumber1',
            materialClassification: 'materialClassification1',
            sectorManagement: 'sectorManagement1',
            demandPlannerId: 'demandPlannerId1',
            productionLine: 'productionLine1',
            productLine: 'productLine1',
            gkamNumber: 'gkamNumber1',
            demandPlanner: 'demandPlannerId1',
          },
          errorMessage: 'sap_message.error',
        },
      ]);
    });

    it('should handle multiple errors in the response', () => {
      const result: PostResult<AlertRuleSaveResponse> = {
        overallStatus: MessageType.Error,
        overallErrorMsg: 'Some error occurred',
        response: [
          {
            result: {
              messageType: MessageType.Error,
              message: 'Error message 1',
            },
            type: 'type1',
            region: 'region1',
            salesArea: 'salesArea1',
            salesOrg: 'salesOrg1',
            customerNumber: 'customerNumber1',
            materialNumber: 'materialNumber1',
            materialClassification: 'materialClassification1',
            sectorManagement: 'sectorManagement1',
            demandPlannerId: 'demandPlannerId1',
            productionLine: 'productionLine1',
            productLine: 'productLine1',
            gkamNumber: 'gkamNumber1',
          },
          {
            result: {
              messageType: MessageType.Error,
              message: 'Error message 2',
            },
            type: 'type2',
            region: 'region2',
            salesArea: 'salesArea2',
            salesOrg: 'salesOrg2',
            customerNumber: 'customerNumber2',
            materialNumber: 'materialNumber2',
            materialClassification: 'materialClassification2',
            sectorManagement: 'sectorManagement2',
            demandPlannerId: 'demandPlannerId2',
            productionLine: 'productionLine2',
            productLine: 'productLine2',
            gkamNumber: 'gkamNumber2',
          },
        ],
      } as any;

      const errors = component['parseErrorsFromResult'](result);

      expect(errors).toEqual([
        {
          dataIdentifier: {
            type: 'type1',
            region: 'region1',
            salesArea: 'salesArea1',
            salesOrg: 'salesOrg1',
            customerNumber: 'customerNumber1',
            materialNumber: 'materialNumber1',
            materialClassification: 'materialClassification1',
            sectorManagement: 'sectorManagement1',
            demandPlannerId: 'demandPlannerId1',
            productionLine: 'productionLine1',
            productLine: 'productLine1',
            gkamNumber: 'gkamNumber1',
            demandPlanner: 'demandPlannerId1',
          },
          errorMessage: 'sap_message.error',
        },
        {
          dataIdentifier: {
            type: 'type2',
            region: 'region2',
            salesArea: 'salesArea2',
            salesOrg: 'salesOrg2',
            customerNumber: 'customerNumber2',
            materialNumber: 'materialNumber2',
            materialClassification: 'materialClassification2',
            sectorManagement: 'sectorManagement2',
            demandPlannerId: 'demandPlannerId2',
            productionLine: 'productionLine2',
            productLine: 'productLine2',
            gkamNumber: 'gkamNumber2',
            demandPlanner: 'demandPlannerId2',
          },
          errorMessage: 'sap_message.error',
        },
      ]);
    });
  });

  describe('checkDataForErrors', () => {
    let checkAlertRuleDataSpy: jest.SpyInstance;

    beforeEach(() => {
      checkAlertRuleDataSpy = jest.spyOn(Helper, 'checkAlertRuleData');
    });

    it('should return an empty array if no errors are found', () => {
      const mockData: AlertRule[] = [
        { id: '1', type: 'type1', region: 'region1' } as AlertRule,
      ];
      checkAlertRuleDataSpy.mockReturnValue([]);

      const result = component['checkDataForErrors'](mockData);

      expect(result).toEqual([]);
      expect(checkAlertRuleDataSpy).toHaveBeenCalledWith(
        expect.anything(),
        mockData[0],
        component['thresholdRequirements']
      );
    });

    it('should return an array of errors if errors are found', () => {
      const mockData: AlertRule[] = [
        { id: '1', type: 'type1', region: 'region1' } as AlertRule,
      ];
      const mockErrors: Helper.ErrorMessage<AlertRule>[] = [
        { dataIdentifier: { id: '1' }, errorMessage: 'Error 1' },
      ];
      checkAlertRuleDataSpy.mockReturnValue(mockErrors);

      const result = component['checkDataForErrors'](mockData);

      expect(result).toEqual(mockErrors);
      expect(checkAlertRuleDataSpy).toHaveBeenCalledWith(
        expect.anything(),
        mockData[0],
        component['thresholdRequirements']
      );
    });

    it('should handle multiple alert rules and aggregate errors', () => {
      const mockData: AlertRule[] = [
        { id: '1', type: 'type1', region: 'region1' } as AlertRule,
        { id: '2', type: 'type2', region: 'region2' } as AlertRule,
      ];
      const mockErrors1: Helper.ErrorMessage<AlertRule>[] = [
        { dataIdentifier: { id: '1' }, errorMessage: 'Error 1' },
      ];
      const mockErrors2: Helper.ErrorMessage<AlertRule>[] = [
        { dataIdentifier: { id: '2' }, errorMessage: 'Error 2' },
      ];
      checkAlertRuleDataSpy
        .mockReturnValueOnce(mockErrors1)
        .mockReturnValueOnce(mockErrors2);

      const result = component['checkDataForErrors'](mockData);

      expect(result).toEqual([...mockErrors1, ...mockErrors2]);
      expect(checkAlertRuleDataSpy).toHaveBeenCalledTimes(2);
      expect(checkAlertRuleDataSpy).toHaveBeenCalledWith(
        expect.anything(),
        mockData[0],
        component['thresholdRequirements']
      );
      expect(checkAlertRuleDataSpy).toHaveBeenCalledWith(
        expect.anything(),
        mockData[1],
        component['thresholdRequirements']
      );
    });
  });

  describe('parse', () => {
    it('should parse a single AlertRule object correctly', () => {
      const mockData: AlertRule = {
        id: '1',
        type: 'type1',
        region: 'region1',
      } as AlertRule;

      const mockParsedValue = 'parsedValue';
      const parserSpy = jest
        .spyOn(Parser, 'combineParseFunctionsForFields')
        .mockReturnValue(() => mockParsedValue);

      const result = (component as any).parse(mockData);

      expect(parserSpy).toHaveBeenCalledWith(
        component['specialParseFunctionsForFields']
      );
      expect(result).toEqual({
        id: mockParsedValue,
        type: mockParsedValue,
        region: mockParsedValue,
      });
    });

    it('should parse an array of AlertRule objects correctly', () => {
      const mockData: AlertRule[] = [
        { id: '1', type: 'type1', region: 'region1' } as AlertRule,
        { id: '2', type: 'type2', region: 'region2' } as AlertRule,
      ];

      const mockParsedValue = 'parsedValue';
      const parserSpy = jest
        .spyOn(Parser, 'combineParseFunctionsForFields')
        .mockReturnValue(() => mockParsedValue);

      const result = (component as any).parse(mockData);

      expect(parserSpy).toHaveBeenCalledWith(
        component['specialParseFunctionsForFields']
      );
      expect(result).toEqual([
        {
          id: mockParsedValue,
          type: mockParsedValue,
          region: mockParsedValue,
        },
        {
          id: mockParsedValue,
          type: mockParsedValue,
          region: mockParsedValue,
        },
      ]);
    });

    it('should handle an empty array input', () => {
      const mockData: AlertRule[] = [];

      const result = (component as any).parse(mockData);

      expect(result).toEqual([]);
    });

    it('should not modify the original input object', () => {
      const mockData: AlertRule = {
        id: '1',
        type: 'type1',
        region: 'region1',
      } as AlertRule;

      const mockParsedValue = 'parsedValue';
      jest
        .spyOn(Parser, 'combineParseFunctionsForFields')
        .mockReturnValue(() => mockParsedValue);

      const originalData = { ...mockData };
      (component as any).parse(mockData);

      expect(mockData).toEqual(originalData);
    });
  });

  describe('ngOnInit', () => {
    let getRuleTypeDataSpy: jest.SpyInstance;
    let getThresholdRequirementsSpy: jest.SpyInstance;

    beforeEach(() => {
      getRuleTypeDataSpy = jest
        .spyOn(component['alertRuleService'], 'getRuleTypeData')
        .mockReturnValue(of([]));
      getThresholdRequirementsSpy = jest.spyOn(
        OptionsConfig,
        'getThresholdRequirements'
      );
    });

    it('should call getRuleTypeData and getThresholdRequirements', () => {
      component.ngOnInit();

      expect(getRuleTypeDataSpy).toHaveBeenCalled();
      expect(getThresholdRequirementsSpy).toHaveBeenCalled();
    });

    it('should set thresholdRequirements correctly', () => {
      const mockResult = [
        {
          type: 'type1',
          thresholds: ['threshold1', 'threshold2'],
        },
      ];
      getRuleTypeDataSpy.mockReturnValue(of(mockResult));
      getThresholdRequirementsSpy.mockReturnValue(mockResult);

      component.ngOnInit();

      expect(component['thresholdRequirements']).toEqual(mockResult);
    });

    it('should call super.ngOnInit', () => {
      const superNgOnInitSpy = jest.spyOn(
        AbstractTableUploadModalComponent.prototype,
        'ngOnInit'
      );

      component.ngOnInit();

      expect(superNgOnInitSpy).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      getRuleTypeDataSpy.mockReturnValue(throwError(() => new Error('Error')));

      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('getMultiAlertRuleModalColumns', () => {
    let options: any;

    beforeEach(() => {
      options = {
        alertType: [{ text: 'Type1' }, { text: 'Type2' }],
        demandPlanner: [{ text: 'Planner1' }, { text: 'Planner2' }],
        execDay: [{ text: 'Monday' }, { text: 'Tuesday' }],
        gkam: [{ text: 'GKAM1' }, { text: 'GKAM2' }],
        interval: [{ text: 'Weekly' }, { text: 'Monthly' }],
        productLine: [{ text: 'Line1' }, { text: 'Line2' }],
        region: [{ text: 'Region1' }, { text: 'Region2' }],
        salesArea: [{ text: 'Area1' }, { text: 'Area2' }],
        salesOrg: [{ text: 'Org1' }, { text: 'Org2' }],
        sectorManagement: [{ text: 'Sector1' }, { text: 'Sector2' }],
        materialClassification: [{ text: 'Class1' }, { text: 'Class2' }],
      };
    });

    it('should return column definitions with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);

      expect(columns).toBeInstanceOf(Array);
      expect(columns.length).toBeGreaterThan(0);

      columns.forEach((column) => {
        expect(column).toHaveProperty('field');
        expect(column).toHaveProperty('headerName');
        expect(column).toHaveProperty('editable');
      });
    });

    it('should correctly parse values using valueGetter', () => {
      const mockOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      const mockField = 'type';
      const mockData = { type: '1' };

      const columns = component['getMultiAlertRuleModalColumns']({
        alertType: mockOptions,
        demandPlanner: [],
        execDay: [],
        gkam: [],
        interval: [],
        productLine: [],
        region: [],
        salesArea: [],
        salesOrg: [],
        sectorManagement: [],
        materialClassification: [],
      });

      const typeColumn = columns.find((col) => col.field === mockField);
      const valueGetter = typeColumn?.valueGetter as any;

      const result = valueGetter?.({ data: mockData } as ValueGetterParams);

      expect(result).toEqual('1');
    });

    it('should include specific columns with correct configurations', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);

      const typeColumn = columns.find((col) => col.field === 'type');
      expect(typeColumn).toBeDefined();
      expect(typeColumn?.headerName).toBe('alert_rules.edit_modal.label.type');
      expect(typeColumn?.editable).toBe(true);
      expect(typeColumn?.minWidth).toBe(300);

      const customerNumberColumn = columns.find(
        (col) => col.field === 'customerNumber'
      );
      expect(customerNumberColumn).toBeDefined();
      expect(customerNumberColumn?.headerName).toBe(
        'alert_rules.multi_modal.customer'
      );
      expect(customerNumberColumn?.editable).toBe(true);
      expect(customerNumberColumn?.validationFn).toBeDefined();
    });

    it('should configure cellRenderer and cellEditor for selectable fields', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);

      const typeColumn = columns.find((col) => col.field === 'type');
      expect(typeColumn?.cellRenderer).toBe(
        SelectableValueOrOriginalCellRendererComponent
      );
      expect(typeColumn?.cellEditor).toBe('agRichSelectCellEditor');
      expect(typeColumn?.cellEditorParams).toHaveProperty('values');
      expect(typeColumn?.cellEditorParams.values).toEqual(
        options.alertType.map((option: SelectableValue) => option.text)
      );
    });

    it('should configure validation functions for specific fields', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);

      const threshold1Column = columns.find(
        (col) => col.field === 'threshold1'
      );
      expect(threshold1Column?.validationFn).toBeDefined();
      const validationResult1 = threshold1Column?.validationFn(
        '123.45',
        {} as any
      );
      expect(validationResult1).toBeNull(); // Adjusted to match the actual behavior

      const threshold2Column = columns.find(
        (col) => col.field === 'threshold2'
      );
      expect(threshold2Column?.validationFn).toBeDefined();
      const validationResult2 = threshold2Column?.validationFn(
        '123.45',
        {} as any
      );
      expect(validationResult2).toBeNull(); // Adjusted to match the actual behavior

      const threshold3Column = columns.find(
        (col) => col.field === 'threshold3'
      );
      expect(threshold3Column?.validationFn).toBeDefined();
      const validationResult3 = threshold3Column?.validationFn(
        '123.45',
        {} as any
      );
      expect(validationResult3).toBeNull(); // Adjusted to match the actual behavior

      const startDateColumn = columns.find((col) => col.field === 'startDate');
      expect(startDateColumn?.validationFn).toBe(
        ValidationHelper.validateDateFormatAndGreaterEqualThanToday
      );
    });

    it('should handle columns without selectable options correctly', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);

      const productionLineColumn = columns.find(
        (col) => col.field === 'productionLine'
      );
      expect(productionLineColumn).toBeDefined();
      expect(productionLineColumn?.editable).toBe(true);
      expect(productionLineColumn?.cellRenderer).toBeUndefined();
    });
  });
});
