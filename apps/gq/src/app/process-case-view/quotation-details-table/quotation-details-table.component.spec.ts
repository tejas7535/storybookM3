import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridEvent, RowNode } from '@ag-grid-community/all-modules';
import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../testing/mocks';
import {
  addSimulatedQuotation,
  removeSimulatedQuotationDetail,
  resetSimulatedQuotation,
} from '../../core/store';
import { ColumnFields } from '../../shared/ag-grid/constants/column-fields.enum';
import { CustomStatusBarModule } from '../../shared/custom-status-bar/custom-status-bar.module';
import { DeleteItemsButtonComponent } from '../../shared/custom-status-bar/delete-items-button/delete-items-button.component';
import { QuotationDetailsStatusComponent } from '../../shared/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { Quotation } from '../../shared/models';
import { QuotationDetail } from '../../shared/models/quotation-detail';
import { QuotationDetailsTableComponent } from './quotation-details-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('QuotationDetailsTableComponent', () => {
  let component: QuotationDetailsTableComponent;
  let spectator: Spectator<QuotationDetailsTableComponent>;
  let store: MockStore;
  const MOCK_QUOTATION_ID = 1234;

  const createComponent = createComponentFactory({
    component: QuotationDetailsTableComponent,
    declarations: [QuotationDetailsTableComponent],
    detectChanges: false,
    imports: [
      AgGridModule.withComponents([
        QuotationDetailsStatusComponent,
        DeleteItemsButtonComponent,
      ]),
      CustomStatusBarModule,
      MatDialogModule,
      ReactiveComponentModule,
      RouterTestingModule,
      MatSnackBarModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.quotation = { gqId: MOCK_QUOTATION_ID } as Quotation;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set columnDefs', () => {
      component.ngOnInit();

      expect(component.columnDefs$).toBeDefined();
    });
  });

  describe('set quotation', () => {
    test('should set rowData and tableContext.currency', () => {
      component.quotation = QUOTATION_MOCK;

      expect(component.rowData).toEqual(QUOTATION_MOCK.quotationDetails);
      expect(component.tableContext.quotation.currency).toEqual(
        QUOTATION_MOCK.currency
      );
    });
  });

  describe('columnChange', () => {
    let event: any;

    beforeEach(() => {
      event = {
        columnApi: {
          getColumnState: jest.fn(),
        },
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
        },
      } as any;

      component['agGridStateService'].setColumnData = jest.fn();
      component['agGridStateService'].setColumnState = jest.fn();
    });

    test('should set column state', () => {
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnState
      ).toHaveBeenCalledTimes(1);
    });

    test('should set column data', () => {
      component['agGridStateService'].setColumnState = jest.fn();
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnData
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('onGridReady', () => {
    let mockEvent: AgGridEvent;

    beforeEach(() => {
      mockEvent = {
        columnApi: {
          setColumnState: jest.fn(),
        },
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
        },
      } as any;

      component['agGridStateService'].getColumnState = jest.fn();
      component['agGridStateService'].getColumnData = jest.fn();
      component['agGridStateService'].setColumnData = jest.fn();
    });

    test('should set columnState', () => {
      component['agGridStateService'].getColumnState = jest
        .fn()
        .mockReturnValue('state');
      component.onGridReady(mockEvent);

      expect(
        component['agGridStateService'].getColumnState
      ).toHaveBeenCalledTimes(1);
      expect(mockEvent.columnApi.setColumnState).toHaveBeenCalledTimes(1);
    });

    test('should not set columnState', () => {
      component.onGridReady(mockEvent);

      expect(
        component['agGridStateService'].getColumnState
      ).toHaveBeenCalledTimes(1);
      expect(mockEvent.columnApi.setColumnState).toHaveBeenCalledTimes(0);
    });

    test("should set column data if it doesn't exist", () => {
      component['agGridStateService'].getColumnData = jest
        .fn()
        .mockImplementation(() => {});
      component.onGridReady(mockEvent);

      expect(
        component['agGridStateService'].setColumnData
      ).toHaveBeenCalledTimes(1);
    });

    test('should NOT set column data if already exist', () => {
      component['agGridStateService'].getColumnData = jest
        .fn()
        .mockImplementation(() => [
          {
            gqPositionId: '123',
            quotationItemId: '456',
          },
        ]);
      component.onGridReady(mockEvent);

      expect(
        component['agGridStateService'].setColumnData
      ).toHaveBeenCalledTimes(0);
    });
  });

  describe('onFirstDataRenderer', () => {
    test('should call autoSizeAllColumns', () => {
      const params = {
        columnApi: {
          autoSizeAllColumns: jest.fn(),
        },
      } as any;

      component.onFirstDataRendered(params);

      expect(params.columnApi.autoSizeAllColumns).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateColumnData', () => {
    test('should call agGridService with quotation details', () => {
      component['agGridStateService'].setColumnData = jest.fn();

      component.updateColumnData({
        columnApi: {
          setColumnState: jest.fn(),
        },
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
        },
      } as any);

      expect(
        component['agGridStateService'].setColumnData
      ).toHaveBeenCalledWith(MOCK_QUOTATION_ID.toString(), []);
    });

    test('should be called onColumnChange', () => {
      component.updateColumnData = jest.fn();

      component.onColumnChange({
        columnApi: {
          setColumnState: jest.fn(),
          getColumnState: jest.fn(),
        },
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
        },
      } as any);

      expect(component.updateColumnData).toHaveBeenCalled();
    });
  });

  describe('onRowDataChanged', () => {
    const mockEvent = {
      api: {
        selectIndex: jest.fn(),
      },
      columnApi: jest.fn(),
      type: '',
    };

    beforeEach(() => {
      component.updateColumnData = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should update column data', () => {
      component.selectedRows = [];

      component.onRowDataChanged(mockEvent as any);

      expect(component.updateColumnData).toHaveBeenCalledWith(mockEvent);
    });

    test('should re-select rows', () => {
      component.selectedRows = [
        { rowIndex: 21, data: { gqPositionId: '123' } },
      ] as any;

      component.onRowDataChanged(mockEvent as any);

      expect(mockEvent.api.selectIndex).toHaveBeenCalledWith(21, true, true);
    });

    test('should NOT re-select rows if no rows had been selected', () => {
      component.selectedRows = [];

      component.onRowDataChanged(mockEvent as any);

      expect(mockEvent.api.selectIndex).not.toHaveBeenCalled();
    });
  });

  describe('onMultipleMaterialSimulation', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should set simulated field and value', () => {
      component.onMultipleMaterialSimulation(ColumnFields.PRICE, 25);
      component.tableContext.quotation = { gqId: 1234 } as Quotation;

      expect(component.simulatedField).toEqual('price');
      expect(component.simulatedValue).toEqual(25);
    });

    test('should simulate if all values are valid', () => {
      const mockQuotationDetail: QuotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        price: 100,
        discount: 0,
        gpi: 10,
        gpm: 10,
        priceDiff: 10,
      };
      component.selectedRows = [
        { data: mockQuotationDetail, rowIndex: 0, id: '111' } as RowNode,
      ];
      component.onMultipleMaterialSimulation(ColumnFields.PRICE, 50);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqId: MOCK_QUOTATION_ID,
        quotationDetails: [
          {
            ...mockQuotationDetail,
            price: 150,
            discount: -50,
            gpi: 86.67,
            gpm: 80,
            priceDiff: -11.76,
            rlm: 83.67,
            netValue: 1500,
          },
        ],
        type: addSimulatedQuotation.type,
      });
    });

    test('should NOT simulate Discount if there is no sapGrossPrice', () => {
      const mockQuotationDetail: QuotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        sapGrossPrice: undefined,
        price: 100,
        discount: 0,
        gpi: 10,
        gpm: 10,
      };
      component.selectedRows = [
        { data: mockQuotationDetail, rowIndex: 0, id: '111' } as RowNode,
      ];

      component.onMultipleMaterialSimulation(ColumnFields.DISCOUNT, 50);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqId: MOCK_QUOTATION_ID,
        quotationDetails: [mockQuotationDetail],
        type: addSimulatedQuotation.type,
      });
    });

    test('should NOT simulate GPI if there is no gpc', () => {
      const mockQuotationDetail: QuotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        gpc: undefined,
        price: 100,
        discount: 0,
        gpi: 10,
        gpm: 10,
      };
      component.selectedRows = [
        { data: mockQuotationDetail, rowIndex: 0, id: '111' } as RowNode,
      ];

      component.onMultipleMaterialSimulation(ColumnFields.GPI, 50);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqId: MOCK_QUOTATION_ID,
        quotationDetails: [mockQuotationDetail],
        type: addSimulatedQuotation.type,
      });
    });

    test('should NOT simulate GPM if there is no sqv', () => {
      const mockQuotationDetail: QuotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        sqv: undefined,
        price: 100,
        discount: 0,
        gpi: 10,
        gpm: 10,
      };
      component.selectedRows = [
        { data: mockQuotationDetail, rowIndex: 0, id: '111' } as RowNode,
      ];

      component.onMultipleMaterialSimulation(ColumnFields.GPM, 50);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqId: MOCK_QUOTATION_ID,
        quotationDetails: [mockQuotationDetail],
        type: addSimulatedQuotation.type,
      });
    });
  });

  describe('onRowSelected', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should add newly selected row to simulation', () => {
      const mockQuotationDetail: QuotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        price: 100,
        discount: 0,
        gpi: 10,
        gpm: 10,
        priceDiff: 10,
      };
      component.simulatedField = ColumnFields.PRICE;
      component.simulatedValue = 50;
      component.onRowSelected({
        api: {
          getSelectedNodes: jest
            .fn()
            .mockReturnValue([
              { data: mockQuotationDetail, rowIndex: 0, id: '111' } as RowNode,
            ]),
        },
        node: {
          isSelected: jest.fn().mockReturnValue(true),
        },
      } as any);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqId: MOCK_QUOTATION_ID,
        quotationDetails: [
          {
            ...mockQuotationDetail,
            price: 150,
            discount: -50,
            gpi: 86.67,
            gpm: 80,
            priceDiff: -11.76,
            rlm: 83.67,
            netValue: 1500,
          },
        ],
        type: addSimulatedQuotation.type,
      });
    });

    test('should remove de-selected row from simulation', () => {
      component.simulatedField = ColumnFields.PRICE;
      component.simulatedValue = 50;
      component.onRowSelected({
        node: {
          isSelected: jest.fn().mockReturnValue(false),
          data: QUOTATION_DETAIL_MOCK,
        },
        api: {
          getSelectedNodes: jest.fn().mockReturnValue([
            {
              data: QUOTATION_DETAIL_MOCK,
              rowIndex: 0,
              id: '111',
            } as RowNode,
          ]),
        },
      } as any);

      expect(store.dispatch).toHaveBeenCalledWith({
        type: removeSimulatedQuotationDetail.type,
        gqPositionId: '5694232',
      });
    });

    test('should reset simulation after all rows are deselected', () => {
      component.onRowSelected({
        api: {
          getSelectedNodes: jest.fn().mockReturnValue([]),
        },
      } as any);

      expect(component.simulatedField).toEqual(undefined);
      expect(component.simulatedValue).toEqual(undefined);
      expect(store.dispatch).toHaveBeenCalledWith({
        type: resetSimulatedQuotation.type,
      });
    });
  });
});
