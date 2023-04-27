import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  addSimulatedQuotation,
  removeSimulatedQuotationDetail,
  resetSimulatedQuotation,
} from '@gq/core/store/actions';
import { getSelectedQuotationDetailIds } from '@gq/core/store/selectors';
import {
  ColumnDefService,
  LocalizationService,
} from '@gq/shared/ag-grid/services';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import {
  AgGridEvent,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  GridReadyEvent,
  RowNode,
} from 'ag-grid-community';
import { MockProvider } from 'ng-mocks';

import {
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../testing/mocks';
import { AppRoutePath } from '../../app-route-path.enum';
import { PriceSourceOptions } from '../../shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '../../shared/ag-grid/constants/column-fields.enum';
import { ColumnUtilityService } from '../../shared/ag-grid/services/column-utility.service';
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
  let router: Router;

  const MOCK_QUOTATION_ID = 1234;

  const createComponent = createComponentFactory({
    component: QuotationDetailsTableComponent,
    declarations: [QuotationDetailsTableComponent],
    detectChanges: false,
    imports: [AgGridModule, PushModule, RouterTestingModule],
    providers: [
      MockProvider(ColumnDefService),
      MockProvider(LocalizationService),
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

    router = spectator.inject(Router);
    router.navigate = jest.fn();
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
      component['agGridStateService'].setColumnStateForCurrentView = jest.fn();
      component['agGridStateService'].setColumnFilterForCurrentView = jest.fn();
    });

    test('should set column state', () => {
      component['agGridStateService'].getCurrentViewId = jest
        .fn()
        .mockReturnValue(1);

      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnStateForCurrentView
      ).toHaveBeenCalledTimes(1);
    });

    test('should set column filters', () => {
      component['agGridStateService'].getCurrentViewId = jest
        .fn()
        .mockReturnValue(1);

      component.onFilterChanged(event);

      expect(event.api.getFilterModel).toHaveBeenCalledTimes(1);
      expect(
        component['agGridStateService'].setColumnFilterForCurrentView
      ).toHaveBeenCalledTimes(1);
      expect(
        component['agGridStateService'].setColumnFilterForCurrentView
      ).toHaveBeenCalledWith(MOCK_QUOTATION_ID.toString(), filterModels);
    });

    test('should NOT set column state for default column', () => {
      component['agGridStateService'].getCurrentViewId = jest
        .fn()
        .mockReturnValue(0);

      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnStateForCurrentView
      ).toHaveBeenCalledTimes(0);
    });

    test('should NOT set column filters for default column', () => {
      component['agGridStateService'].getCurrentViewId = jest
        .fn()
        .mockReturnValue(0);

      component.onFilterChanged(event);

      expect(
        component['agGridStateService'].setColumnFilterForCurrentView
      ).toHaveBeenCalledTimes(0);
    });

    test('should set column data', () => {
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnData
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('onGridReady', () => {
    let mockEvent: AgGridEvent<GridReadyEvent>;

    beforeEach(() => {
      mockEvent = {
        columnApi: {
          resetColumnState: jest.fn(),
          applyColumnState: jest.fn(),
        },
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
          forEachNode: jest.fn(),
          setFilterModel: jest.fn(),
        },
      } as any;

      component['agGridStateService'].getColumnStateForCurrentView = jest.fn();
      component['agGridStateService'].getColumnData = jest.fn();
      component['agGridStateService'].setColumnData = jest.fn();
      component['agGridStateService'].setColumnFilterForCurrentView = jest.fn();
      component['agGridStateService'].getColumnFiltersForCurrentView =
        jest.fn();
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
      component.onGridReady = jest.fn();
      const params = {
        columnApi: {
          getAllGridColumns: jest.fn(() => [
            { getColId: jest.fn(() => ColumnFields.NET_VALUE) },
            { getColId: jest.fn(() => ColumnFields.RECOMMENDED_PRICE) },
          ]),
          setFilterModel: jest.fn(),
          resetColumnState: jest.fn(),
          autoSizeColumn: jest.fn(),
        },
      } as any;

      component.onFirstDataRendered(params);

      expect(params.columnApi.getAllGridColumns).toHaveBeenCalledTimes(1);
      expect(params.columnApi.autoSizeColumn).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateColumnData', () => {
    test('should call agGridService with quotation details', () => {
      component['agGridStateService'].setColumnData = jest.fn();

      component.updateColumnData({
        columnApi: { resetColumnState: jest.fn(), applyColumnState: jest.fn() },
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
        },
      } as any);

      expect(
        component['agGridStateService'].setColumnData
      ).toHaveBeenCalledWith(MOCK_QUOTATION_ID.toString(), []);
    });

    test('should be called onColumnChange', () => {
      component['agGridStateService'].setColumnStateForCurrentView = jest.fn();
      component['agGridStateService'].setColumnFilterForCurrentView = jest.fn();
      component.updateColumnData = jest.fn();

      component.onColumnChange({
        columnApi: {
          applyColumnState: jest.fn(),
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

  describe('onRowDataUpdated', () => {
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

      component.onRowDataUpdated(mockEvent as any);

      expect(component.updateColumnData).toHaveBeenCalledWith(mockEvent);
    });

    test('should re-select rows', () => {
      component.selectedRows = [
        { rowIndex: 21, data: { gqPositionId: '123' } },
      ] as any;

      component.onRowDataUpdated(mockEvent as any);

      expect(mockEvent.api.selectIndex).toHaveBeenCalledWith(21, true, true);
    });

    test('should NOT re-select rows if no rows had been selected', () => {
      component.selectedRows = [];

      component.onRowDataUpdated(mockEvent as any);

      expect(mockEvent.api.selectIndex).not.toHaveBeenCalled();
    });
  });

  describe('onMultipleMaterialSimulation', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should set simulated field and value', () => {
      component.onMultipleMaterialSimulation(ColumnFields.PRICE, 25, false);
      component.tableContext.quotation = { gqId: 1234 } as Quotation;

      expect(component.simulatedField).toEqual('price');
      expect(component.simulatedValue).toEqual(25);
      expect(component.isInputInvalid).toEqual(false);
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
      component.onMultipleMaterialSimulation(ColumnFields.PRICE, 50, false);

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
      expect(component.isInputInvalid).toEqual(false);
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

      component.onMultipleMaterialSimulation(ColumnFields.DISCOUNT, 50, false);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqId: MOCK_QUOTATION_ID,
        quotationDetails: [mockQuotationDetail],
        type: addSimulatedQuotation.type,
      });
      expect(component.isInputInvalid).toEqual(false);
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

      component.onMultipleMaterialSimulation(ColumnFields.GPI, 50, false);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqId: MOCK_QUOTATION_ID,
        quotationDetails: [mockQuotationDetail],
        type: addSimulatedQuotation.type,
      });
      expect(component.isInputInvalid).toEqual(false);
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

      component.onMultipleMaterialSimulation(ColumnFields.GPM, 50, false);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqId: MOCK_QUOTATION_ID,
        quotationDetails: [mockQuotationDetail],
        type: addSimulatedQuotation.type,
      });
      expect(component.isInputInvalid).toEqual(false);
    });
    test('should not simulate on invalid input', () => {
      component.tableContext = { quotation: { gqId: 123 } } as any;
      component.onMultipleMaterialSimulation(ColumnFields.PRICE, 123, true);

      expect(store.dispatch).toHaveBeenCalledWith(
        addSimulatedQuotation({
          gqId: 123,
          quotationDetails: [],
        })
      );
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
      test('should dispatch addSimulatedQuotationAction if target and detail price source is cap_price', () => {
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          sapPriceCondition: SapPriceCondition.CAP_PRICE,
          priceSource: PriceSource.CAP_PRICE,
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
      test('should dispatch addSimulatedQuotationAction if target is TARGET_PRICE and no target price exists', () => {
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          sapPriceCondition: undefined,
          targetPrice: undefined,
        };
        component.selectedRows = [{ data: detail } as RowNode];

        component.onPriceSourceSimulation(PriceSourceOptions.TARGET_PRICE);

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
      test('should dispatch addSimulatedQuotationAction for new sap cap_price', () => {
        component.selectedRows = [
          {
            data: {
              ...QUOTATION_DETAIL_MOCK,
              sapPriceCondition: SapPriceCondition.CAP_PRICE,
            },
          } as RowNode,
        ];

        component.onPriceSourceSimulation(PriceSourceOptions.SAP);

        const expectedDetail = {
          ...QUOTATION_DETAIL_MOCK,
          rlm: 69.38,
          price: 80,
          priceDiff: -52.94,
          priceSource: PriceSource.CAP_PRICE,
          sapPriceCondition: SapPriceCondition.CAP_PRICE,
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
    test('should dispatch addSimulatedQuotationAction for target price', () => {
      component.selectedRows = [{ data: QUOTATION_DETAIL_MOCK } as RowNode];

      component.onPriceSourceSimulation(PriceSourceOptions.TARGET_PRICE);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith({
        gqId: MOCK_QUOTATION_ID,
        quotationDetails: [
          {
            ...QUOTATION_DETAIL_MOCK,
            price: 90.55,
            priceSource: PriceSource.TARGET_PRICE,
            netValue: 905.5,
            gpi: 77.91,
            gpm: 66.87,
            discount: 9.45,
            priceDiff: -46.74,
            rlm: 72.94,
          },
        ],
        type: addSimulatedQuotation.type,
      });
    });
  });

  describe('onRowDoubleClick', () => {
    test('should navigate on double click', () => {
      const mockEvent = {
        data: {
          gqPositionId: '1234',
        },
      } as any;
      component.onRowDoubleClicked(mockEvent);

      expect(router.navigate).toHaveBeenCalledWith(
        [AppRoutePath.DetailViewPath],
        {
          queryParamsHandling: 'merge',
          queryParams: {
            gqPositionId: mockEvent.data.gqPositionId,
          },
        }
      );
    });
  });
  describe('getMainMenuItems', () => {
    const params: GetMainMenuItemsParams = {
      defaultItems: ['item1', 'item2'],
    } as GetMainMenuItemsParams;

    test('it should add one more menuItem at the end of that array', () => {
      component.ngOnInit();
      ColumnUtilityService.getResetAllFilteredColumnsMenuItem = jest.fn(
        () => 'item3'
      );

      const result = component.getMainMenuItems(params);
      expect(result.length).toBe(3);
      expect(result[2]).toBe('item3');
      expect(
        ColumnUtilityService.getResetAllFilteredColumnsMenuItem
      ).toHaveBeenCalledWith(params);
    });
  });

  describe('getContextMenuItems', () => {
    let params: GetContextMenuItemsParams = {
      column: { getColId: jest.fn(() => 'anyColId') },
      defaultItems: ['item1', 'item2'],
    } as unknown as GetContextMenuItemsParams;

    beforeEach(() => {
      ColumnUtilityService.getCopyCellContentContextMenuItem = jest.fn(
        () => 'item3'
      );
      ColumnUtilityService.getOpenInNewTabContextMenuItem = jest.fn(
        () => 'tab'
      );
      ColumnUtilityService.getOpenInNewWindowContextMenuItem = jest.fn(
        () => 'window'
      );
    });
    test('should add item to context menu', () => {
      const result = component.getContextMenuItems(params);
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toBe('item3');
    });
    test('should NOT add hyperlink context MenuItems', () => {
      component.getContextMenuItems(params);
      expect(
        ColumnUtilityService.getOpenInNewTabContextMenuItem
      ).not.toHaveBeenCalled();
      expect(
        ColumnUtilityService.getOpenInNewWindowContextMenuItem
      ).not.toHaveBeenCalled();
    });
    test('should request hyperlink contextMenuItems', () => {
      params = {
        ...params,
        value: '12',
        column: {
          getColId: jest.fn(() => ColumnFields.SAP_PRICE),
        },
      } as unknown as GetContextMenuItemsParams;

      const result = component.getContextMenuItems(params);
      expect(
        ColumnUtilityService.getOpenInNewTabContextMenuItem
      ).toHaveBeenCalled();
      expect(
        ColumnUtilityService.getOpenInNewWindowContextMenuItem
      ).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.length).toBe(3);

      expect(result[0]).toBe('item3');
      expect(result[1]).toBe('tab');
      expect(result[2]).toBe('window');
    });

    test('should not add contextMenu when value of cell is undefined', () => {
      params = {
        ...params,
        column: {
          getColId: jest.fn(() => ColumnFields.SAP_PRICE),
        },
        value: undefined,
      } as unknown as GetContextMenuItemsParams;

      const result = component.getContextMenuItems(params);
      expect(result).toBeDefined();
      expect(result.length).toBe(1);

      expect(result[0]).toBe('item3');
    });
  });
});
