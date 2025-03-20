import { Observable, of, throwError } from 'rxjs';

import {
  AlertRule,
  AlertRuleSaveResponse,
} from '../../../../../feature/alert-rules/model';
import { AbstractTableUploadModalComponent } from '../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component';
import { Stub } from '../../../../../shared/test/stub.class';
import { PostResult } from '../../../../../shared/utils/error-handling';
import { SelectableValue } from './../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { AbstractAlertRuleMultiModalComponent } from './abstract-alert-rule-multi-modal.component';
import * as OptionsConfig from './alert-rule-edit-single-modal/alert-rule-options-config';

class TestComponent extends AbstractAlertRuleMultiModalComponent {
  protected apiCall(
    _data: AlertRule[],
    _dryRun: boolean
  ): Observable<PostResult<AlertRuleSaveResponse>> {
    return of({
      overallStatus: 'SUCCESS',
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

    beforeEach(() => {
      component = Stub.get<AbstractAlertRuleMultiModalComponent>({
        component: TestComponent,
        providers: [Stub.getAlertRulesServiceProvider()],
      });

      apiCallSpy = jest.spyOn(component as any, 'apiCall').mockReturnValue(
        of({
          overallStatus: 'SUCCESS',
          overallErrorMsg: null,
          response: [],
        })
      );
    });

    it('should call apiCall with correct parameters', async () => {
      const data: AlertRule[] = [
        {
          id: '1',
          startDate: new Date(),
          endDate: new Date(),
          deactivated: false,
        },
      ];
      const dryRun = true;

      await component['applyFunction'](data, dryRun);

      expect(apiCallSpy).toHaveBeenCalledWith(data, dryRun);
    });

    it('should return the correct PostResult on success', async () => {
      const data: AlertRule[] = [
        {
          id: '1',
          startDate: new Date(),
          endDate: new Date(),
          deactivated: false,
        },
      ];
      const dryRun = true;

      const result = await component['applyFunction'](data, dryRun);

      expect(result).toEqual({
        overallStatus: 'SUCCESS',
        overallErrorMsg: null,
        response: [],
      });
    });

    it('should handle errors gracefully', async () => {
      apiCallSpy.mockReturnValueOnce(throwError(() => new Error('Error')));

      const data: AlertRule[] = [
        {
          id: '1',
          startDate: new Date(),
          endDate: new Date(),
          deactivated: false,
        },
      ];
      const dryRun = true;

      await expect(component['applyFunction'](data, dryRun)).rejects.toThrow(
        'Error'
      );
    });
  });

  describe('parseErrorsFromResult', () => {
    it('should return an empty array if there are no errors', () => {
      const result: PostResult<AlertRuleSaveResponse> = {
        overallStatus: 'SUCCESS',
        overallErrorMsg: null,
        response: [
          {
            result: { messageType: 'SUCCESS' },
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
        overallStatus: 'ERROR',
        overallErrorMsg: 'Some error occurred',
        response: [
          {
            result: { messageType: 'ERROR', message: 'Error message' },
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
        overallStatus: 'ERROR',
        overallErrorMsg: 'Some error occurred',
        response: [
          {
            result: { messageType: 'ERROR', message: 'Error message 1' },
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
            result: { messageType: 'ERROR', message: 'Error message 2' },
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
    it('should return an empty array if there are no errors', () => {
      const data: AlertRule[] = [] as any;

      const errors = component['checkDataForErrors'](data);

      expect(errors).toEqual([]);
    });

    it('should return an array of errors if there are errors in the data', () => {
      const data: AlertRule[] = [
        {
          id: '1',
          startDate: new Date(),
          endDate: new Date(),
          deactivated: false,
          type: '',
          region: '',
          salesArea: '',
          salesOrg: '',
          customerNumber: '',
          materialNumber: '',
          materialClassification: '',
          sectorManagement: '',
          demandPlannerId: '',
          productionLine: '',
          productLine: '',
          gkamNumber: '',
          threshold1: '',
          threshold2: '',
          threshold3: '',
          execInterval: '',
          execDay: '',
          alertComment: '',
        },
      ] as any;

      const errors = component['checkDataForErrors'](data);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should handle multiple errors in the data', () => {
      const data: AlertRule[] = [
        {
          id: '1',
          startDate: new Date(),
          endDate: new Date(),
          deactivated: false,
          type: '',
          region: '',
          salesArea: '',
          salesOrg: '',
          customerNumber: '',
          materialNumber: '',
          materialClassification: '',
          sectorManagement: '',
          demandPlannerId: '',
          productionLine: '',
          productLine: '',
          gkamNumber: '',
          threshold1: '',
          threshold2: '',
          threshold3: '',
          execInterval: '',
          execDay: '',
          alertComment: '',
        },
        {
          id: '2',
          startDate: new Date(),
          endDate: new Date(),
          deactivated: false,
          type: '',
          region: '',
          salesArea: '',
          salesOrg: '',
          customerNumber: '',
          materialNumber: '',
          materialClassification: '',
          sectorManagement: '',
          demandPlannerId: '',
          productionLine: '',
          productLine: '',
          gkamNumber: '',
          threshold1: '',
          threshold2: '',
          threshold3: '',
          execInterval: '',
          execDay: '',
          alertComment: '',
        },
      ] as any;

      const errors = component['checkDataForErrors'](data);

      expect(errors.length).toBeGreaterThan(1);
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
    let options: {
      alertType: SelectableValue[];
      demandPlanner: SelectableValue[];
      execDay: SelectableValue[];
      gkam: SelectableValue[];
      interval: SelectableValue[];
      productLine: SelectableValue[];
      region: SelectableValue[];
      salesArea: SelectableValue[];
      salesOrg: SelectableValue[];
      sectorManagement: SelectableValue[];
    };

    beforeEach(() => {
      options = {
        alertType: [{ id: '1', text: 'Type 1' }],
        demandPlanner: [{ id: '2', text: 'Planner 1' }],
        execDay: [{ id: '3', text: 'Day 1' }],
        gkam: [{ id: '4', text: 'GKAM 1' }],
        interval: [{ id: '5', text: 'Interval 1' }],
        productLine: [{ id: '6', text: 'Product Line 1' }],
        region: [{ id: '7', text: 'Region 1' }],
        salesArea: [{ id: '8', text: 'Sales Area 1' }],
        salesOrg: [{ id: '9', text: 'Sales Org 1' }],
        sectorManagement: [{ id: '10', text: 'Sector Management 1' }],
      };
    });

    it('should return the correct column definitions', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);

      expect(columns).toBeDefined();
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should include a column for type with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const typeColumn = columns.find((col) => col.field === 'type');

      expect(typeColumn).toBeDefined();
      expect(typeColumn.headerName).toBe('alert_rules.edit_modal.label.type');
      expect(typeColumn.editable).toBe(true);
      expect(typeColumn.minWidth).toBe(300);
      expect(typeColumn.cellEditor).toBe('agRichSelectCellEditor');
      expect(typeColumn.cellEditorPopup).toBe(true);
    });

    it('should include a column for region with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const regionColumn = columns.find((col) => col.field === 'region');

      expect(regionColumn).toBeDefined();
      expect(regionColumn.headerName).toBe(
        'alert_rules.edit_modal.label.region'
      );
      expect(regionColumn.editable).toBe(true);
    });

    it('should include a column for salesArea with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const salesAreaColumn = columns.find((col) => col.field === 'salesArea');

      expect(salesAreaColumn).toBeDefined();
      expect(salesAreaColumn.headerName).toBe(
        'alert_rules.edit_modal.label.sales_area'
      );
      expect(salesAreaColumn.editable).toBe(true);
    });

    it('should include a column for salesOrg with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const salesOrgColumn = columns.find((col) => col.field === 'salesOrg');

      expect(salesOrgColumn).toBeDefined();
      expect(salesOrgColumn.headerName).toBe(
        'alert_rules.edit_modal.label.sales_org'
      );
      expect(salesOrgColumn.editable).toBe(true);
    });

    it('should include a column for sectorManagement with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const sectorManagementColumn = columns.find(
        (col) => col.field === 'sectorManagement'
      );

      expect(sectorManagementColumn).toBeDefined();
      expect(sectorManagementColumn.headerName).toBe(
        'alert_rules.edit_modal.label.sector_management'
      );
      expect(sectorManagementColumn.editable).toBe(true);
    });

    it('should include a column for demandPlannerId with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const demandPlannerIdColumn = columns.find(
        (col) => col.field === 'demandPlannerId'
      );

      expect(demandPlannerIdColumn).toBeDefined();
      expect(demandPlannerIdColumn.headerName).toBe(
        'alert_rules.edit_modal.label.demandPlannerId'
      );
      expect(demandPlannerIdColumn.editable).toBe(true);
    });

    it('should include a column for gkamNumber with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const gkamNumberColumn = columns.find(
        (col) => col.field === 'gkamNumber'
      );

      expect(gkamNumberColumn).toBeDefined();
      expect(gkamNumberColumn.headerName).toBe(
        'alert_rules.edit_modal.label.gkamNumber'
      );
      expect(gkamNumberColumn.editable).toBe(true);
    });

    it('should include a column for customerNumber with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const customerNumberColumn = columns.find(
        (col) => col.field === 'customerNumber'
      );

      expect(customerNumberColumn).toBeDefined();
      expect(customerNumberColumn.headerName).toBe(
        'alert_rules.multi_modal.customer'
      );
      expect(customerNumberColumn.editable).toBe(true);
    });

    it('should include a column for materialClassification with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const materialClassificationColumn = columns.find(
        (col) => col.field === 'materialClassification'
      );

      expect(materialClassificationColumn).toBeDefined();
      expect(materialClassificationColumn.headerName).toBe(
        'alert_rules.edit_modal.label.materialClassification'
      );
      expect(materialClassificationColumn.editable).toBe(true);
    });

    it('should include a column for productLine with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const productLineColumn = columns.find(
        (col) => col.field === 'productLine'
      );

      expect(productLineColumn).toBeDefined();
      expect(productLineColumn.headerName).toBe(
        'alert_rules.edit_modal.label.product_line'
      );
      expect(productLineColumn.editable).toBe(true);
    });

    it('should include a column for productionLine with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const productionLineColumn = columns.find(
        (col) => col.field === 'productionLine'
      );

      expect(productionLineColumn).toBeDefined();
      expect(productionLineColumn.headerName).toBe(
        'alert_rules.edit_modal.label.production_line'
      );
      expect(productionLineColumn.editable).toBe(true);
    });

    it('should include a column for materialNumber with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const materialNumberColumn = columns.find(
        (col) => col.field === 'materialNumber'
      );

      expect(materialNumberColumn).toBeDefined();
      expect(materialNumberColumn.headerName).toBe(
        'alert_rules.multi_modal.material'
      );
      expect(materialNumberColumn.editable).toBe(true);
    });

    it('should include a column for threshold1 with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const threshold1Column = columns.find(
        (col) => col.field === 'threshold1'
      );

      expect(threshold1Column).toBeDefined();
      expect(threshold1Column.headerName).toBe('rules.threshold1');
      expect(threshold1Column.editable).toBe(true);
    });

    it('should include a column for threshold2 with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const threshold2Column = columns.find(
        (col) => col.field === 'threshold2'
      );

      expect(threshold2Column).toBeDefined();
      expect(threshold2Column.headerName).toBe('rules.threshold2');
      expect(threshold2Column.editable).toBe(true);
    });

    it('should include a column for threshold3 with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const threshold3Column = columns.find(
        (col) => col.field === 'threshold3'
      );

      expect(threshold3Column).toBeDefined();
      expect(threshold3Column.headerName).toBe('rules.threshold3');
      expect(threshold3Column.editable).toBe(true);
    });

    it('should include a column for startDate with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const startDateColumn = columns.find((col) => col.field === 'startDate');

      expect(startDateColumn).toBeDefined();
      expect(startDateColumn.headerName).toBe(
        'alert_rules.edit_modal.label.start'
      );
      expect(startDateColumn.editable).toBe(true);
    });

    it('should include a column for execInterval with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const execIntervalColumn = columns.find(
        (col) => col.field === 'execInterval'
      );

      expect(execIntervalColumn).toBeDefined();
      expect(execIntervalColumn.headerName).toBe(
        'alert_rules.edit_modal.label.interval.rootString'
      );
      expect(execIntervalColumn.editable).toBe(true);
    });

    it('should include a column for execDay with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const execDayColumn = columns.find((col) => col.field === 'execDay');

      expect(execDayColumn).toBeDefined();
      expect(execDayColumn.headerName).toBe(
        'alert_rules.edit_modal.label.when.rootString'
      );
      expect(execDayColumn.editable).toBe(true);
    });

    it('should include a column for endDate with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const endDateColumn = columns.find((col) => col.field === 'endDate');

      expect(endDateColumn).toBeDefined();
      expect(endDateColumn.headerName).toBe('alert_rules.edit_modal.label.end');
      expect(endDateColumn.editable).toBe(true);
    });

    it('should include a column for alertComment with correct properties', () => {
      const columns = component['getMultiAlertRuleModalColumns'](options);
      const alertCommentColumn = columns.find(
        (col) => col.field === 'alertComment'
      );

      expect(alertCommentColumn).toBeDefined();
      expect(alertCommentColumn.headerName).toBe(
        'alert_rules.edit_modal.label.remark'
      );
      expect(alertCommentColumn.editable).toBe(true);
    });
  });
});
