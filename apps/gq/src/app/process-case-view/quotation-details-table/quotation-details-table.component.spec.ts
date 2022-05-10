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
  getSelectedQuotationDetailIds,
  removeSimulatedQuotationDetail,
  resetSimulatedQuotation,
} from '../../core/store';
import { PriceSourceOptions } from '../../shared/ag-grid/column-headers/editable-column-header/models/price-source-options.enum';
import { ColumnFields } from '../../shared/ag-grid/constants/column-fields.enum';
import { CustomStatusBarModule } from '../../shared/ag-grid/custom-status-bar/custom-status-bar.module';
import { DeleteItemsButtonComponent } from '../../shared/ag-grid/custom-status-bar/delete-items-button/delete-items-button.component';
import { QuotationDetailsStatusComponent } from '../../shared/ag-grid/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { Quotation } from '../../shared/models';
import {
  PriceSource,
  QuotationDetail,
  SapPriceCondition,
} from '../../shared/models/quotation-detail';
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

    test('should take selected cases from the store', () => {
      expect(component.selectedQuotationIds).toEqual([]);

      store.overrideSelector(getSelectedQuotationDetailIds, ['1234']);
      component.ngOnInit();

      expect(component.selectedQuotationIds).toEqual(['1234']);
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
    const filterModels = {
      quotationItemId: { filterType: 'set', values: ['20'] },
    };
    beforeEach(() => {
      event = {
        columnApi: {
          getColumnState: jest.fn(),
        },
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
          getFilterModel: jest.fn(() => filterModels),
        },
      } as any;

      component['agGridStateService'].setColumnData = jest.fn();
      component['agGridStateService'].setColumnState = jest.fn();
      component['agGridStateService'].setColumnFilters = jest.fn();
    });

    test('should set column state and column filters', () => {
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnState
      ).toHaveBeenCalledTimes(1);
      expect(event.api.getFilterModel).toHaveBeenCalledTimes(1);
      expect(
        component['agGridStateService'].setColumnFilters
      ).toHaveBeenCalledTimes(1);
      expect(
        component['agGridStateService'].setColumnFilters
      ).toHaveBeenCalledWith(MOCK_QUOTATION_ID.toString(), filterModels);
    });

    test('should set column data', () => {
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
          forEachNode: jest.fn(),
          setFilterModel: jest.fn(),
        },
      } as any;

      component['agGridStateService'].getColumnState = jest.fn();
      component['agGridStateService'].getColumnData = jest.fn();
      component['agGridStateService'].setColumnData = jest.fn();
      component['agGridStateService'].setColumnFilters = jest.fn();
      component['agGridStateService'].getColumnFilters = jest.fn();
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
    test('should set filterModel', () => {
      const filterModels = {
        quotationItemId: { filterType: 'set', values: ['20'] },
      };
      component['agGridStateService'].getColumnFilters = jest.fn(
        () => filterModels
      );

      component.onGridReady(mockEvent);
      expect(mockEvent.api.setFilterModel).toHaveBeenCalledTimes(1);
    });

    test("should not set filterModel if it doesn't exist", () => {
      component.onGridReady(mockEvent);
      expect(mockEvent.api.setFilterModel).toHaveBeenCalledTimes(0);
    });

    test('should select rows from state', () => {
      const nodes = [
        { data: { gqPositionId: '1234' }, setSelected: jest.fn() } as any,
        { data: { gqPositionId: '5678' }, setSelected: jest.fn() } as any,
      ];
      mockEvent = {
        api: {
          forEachNode: (callback: (row: RowNode) => void) =>
            nodes.forEach((element) => {
              callback(element);
            }),
          forEachNodeAfterFilterAndSort: jest.fn(),
        },
      } as any;

      component.selectedQuotationIds = ['1234'];
      component.onGridReady(mockEvent);

      expect(nodes[0].setSelected).toHaveBeenCalledWith(true);
      expect(nodes[1].setSelected).not.toHaveBeenCalled();
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
          getFilterModel: jest.fn(),
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
            priceSource: PriceSource.MANUAL,
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
          data: QUOTATION_DETAIL_MOCK,
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
            priceSource: PriceSource.MANUAL,
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
        node: {
          isSelected: jest.fn().mockReturnValue(false),
          data: QUOTATION_DETAIL_MOCK,
        },
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

    test('should call onPriceSourceSimulation', () => {
      component.onPriceSourceSimulation = jest.fn();
      component['simulateMaterial'] = jest.fn();
      component.simulatedPriceSource = PriceSourceOptions.GQ;

      component.onRowSelected({
        node: {
          isSelected: jest.fn().mockReturnValue(false),
          data: QUOTATION_DETAIL_MOCK,
        },
        api: {
          getSelectedNodes: jest.fn().mockReturnValue([]),
        },
      } as any);

      expect(component.onPriceSourceSimulation).toHaveBeenCalledTimes(1);
      expect(component['simulateMaterial']).toHaveBeenCalledTimes(0);
      expect(store.dispatch).toHaveBeenCalledWith({
        type: resetSimulatedQuotation.type,
      });
    });

    test('should dispatch row selected', () => {
      store.dispatch = jest.fn();
      component.onRowSelected({
        node: { isSelected: () => true, data: { gqPositionId: '1234' } },
        api: {
          getSelectedNodes: jest.fn().mockReturnValue([]),
        },
      } as any);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqPositionId: '1234',
        type: '[Process Case] Select a Quotation Detail',
      });
    });

    test('should dispatch row deselected', () => {
      store.dispatch = jest.fn();
      component.onRowSelected({
        node: { isSelected: () => false, data: { gqPositionId: '1234' } },
        api: {
          getSelectedNodes: jest.fn().mockReturnValue([]),
        },
      } as any);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqPositionId: '1234',
        type: '[Process Case] Deselect a Quotation Detail',
      });
    });
  });

  describe('onPriceSourceSimulation', () => {
    describe('should return input selectedRow', () => {
      test('should dispatch addSimulatedQuotationAction if target and detail price source is GQ', () => {
        component.selectedRows = [{ data: QUOTATION_DETAIL_MOCK } as RowNode];

        component.onPriceSourceSimulation(PriceSourceOptions.GQ);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
          gqId: MOCK_QUOTATION_ID,
          quotationDetails: [],
          type: addSimulatedQuotation.type,
        });
      });
      test('should dispatch addSimulatedQuotationAction if target and detail price source is Strategic', () => {
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          recommendedPrice: undefined as any,
          strategicPrice: 20,
          priceSource: PriceSource.STRATEGIC,
        };
        component.selectedRows = [{ data: detail } as RowNode];

        component.onPriceSourceSimulation(PriceSourceOptions.GQ);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
          gqId: MOCK_QUOTATION_ID,
          quotationDetails: [],
          type: addSimulatedQuotation.type,
        });
      });
      test('should dispatch addSimulatedQuotationAction if target and detail price source is sap standard', () => {
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          priceSource: PriceSource.SAP_STANDARD,
        };
        component.selectedRows = [{ data: detail } as RowNode];

        component.onPriceSourceSimulation(PriceSourceOptions.SAP);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
          gqId: MOCK_QUOTATION_ID,
          quotationDetails: [],
          type: addSimulatedQuotation.type,
        });
      });
      test('should dispatch addSimulatedQuotationAction if target and detail price source is sap special', () => {
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          sapPriceCondition: SapPriceCondition.SPECIAL_ZP17,
          priceSource: PriceSource.SAP_SPECIAL,
        };
        component.selectedRows = [{ data: detail } as RowNode];

        component.onPriceSourceSimulation(PriceSourceOptions.SAP);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
          gqId: MOCK_QUOTATION_ID,
          quotationDetails: [],
          type: addSimulatedQuotation.type,
        });
      });
      test('should dispatch addSimulatedQuotationAction if target is GQ and no GQ price exists', () => {
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          strategicPrice: undefined,
          recommendedPrice: undefined,
          priceSource: PriceSource.MANUAL,
        };
        component.selectedRows = [{ data: detail } as RowNode];

        component.onPriceSourceSimulation(PriceSourceOptions.GQ);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
          gqId: MOCK_QUOTATION_ID,
          quotationDetails: [],
          type: addSimulatedQuotation.type,
        });
      });
      test('should dispatch addSimulatedQuotationAction if target is SAP and no SAP price exists', () => {
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          priceSource: PriceSource.MANUAL,
          sapPriceCondition: undefined,
        };
        component.selectedRows = [{ data: detail } as RowNode];

        component.onPriceSourceSimulation(PriceSourceOptions.SAP);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
          gqId: MOCK_QUOTATION_ID,
          quotationDetails: [],
          type: addSimulatedQuotation.type,
        });
      });
    });
    describe('should simulate with new price source', () => {
      test('should dispatch addSimulatedQuotationAction for new sap standard price', () => {
        component.selectedRows = [{ data: QUOTATION_DETAIL_MOCK } as RowNode];

        component.onPriceSourceSimulation(PriceSourceOptions.SAP);

        const expectedDetail = {
          ...QUOTATION_DETAIL_MOCK,
          rlm: 69.38,
          price: 80,
          priceDiff: -52.94,
          priceSource: PriceSource.SAP_STANDARD,
          netValue: 800,
          gpi: 75,
          gpm: 62.5,
          discount: 20,
        };
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
          gqId: MOCK_QUOTATION_ID,
          quotationDetails: [expectedDetail],
          type: addSimulatedQuotation.type,
        });
      });
      test('should dispatch addSimulatedQuotationAction for new sap special price', () => {
        component.selectedRows = [
          {
            data: {
              ...QUOTATION_DETAIL_MOCK,
              sapPriceCondition: SapPriceCondition.SPECIAL_ZP17,
            },
          } as RowNode,
        ];

        component.onPriceSourceSimulation(PriceSourceOptions.SAP);

        const expectedDetail = {
          ...QUOTATION_DETAIL_MOCK,
          rlm: 69.38,
          price: 80,
          priceDiff: -52.94,
          priceSource: PriceSource.SAP_SPECIAL,
          netValue: 800,
          gpi: 75,
          gpm: 62.5,
          discount: 20,
          sapPriceCondition: SapPriceCondition.SPECIAL_ZP17,
        };
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
          gqId: MOCK_QUOTATION_ID,
          quotationDetails: [expectedDetail],
          type: addSimulatedQuotation.type,
        });
      });
      test('should dispatch addSimulatedQuotationAction for gq price', () => {
        component.selectedRows = [
          {
            data: {
              ...QUOTATION_DETAIL_MOCK,
              priceSource: PriceSource.SAP_SPECIAL,
            },
          } as RowNode,
        ];

        component.onPriceSourceSimulation(PriceSourceOptions.GQ);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
          gqId: MOCK_QUOTATION_ID,
          quotationDetails: [
            {
              ...QUOTATION_DETAIL_MOCK,
              netValue: 2500,
              gpi: 92,
              gpm: 88,
              discount: -150,
              price: QUOTATION_DETAIL_MOCK.recommendedPrice,
              priceDiff: 47.06,
              rlm: 90.2,
            },
          ],
          type: addSimulatedQuotation.type,
        });
      });
      test('should dispatch addSimulatedQuotationAction for strategic price', () => {
        component.selectedRows = [
          {
            data: {
              ...QUOTATION_DETAIL_MOCK,
              strategicPrice: 250,
              recommendedPrice: undefined,
              priceSource: PriceSource.SAP_SPECIAL,
            },
          } as RowNode,
        ];

        component.onPriceSourceSimulation(PriceSourceOptions.GQ);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
          gqId: MOCK_QUOTATION_ID,
          quotationDetails: [
            {
              ...QUOTATION_DETAIL_MOCK,
              strategicPrice: 250,
              recommendedPrice: undefined,
              priceSource: PriceSource.STRATEGIC,
              netValue: 2500,
              gpi: 92,
              gpm: 88,
              discount: -150,
              price: 250,
              priceDiff: 47.06,
              rlm: 90.2,
            },
          ],
          type: addSimulatedQuotation.type,
        });
      });
    });
  });
});
