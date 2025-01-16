import { Router, RouterModule } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import {
  ColumnDefService,
  ColumnUtilityService,
  LocalizationService,
} from '@gq/shared/ag-grid/services';
import { Quotation } from '@gq/shared/models';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  GridReadyEvent,
  RowNode,
} from 'ag-grid-enterprise';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PROCESS_CASE_STATE_MOCK } from '../../../testing/mocks';
import { QUOTATION_MOCK } from '../../../testing/mocks/models/quotation';
import { QUOTATION_DETAIL_MOCK } from '../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { AppRoutePath } from '../../app-route-path.enum';
import { QuotationDetailsTableComponent } from './quotation-details-table.component';
import { PriceSimulationService } from './services/simulation/price-simulation.service';
import { PriceSourceSimulationService } from './services/simulation/price-source-simulation.service';

describe('QuotationDetailsTableComponent', () => {
  let component: QuotationDetailsTableComponent;
  let spectator: Spectator<QuotationDetailsTableComponent>;
  let store: MockStore;
  let router: Router;
  const isSapSyncPendingSubject$$: BehaviorSubject<boolean> =
    new BehaviorSubject(true);
  const MOCK_QUOTATION_ID = 1234;

  const createComponent = createComponentFactory({
    component: QuotationDetailsTableComponent,
    detectChanges: false,
    imports: [
      AgGridModule,
      PushPipe,
      RouterModule.forRoot([]),
      provideTranslocoTestingModule({ en: {} }),
    ],
    mocks: [PriceSimulationService, PriceSourceSimulationService],
    providers: [
      MockProvider(ColumnDefService),
      MockProvider(LocalizationService),
      mockProvider(TransformationService),
      MockProvider(ActiveCaseFacade, {
        quotationHasFNumberMaterials$: of(true),
        quotationHasRfqMaterials$: of(true),
        isSapSyncPending$: isSapSyncPendingSubject$$.asObservable(),
        selectedQuotationDetailIds$: of(['1234']),
        simulationModeEnabled$: of(false),
        selectQuotationDetail: jest.fn(),
        deselectQuotationDetail: jest.fn(),
        removeSimulatedQuotationDetail: jest.fn(),
        resetSimulatedQuotation: jest.fn(),
        addSimulatedQuotation: jest.fn(),
        quotation$: of(QUOTATION_MOCK),
      }),
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

    router = spectator.inject(Router);
    router.navigate = jest.fn();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      isSapSyncPendingSubject$$.next(false);
    });
    test('should set columnDefs', () => {
      component.ngOnInit();

      expect(component.columnDefs$).toBeDefined();
    });

    test('should take selected cases from the store', () => {
      expect(component.selectedQuotationIds).toEqual([]);
      component.ngOnInit();
      expect(component.selectedQuotationIds).toEqual(['1234']);
    });

    test(
      'should filter SAP Columns',
      marbles((m) => {
        const mockColDefs: ColDef[] = [
          {
            field: ColumnFields.SAP_SYNC_STATUS,
          },
          {
            field: ColumnFields.DATE_NEXT_FREE_ATP,
          },
        ];
        component['activeCaseFacade'].quotation$ = of({
          sapId: undefined,
        } as Quotation);

        component['columnDefinitionService'].COLUMN_DEFS = mockColDefs;
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        component['activeCaseFacade'].quotationHasFNumberMaterials$ = of(true);
        component.ngOnInit();

        m.expect(component.columnDefs$).toBeObservable(
          m.cold('a', {
            a: [
              {
                field: ColumnFields.DATE_NEXT_FREE_ATP,
              },
            ],
          })
        );
      })
    );

    test(
      'should NOT filter SAP Columns',
      marbles((m) => {
        const mockColDefs: ColDef[] = [
          {
            field: ColumnFields.SAP_SYNC_STATUS,
          },
          {
            field: ColumnFields.DATE_NEXT_FREE_ATP,
          },
        ];
        component['activeCaseFacade'].quotation$ = of({
          sapId: '12',
        } as Quotation);

        component['columnDefinitionService'].COLUMN_DEFS = mockColDefs;
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        component['activeCaseFacade'].quotationHasFNumberMaterials$ = of(true);
        component.ngOnInit();

        m.expect(component.columnDefs$).toBeObservable(
          m.cold('a', {
            a: mockColDefs,
          })
        );
      })
    );

    test(
      'should remove pricing Assistant column if quotation has no F-Numbers',
      marbles((m) => {
        const mockColDefs: ColDef[] = [
          {
            field: ColumnFields.PRICING_ASSISTANT,
          },
          {
            field: ColumnFields.DATE_NEXT_FREE_ATP,
          },
        ];
        component['columnDefinitionService'].COLUMN_DEFS = mockColDefs;
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        component['activeCaseFacade'].quotationHasFNumberMaterials$ = of(false);
        component.ngOnInit();

        m.expect(component.columnDefs$).toBeObservable(
          m.cold('a', {
            a: [
              {
                field: ColumnFields.DATE_NEXT_FREE_ATP,
              },
            ],
          })
        );
      })
    );
    test(
      'should NOT remove pricing Assistant column if quotation has F-Numbers',
      marbles((m) => {
        const mockColDefs: ColDef[] = [
          {
            field: ColumnFields.PRICING_ASSISTANT,
          },
          {
            field: ColumnFields.DATE_NEXT_FREE_ATP,
          },
        ];
        component['columnDefinitionService'].COLUMN_DEFS = mockColDefs;
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        component['activeCaseFacade'].quotationHasFNumberMaterials$ = of(true);
        component.ngOnInit();

        m.expect(component.columnDefs$).toBeObservable(
          m.cold('a', {
            a: mockColDefs,
          })
        );
      })
    );
    test(
      'should remove pricing Assistant column if quotation has F-Numbers but quotation is in pending',
      marbles((m) => {
        const mockColDefs: ColDef[] = [
          {
            field: ColumnFields.PRICING_ASSISTANT,
          },
          {
            field: ColumnFields.DATE_NEXT_FREE_ATP,
          },
        ];
        component['columnDefinitionService'].COLUMN_DEFS = mockColDefs;
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        component['activeCaseFacade'].quotationHasFNumberMaterials$ = of(true);
        isSapSyncPendingSubject$$.next(true);

        component.ngOnInit();

        m.expect(component.columnDefs$).toBeObservable(
          m.cold('a', {
            a: [mockColDefs[1]],
          })
        );
      })
    );

    test(
      'should remove RFQ Columns if quotation has no RFQ materials',
      marbles((m) => {
        const mockColDefs: ColDef[] = [
          {
            field: ColumnFields.SQV_RFQ,
          },
          {
            field: ColumnFields.GPM_RFQ,
          },
          {
            field: ColumnFields.PRICING_ASSISTANT,
          },
          {
            field: ColumnFields.DATE_NEXT_FREE_ATP,
          },
        ];
        component['columnDefinitionService'].COLUMN_DEFS = mockColDefs;
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        component['activeCaseFacade'].quotationHasRfqMaterials$ = of(false);

        component.ngOnInit();

        m.expect(component.columnDefs$).toBeObservable(
          m.cold('a', {
            a: [
              {
                field: ColumnFields.PRICING_ASSISTANT,
              },
              {
                field: ColumnFields.DATE_NEXT_FREE_ATP,
              },
            ],
          })
        );
      })
    );

    test(
      'should NOT remove RFQ Columns if quotation has  RFQ materials',
      marbles((m) => {
        const mockColDefs: ColDef[] = [
          {
            field: ColumnFields.SQV_RFQ,
          },
          {
            field: ColumnFields.GPM_RFQ,
          },
          {
            field: ColumnFields.PRICING_ASSISTANT,
          },
          {
            field: ColumnFields.DATE_NEXT_FREE_ATP,
          },
        ];
        component['columnDefinitionService'].COLUMN_DEFS = mockColDefs;
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        component['activeCaseFacade'].quotationHasRfqMaterials$ = of(true);

        component.ngOnInit();

        m.expect(component.columnDefs$).toBeObservable(
          m.cold('a', {
            a: mockColDefs,
          })
        );
      })
    );

    test(
      'should NOT remove SAPPriceDiff column when featureToggle is NOT enabled',
      marbles((m) => {
        const mockColDefs: ColDef[] = [
          {
            field: ColumnFields.PRICE_DIFF_SAP,
          },
          {
            field: ColumnFields.DATE_NEXT_FREE_ATP,
          },
        ];
        component['columnDefinitionService'].COLUMN_DEFS = mockColDefs;
        store.setState({
          'azure-auth': {
            accountInfo: {
              idTokenClaims: {
                roles: [],
              },
            },
          },
        });
        component['activeCaseFacade'].quotationHasRfqMaterials$ = of(false);
        component['activeCaseFacade'].quotationHasRfqMaterials$ = of(true);
        component['activeCaseFacade'].isSapSyncPending$ = of(false);
        component['featureToggleService'].isEnabled = jest
          .fn()
          .mockReturnValue(true);

        component.ngOnInit();

        m.expect(component.columnDefs$).toBeObservable(
          m.cold('a', {
            a: mockColDefs,
          })
        );
      })
    );

    test('should reset simulation when simulationModeEnabled is false', () => {
      const simulationEnabledSubject$$: BehaviorSubject<boolean> =
        new BehaviorSubject(true);
      component.simulatedField = ColumnFields.PRICE;
      component.simulatedValue = 50;
      component.simulatedPriceSource = PriceSourceOptions.GQ;

      component['activeCaseFacade'].simulationModeEnabled$ =
        simulationEnabledSubject$$.asObservable();
      component.ngOnInit();
      simulationEnabledSubject$$.next(false);
      expect(component.simulatedField).toBeUndefined();
      expect(component.simulatedValue).toBeUndefined();
      expect(component.simulatedPriceSource).toBeUndefined();
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
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
          getFilterModel: jest.fn(() => filterModels),
          getColumnState: jest.fn(),
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
    let mockEvent: GridReadyEvent;

    beforeEach(() => {
      mockEvent = {
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
          forEachNode: jest.fn(),
          setFilterModel: jest.fn(),
          ensureIndexVisible: jest.fn(),
          autoSizeColumns: jest.fn(),
          resetColumnState: jest.fn(),
          applyColumnState: jest.fn(),
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
      expect(mockEvent.api.resetColumnState).toHaveBeenCalledTimes(1);
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
        {
          data: { gqPositionId: '1234' },
          rowIndex: 0,
          setSelected: jest.fn(),
        } as any,
        {
          data: { gqPositionId: '5678' },
          rowIndex: 1,
          setSelected: jest.fn(),
        } as any,
      ];
      mockEvent = {
        api: {
          forEachNode: (callback: (row: RowNode) => void) =>
            nodes.forEach((element) => {
              callback(element);
            }),
          forEachNodeAfterFilterAndSort: jest.fn(),
          ensureIndexVisible: jest.fn(),
          autoSizeColumn: jest.fn(),
          getAllGridColumns: jest.fn(() => [
            { getColId: jest.fn(() => ColumnFields.NET_VALUE) },
            { getColId: jest.fn(() => ColumnFields.RECOMMENDED_PRICE) },
          ]),
          resetColumnState: jest.fn(),
        },
      } as any;

      component.selectedQuotationIds = ['1234'];
      component.onGridReady(mockEvent);

      expect(nodes[0].setSelected).toHaveBeenCalledWith(true);
      expect(mockEvent.api.ensureIndexVisible).toHaveBeenCalledWith(
        nodes[0].rowIndex,
        'middle'
      );
      expect(nodes[1].setSelected).not.toHaveBeenCalled();
    });
    test('should scroll to QuotationDetail when routeSnapshot contains gqPositionsId', () => {
      component['route'].snapshot.queryParams = { gqPositionId: '1234' };
      component.rowData = [{ gqPositionId: '1234' } as QuotationDetail];
      component.onGridReady(mockEvent);
      expect(mockEvent.api.ensureIndexVisible).toHaveBeenCalledWith(
        0,
        'middle'
      );
    });
  });

  describe('onFirstDataRenderer', () => {
    test('should scroll to QuotationDetail when routeSnapshot contains gqPositionsId', () => {
      const params = {
        api: {
          setFocusedCell: jest.fn(),
          autoSizeColumns: jest.fn(),
          getAllGridColumns: jest.fn(() => [
            { getColId: jest.fn(() => ColumnFields.NET_VALUE) },
            { getColId: jest.fn(() => ColumnFields.RECOMMENDED_PRICE) },
          ]),
          setFilterModel: jest.fn(),
          resetColumnState: jest.fn(),
        },
      } as any;
      component['route'].snapshot.queryParams = { gqPositionId: '1234' };
      component.rowData = [{ gqPositionId: '1234' } as QuotationDetail];
      component.onFirstDataRendered(params);
      expect(params.api.setFocusedCell).toHaveBeenCalledWith(
        0,
        ColumnFields.QUOTATION_ITEM_ID
      );
      expect(params.api.getAllGridColumns).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateColumnData', () => {
    test('should call agGridService with quotation details', () => {
      component['agGridStateService'].setColumnData = jest.fn();

      component.updateColumnData({
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
          resetColumnState: jest.fn(),
          applyColumnState: jest.fn(),
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
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
          getFilterModel: jest.fn(),
          applyColumnState: jest.fn(),
          getColumnState: jest.fn(),
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
      type: '',
    };

    beforeEach(() => {
      component.updateColumnData = jest.fn();
      component['selectQuotationDetails'] = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test('should update column data', () => {
      component.selectedRows = [];

      component.onRowDataUpdated(mockEvent as any);

      expect(component.updateColumnData).toHaveBeenCalledWith(mockEvent);
    });

    test('should re-select rows', () => {
      component.selectedRows = [
        {
          rowIndex: 21,
          data: { gqPositionId: '123' },
          setSelected: (_isSelected: boolean) => {},
        },
      ] as any;
      component.selectedRows[0].setSelected = jest.fn();

      component.onRowDataUpdated(mockEvent as any);

      expect(component.selectedRows[0].setSelected).toHaveBeenCalledWith(true);
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
      component.onMultipleMaterialSimulation(ColumnFields.PRICE, 250, false);
      component.tableContext.quotation = { gqId: 1234 } as Quotation;
      component['priceSimulationService'].simulateSelectedQuotationDetails =
        jest.fn();

      expect(component.simulatedField).toEqual('price');
      expect(component.simulatedValue).toEqual(250);

      expect(
        component['priceSimulationService'].simulateSelectedQuotationDetails
      ).not.toHaveBeenCalled();
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
      component['priceSimulationService'].simulateSelectedQuotationDetails =
        jest.fn();

      component.onMultipleMaterialSimulation(ColumnFields.PRICE, 50, false);

      expect(
        component['priceSimulationService'].simulateSelectedQuotationDetails
      ).toHaveBeenCalled();
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
      component.tableContext.quotation = { gqId: 1234 } as Quotation;
      component['priceSimulationService'].simulateSelectedQuotationDetails =
        jest.fn();

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

      expect(
        component['priceSimulationService'].simulateSelectedQuotationDetails
      ).toHaveBeenCalledWith(
        ColumnFields.PRICE,
        50,
        component.selectedRows,
        1234
      );
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

      expect(
        component['activeCaseFacade'].removeSimulatedQuotationDetail
      ).toHaveBeenCalledWith('5694232');
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
      expect(
        component['activeCaseFacade'].resetSimulatedQuotation
      ).toHaveBeenCalled();
    });

    test('should call onPriceSourceSimulation', () => {
      component.onPriceSourceSimulation = jest.fn();
      component['priceSimulationService'].simulateSelectedQuotationDetails =
        jest.fn();
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
      expect(
        component['priceSimulationService'].simulateSelectedQuotationDetails
      ).not.toHaveBeenCalled();
      expect(
        component['activeCaseFacade'].resetSimulatedQuotation
      ).toHaveBeenCalled();
    });

    test('should dispatch select quotation detail', () => {
      component.onRowSelected({
        node: { isSelected: () => true, data: { gqPositionId: '1234' } },
        api: {
          getSelectedNodes: jest.fn().mockReturnValue([]),
        },
      } as any);

      expect(
        component['activeCaseFacade'].selectQuotationDetail
      ).toHaveBeenCalledWith('1234');
    });

    test('should dispatch deselect quotation detail', () => {
      component.onRowSelected({
        node: { isSelected: () => false, data: { gqPositionId: '1234' } },
        api: {
          getSelectedNodes: jest.fn().mockReturnValue([]),
        },
      } as any);

      expect(
        component['activeCaseFacade'].deselectQuotationDetail
      ).toHaveBeenCalledWith('1234');
    });
  });

  describe('onPriceSourceSimulation', () => {
    test('should call service and set priceSource', () => {
      component.selectedRows = [{ data: QUOTATION_DETAIL_MOCK } as RowNode];
      component['priceSourceSimulationService'].onPriceSourceSimulation =
        jest.fn();

      component.onPriceSourceSimulation(PriceSourceOptions.TARGET_PRICE);

      expect(
        component['priceSourceSimulationService'].onPriceSourceSimulation
      ).toHaveBeenCalled();
      expect(component.simulatedPriceSource).toEqual(
        PriceSourceOptions.TARGET_PRICE
      );
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
