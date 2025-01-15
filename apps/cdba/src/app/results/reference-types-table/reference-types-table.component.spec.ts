import { Subscription } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import {
  Column,
  ColumnRowGroupChangedEvent,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  IRowNode,
  SelectionChangedEvent,
  SortChangedEvent,
} from 'ag-grid-enterprise';
import { MockModule, MockPipe } from 'ng-mocks';

import { getPaginationState, updatePaginationState } from '@cdba/core/store';
import { PaginationState } from '@cdba/core/store/reducers/search/search.reducer';
import { PaginationControlsService } from '@cdba/shared/components/table/pagination-controls/service/pagination-controls.service';
import { ResultsStatusBarModule } from '@cdba/shared/components/table/status-bar/results-status-bar';
import { ReferenceType } from '@cdba/shared/models';
import { AgGridStateService } from '@cdba/shared/services';
import {
  CALCULATIONS_MOCK,
  PAGINATION_STATE_MOCK,
  SEARCH_STATE_MOCK,
} from '@cdba/testing/mocks';

import { ColumnDefinitionService } from './config';
import { ReferenceTypesTableComponent } from './reference-types-table.component';
import { TableStore } from './table.store';

describe('ReferenceTypesTableComponent', () => {
  let component: ReferenceTypesTableComponent;
  let spectator: Spectator<ReferenceTypesTableComponent>;
  let stateService: AgGridStateService;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ReferenceTypesTableComponent,
    imports: [
      MockModule(AgGridModule),
      MockModule(ResultsStatusBarModule),
      MockPipe(PushPipe),
    ],
    declarations: [ReferenceTypesTableComponent],
    detectChanges: false,
    providers: [
      mockProvider(ColumnDefinitionService, {
        COLUMN_DEFINITIONS: jest.fn(() => ''),
      }),
      mockProvider(AgGridStateService),
      TableStore,
      mockProvider(PaginationControlsService, {
        getPageSizeFromLocalStorage: jest.fn(() => 100),
        setPageSizeToLocalStorage: jest.fn(),
      }),
      provideMockStore({
        initialState: {
          search: SEARCH_STATE_MOCK,
          detail: {
            calculations: CALCULATIONS_MOCK,
          },
        },
        selectors: [
          {
            selector: getPaginationState,
            value: PAGINATION_STATE_MOCK,
          },
        ],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);

    stateService = spectator.inject(AgGridStateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spectator.setInput('rowData', []);
      component['setupInitialPaginationState'] = jest.fn();
    });

    it('should set subcriptions', () => {
      component.ngOnInit();

      expect(component['filtersSubscription']).toBeTruthy();
      expect(component['paginationStateSubscription']).toBeTruthy();
    });
    it('should set initial pagination state if it is undefined', () => {
      component.paginationState = undefined;
      store.overrideSelector(getPaginationState, undefined);

      component.ngOnInit();

      expect(component['setupInitialPaginationState']).toHaveBeenCalledTimes(1);
    });
    it('should not set subcriptions and initial pagination state if it defined', () => {
      component.paginationState = PAGINATION_STATE_MOCK;

      component.ngOnInit();

      expect(component['setupInitialPaginationState']).toHaveBeenCalledTimes(0);
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      component['filtersSubscription'] = {
        unsubscribe: jest.fn(),
      } as unknown as Subscription;
      component['paginationStateSubscription'] = {
        unsubscribe: jest.fn(),
      } as unknown as Subscription;
    });

    it('should unsubscribe', () => {
      component.ngOnDestroy();

      expect(component['filtersSubscription'].unsubscribe).toHaveBeenCalled();
      expect(
        component['paginationStateSubscription'].unsubscribe
      ).toHaveBeenCalled();
    });
  });

  describe('columnChange', () => {
    it('should receive current column state and set it via state service', () => {
      const mockEvent = {
        api: { getColumnState: jest.fn(() => []) },
      } as unknown as SortChangedEvent;

      component.columnChange(mockEvent);

      expect(mockEvent.api.getColumnState).toHaveBeenCalled();
      expect(stateService.setColumnState).toHaveBeenCalledWith(
        'referenceTypes',
        []
      );
    });
  });

  describe('onGridReady', () => {
    const event: GridReadyEvent = {
      api: {
        updateGridOptions: jest.fn(),
        paginationGoToPage: jest.fn(),
        applyColumnState: jest.fn(),
        getRowGroupColumns: jest.fn(() => []),
      } as unknown as GridApi,
    } as unknown as GridReadyEvent;

    beforeEach(() => {
      jest.clearAllMocks();

      component.paginationState = PAGINATION_STATE_MOCK;
    });

    it('should set gridApi', () => {
      component.onGridReady(event);

      expect(component['gridApi']).toEqual(event.api);
    });

    it('should applyColumnState', () => {
      const mockColumnState: any = [{ colId: 'foo', sort: 'asc' }];
      stateService.getColumnState = jest.fn(() => mockColumnState);

      component.onGridReady(event);

      expect(event.api.applyColumnState).toHaveBeenCalledWith({
        state: mockColumnState,
        applyOrder: true,
      });
    });

    it('should go to page if current page is not 0', () => {
      component.paginationState.currentPage = 1;

      component.onGridReady(event);

      expect(component['gridApi'].paginationGoToPage).toHaveBeenCalledWith(1);
    });

    it('should not invoke paginationGoToPage if current page is 0', () => {
      component.paginationState.currentPage = 0;

      component.onGridReady(event);

      expect(component['gridApi'].paginationGoToPage).not.toHaveBeenCalled();
    });

    it('should dispatch updatePaginationState with isVisible=false (hide) if rowGroupColumns is not empty', () => {
      event.api.getRowGroupColumns = jest.fn(() => [
        {} as Column,
        {} as Column,
      ]);
      const storeSpy = jest.spyOn(store, 'dispatch');
      component.paginationState = {
        isVisible: true,
        isDisabled: false,
        currentPage: 0,
        pageSize: 100,
        totalPages: 1,
        totalRange: 2,
      } as PaginationState;

      component.onGridReady(event);

      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: {
            isVisible: false,
            isDisabled: false,
            currentPage: 0,
            pageSize: 100,
            totalPages: 1,
            totalRange: 2,
          } as PaginationState,
        })
      );
    });

    it('should dispatch updatePaginationState with isVisible=true (show) if rowGroupColumns is empty', () => {
      event.api.getRowGroupColumns = jest.fn(() => []);
      const storeSpy = jest.spyOn(store, 'dispatch');
      component.paginationState = {
        isVisible: false,
        isDisabled: false,
        currentPage: 0,
        pageSize: 100,
        totalPages: 1,
        totalRange: 2,
      } as PaginationState;

      component.onGridReady(event);

      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: {
            isVisible: true,
            isDisabled: false,
            currentPage: 0,
            pageSize: 100,
            totalPages: 1,
            totalRange: 2,
          } as PaginationState,
        })
      );
    });
  });

  describe('onFirstDataRendered', () => {
    const params = {
      api: {
        setFilterModel: jest.fn(),
        refreshHeader: jest.fn(),
        autoSizeAllColumns: jest.fn(),
        setColumnVisible: jest.fn(),
      },
    } as unknown as FirstDataRenderedEvent;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(component as any, 'selectNodes');
    });
    it('should call autoSizeAllColumns', () => {
      component.onFirstDataRendered(params);

      expect(params.api.autoSizeAllColumns).toHaveBeenCalledWith(false);
      expect(params.api.refreshHeader).toHaveBeenCalledTimes(1);
    });

    it('should call selectNodes', () => {
      component.onFirstDataRendered(params);

      expect(component['selectNodes']).toHaveBeenCalled();
      expect(params.api.refreshHeader).toHaveBeenCalledTimes(1);
    });
  });

  describe('onColumnRowGroupChanged', () => {
    it('should show pagination when column is being changed but row grouping is inactive', () => {
      const storeSpy = jest.spyOn(store, 'dispatch');
      const event = {
        source: 'toolPanelUi',
        columns: [
          {
            isRowGroupActive: jest.fn(() => false),
          } as unknown as Column,
        ],
      } as ColumnRowGroupChangedEvent;
      component.paginationState = {
        isVisible: false,
        isDisabled: false,
        currentPage: 0,
        pageSize: 100,
        totalPages: 1,
        totalRange: 2,
      } as PaginationState;

      component.onColumnRowGroupChanged(event);

      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: {
            isVisible: true,
            isDisabled: false,
            currentPage: 0,
            pageSize: 100,
            totalPages: 1,
            totalRange: 2,
          } as PaginationState,
        })
      );
    });
    it('should hide pagination when column is being changed and row grouping is active', () => {
      const storeSpy = jest.spyOn(store, 'dispatch');
      const event = {
        source: 'toolPanelUi',
        columns: [
          {
            isRowGroupActive: jest.fn(() => true),
          } as unknown as Column,
        ],
      } as ColumnRowGroupChangedEvent;
      component.paginationState = {
        isVisible: true,
        isDisabled: false,
        currentPage: 0,
        pageSize: 100,
        totalPages: 1,
        totalRange: 2,
      } as PaginationState;

      component.onColumnRowGroupChanged(event);

      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: {
            isVisible: false,
            isDisabled: false,
            currentPage: 0,
            pageSize: 100,
            totalPages: 1,
            totalRange: 2,
          } as PaginationState,
        })
      );
    });
    it('should hide pagination when more than one column is being changed', () => {
      const storeSpy = jest.spyOn(store, 'dispatch');
      const event = {
        source: 'toolPanelUi',
        columns: [
          {
            isRowGroupActive: jest.fn(() => true),
          } as unknown as Column,
          {
            isRowGroupActive: jest.fn(() => true),
          } as unknown as Column,
        ],
      } as ColumnRowGroupChangedEvent;
      component.paginationState = {
        isVisible: true,
        isDisabled: false,
        currentPage: 0,
        pageSize: 100,
        totalPages: 1,
        totalRange: 2,
      } as PaginationState;

      component.onColumnRowGroupChanged(event);

      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: {
            isVisible: false,
            isDisabled: false,
            currentPage: 0,
            pageSize: 100,
            totalPages: 1,
            totalRange: 2,
          } as PaginationState,
        })
      );
    });
  });

  describe('onSelectionChanged', () => {
    const event = {
      api: {
        getSelectedNodes: jest.fn(() => [{ id: 0 }]),
      },
    } as unknown as SelectionChangedEvent;

    it('should react on change in selected nodes', () => {
      component.selectionChange.emit = jest.fn();

      component.onSelectionChanged(event);

      expect(component.selectionChange.emit).toHaveBeenCalledWith([0]);
    });
  });

  describe('selectNodes', () => {
    beforeEach(() => {
      component['gridApi'] = {
        getRowNode: jest.fn(() => ({ setSelected: jest.fn() })),
        setNodesSelected: jest.fn(() => {}),
      } as unknown as GridApi;
    });

    it('should set node selected if nodeId is set', () => {
      component.selectedNodeIds = ['7'];
      const rowNode = { id: '7' } as IRowNode as any;
      component['gridApi'].getRowNode = jest.fn().mockReturnValue(rowNode);

      component['selectNodes']();

      expect(component['gridApi'].getRowNode).toHaveBeenCalledWith('7');
      expect(component['gridApi'].setNodesSelected).toHaveBeenCalledWith({
        nodes: [rowNode],
        newValue: true,
        source: 'api',
      });
    });

    it('should do nothing, if nodeId is not present', () => {
      component.selectedNodeIds = undefined;

      component['selectNodes']();

      expect(component['gridApi'].getRowNode).not.toHaveBeenCalled();
    });
  });

  describe('filterChange', () => {
    it('should set filters of tables store', () => {
      const mockFilters = { sqv: { type: 'number', value: 10 } };
      component['gridApi'] = {
        getFilterModel: jest.fn(() => mockFilters),
      } as unknown as GridApi;
      jest.spyOn(component['tableStore'] as any, 'setFilters');

      component.filterChange();

      expect(component['tableStore'].setFilters).toHaveBeenCalledWith(
        mockFilters
      );
    });
  });

  describe('setupInitialPaginationState', () => {
    it('should dispatch updatePaginationState with pageSize from local storage', () => {
      const storeSpy = jest.spyOn(store, 'dispatch');
      component.rowData = [{ foo: 'bar' } as unknown as ReferenceType];
      component['setupInitialPaginationState']();

      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: {
            isVisible: true,
            isDisabled: true,
            currentPage: 0,
            pageSize: 100,
            totalPages: 1,
            totalRange: 1,
          } as PaginationState,
        })
      );
    });
  });
});
