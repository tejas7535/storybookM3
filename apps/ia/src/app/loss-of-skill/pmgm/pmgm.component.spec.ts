import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import {
  GridApi,
  GridReadyEvent,
  RowDataUpdatedEvent,
  RowNode,
  ValueGetterParams,
} from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FluctuationType } from '../../shared/tables/employee-list-table/models';
import { PmgmAssessment, PmgmData } from '../models';
import { PmgmComponent } from './pmgm.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((key: string) => {
    switch (key) {
      case 'lossOfSkill.pmgm.table.tooltip.position.manager': {
        return 'Manager';
      }
      case 'lossOfSkill.pmgm.table.tooltip.position.employee': {
        return 'Employee';
      }
      case 'shared.yes': {
        return 'Yes';
      }
      case 'shared.no': {
        return 'No';
      }
      default: {
        return '';
      }
    }
  }),
}));

describe('PmgmComponent', () => {
  let component: PmgmComponent;
  let spectator: Spectator<PmgmComponent>;

  const createComponent = createComponentFactory({
    component: PmgmComponent,
    detectChanges: false,
    imports: [
      provideTranslocoTestingModule({
        en: {},
      }),
      AgGridModule,
    ],
    declarations: [PmgmComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('enoughRightsToShowAllEmployees', () => {
    test('should be false as default', () => {
      expect(component.enoughRightsToShowAllEmployees).toBeFalsy();
    });
  });

  describe('columnDefs', () => {
    test('should return columnDefs', () => {
      expect(component.columnDefs[0].field).toEqual('employee');
      expect(component.columnDefs[1].field).toEqual('position');
      expect(component.columnDefs[2].field).toEqual('managerChange');
      expect(component.columnDefs[3].field).toEqual('fluctuationType');
      expect(component.columnDefs[4].field).toEqual('overallPerformanceRating');
      expect(component.columnDefs[5].field).toEqual(
        'overallPerformanceRatingChange'
      );
      expect(component.columnDefs[6].field).toEqual('highRiskOfLoss');
      expect(component.columnDefs[7].field).toEqual('highRiskOfLossChange');
      expect(component.columnDefs[8].field).toEqual('assessment');
    });

    test('should hide highRiskOfLossChange columns', () => {
      expect(component.columnDefs[7].field).toEqual('highRiskOfLossChange');
      expect(component.columnDefs[7].hide).toBeTruthy();
    });
  });

  describe('data', () => {
    beforeEach(() => {
      component.gridApi = {
        updateGridOptions: jest.fn(),
        hideOverlay: jest.fn(),
        showLoadingOverlay: jest.fn(),
      } as unknown as GridApi<PmgmData>;
    });

    test('should set data', () => {
      component.data = [];
      expect(component.data).not.toBeUndefined();
    });

    test('should set row data and hide loading overlay when data is defined', () => {
      const data: PmgmData[] = [];

      component.data = data;

      expect(component.gridApi.updateGridOptions).toHaveBeenCalledWith({
        rowData: data,
      });
      expect(component.gridApi.hideOverlay).toHaveBeenCalled();
    });

    test('should set row data and show loading overlay when data is undefined', () => {
      const data = undefined as unknown as PmgmData[];

      component.data = data;

      expect(component.gridApi.updateGridOptions).toHaveBeenCalledWith({
        rowData: data,
      });
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalled();
    });
  });

  describe('onGridReady', () => {
    let event: GridReadyEvent;
    let model: { getRowCount: jest.Mock };

    beforeEach(() => {
      event = {
        api: {
          getModel: () => model,
          updateGridOptions: jest.fn(),
        } as unknown as GridApi,
      } as GridReadyEvent;
      model = {
        getRowCount: jest.fn(),
      };
    });

    test('should set gridApi', () => {
      component.onGridReady(event);

      expect(component.gridApi).toEqual(event.api);
    });

    test('should set row data when data is defined and row count is 0', () => {
      component.data = [{} as PmgmData];
      model.getRowCount = jest.fn(() => 0);

      component.onGridReady(event);

      expect(component.gridApi.getModel().getRowCount).toHaveBeenCalled();
      expect(component.gridApi.updateGridOptions).toHaveBeenCalledWith({
        rowData: component.data,
      });
    });

    test('should not set row data when data is defined and row count is not 0', () => {
      component.data = [{} as PmgmData];
      model.getRowCount = jest.fn(() => 1);

      component.onGridReady(event);

      expect(component.gridApi.getModel().getRowCount).toHaveBeenCalled();
      expect(component.gridApi.updateGridOptions).not.toHaveBeenCalled();
    });
  });

  describe('positionValueGetter', () => {
    test('should return manager', () => {
      const params = {
        data: {
          isManager: true,
        } as PmgmData,
      } as ValueGetterParams;

      expect(component.positionValueGetter(params)).toEqual('Manager');
    });

    test('should return employee', () => {
      const params = {
        data: {
          manager: false,
        },
      } as ValueGetterParams;

      expect(component.positionValueGetter(params)).toEqual('Employee');
    });
  });

  describe('yesNoBooleanConverter', () => {
    test('should return Yes', () => {
      expect(component.yesNoBooleanConverter(true)).toEqual('Yes');
    });

    test('should return No', () => {
      expect(component.yesNoBooleanConverter(false)).toEqual('No');
    });

    test('should return empty string', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(component.yesNoBooleanConverter(null as boolean)).toEqual('');
    });
  });

  describe('onRowDataUpdated', () => {
    test('should select rows with fluctuation type assigned', () => {
      const leaver = {
        data: { fluctuationType: FluctuationType.REMAINING },
        setSelected: jest.fn(),
      };
      const employee = {
        data: { fluctuationType: undefined as FluctuationType },
        setSelected: jest.fn(),
      };
      const params = {
        api: {
          forEachNode: (callback: (row: RowNode) => void) =>
            [leaver, employee].forEach((element) => {
              callback(element as unknown as RowNode);
            }),
        },
      };

      component.onRowDataUpdated(params as unknown as RowDataUpdatedEvent);

      expect(leaver.setSelected).toHaveBeenCalledWith(true);
      expect(employee.setSelected).not.toHaveBeenCalled();
    });
  });

  describe('pmgmAssesmentSortComparator', () => {
    test('should return -1', () => {
      expect(
        component.pmgmAssesmentSortComparator(
          PmgmAssessment.GREEN,
          PmgmAssessment.YELLOW,
          undefined,
          undefined,
          false
        )
      ).toEqual(1);
    });

    test('should return 1', () => {
      expect(
        component.pmgmAssesmentSortComparator(
          PmgmAssessment.YELLOW,
          PmgmAssessment.GREEN,
          undefined,
          undefined,
          false
        )
      ).toEqual(-1);
    });

    test('should return 0', () => {
      expect(
        component.pmgmAssesmentSortComparator(
          PmgmAssessment.GREEN,
          PmgmAssessment.GREEN,
          undefined,
          undefined,
          false
        )
      ).toEqual(0);
    });
  });
});
