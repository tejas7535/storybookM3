import { SimpleChanges } from '@angular/core';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import {
  FirstDataRenderedEvent,
  GridReadyEvent,
  IRowNode,
  SelectionChangedEvent,
  SortChangedEvent,
} from 'ag-grid-community';
import { ColumnApi, GridApi } from 'ag-grid-enterprise';
import { MockModule } from 'ng-mocks';

import { PaginationControlsService } from '@cdba/shared/components/table/pagination-controls/service/pagination-controls.service';
import { ResultsStatusBarModule } from '@cdba/shared/components/table/status-bar/results-status-bar';
import { BetaFeature } from '@cdba/shared/constants/beta-feature';
import { ReferenceType } from '@cdba/shared/models';
import { AgGridStateService } from '@cdba/shared/services';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import {
  CALCULATIONS_MOCK,
  REFERENCE_TYPE_MOCK,
  SEARCH_STATE_MOCK,
} from '@cdba/testing/mocks';

import { ColumnDefinitionService } from './config';
import { ReferenceTypesTableComponent } from './reference-types-table.component';
import { TableStore } from './table.store';

describe('ReferenceTypesTableComponent', () => {
  let component: ReferenceTypesTableComponent;
  let spectator: Spectator<ReferenceTypesTableComponent>;
  let stateService: AgGridStateService;
  let paginationConstrolsService: PaginationControlsService;

  const createComponent = createComponentFactory({
    component: ReferenceTypesTableComponent,
    imports: [MockModule(AgGridModule), MockModule(ResultsStatusBarModule)],
    declarations: [ReferenceTypesTableComponent],
    detectChanges: false,
    providers: [
      mockProvider(ColumnDefinitionService, {
        COLUMN_DEFINITIONS: jest.fn(() => ''),
      }),
      mockProvider(AgGridStateService),
      TableStore,
      mockProvider(BetaFeatureService, {
        getBetaFeature: jest.fn(
          (feature: BetaFeature) => feature === BetaFeature.LIMIT_FILTER
        ),
      }),
      mockProvider(PaginationControlsService, {
        setPageSize: jest.fn(),
        getPageSize: jest.fn(() => 100),
      }),
      provideMockStore({
        initialState: {
          search: SEARCH_STATE_MOCK,
          detail: {
            calculations: CALCULATIONS_MOCK,
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    stateService = spectator.inject(AgGridStateService);
    paginationConstrolsService = spectator.inject(PaginationControlsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spectator.setInput('rowData', []);
    });

    it('should set values in pagination service', () => {
      paginationConstrolsService.setPageSize(100);
      spectator.setInput('rowData', [REFERENCE_TYPE_MOCK, REFERENCE_TYPE_MOCK]);

      component.ngOnInit();

      expect(component['paginationControlsService'].range).toEqual(2);
      expect(component['paginationControlsService'].pages).toEqual(1);
    });
  });

  describe('ngOnChanges', () => {
    let rowData;

    beforeEach(() => {
      rowData = undefined;
    });

    it('should do nothing if rowData is undefined', () => {
      component['gridApi'] = {
        setRowData: jest.fn(),
      } as unknown as GridApi;

      component.ngOnChanges({});

      expect(component['gridApi'].setRowData).not.toHaveBeenCalled();
    });

    it('should do nothing if grid api is undefined', () => {
      rowData = { currentValue: { foo: 'bar' } };
      const changes: SimpleChanges = {
        rowData,
      } as unknown as SimpleChanges;

      component.ngOnChanges(changes);

      expect(component['gridApi']).toBeUndefined();
    });

    it('should set row data if api and data is defined', () => {
      component['gridApi'] = {
        setRowData: jest.fn(),
      } as unknown as GridApi;

      rowData = { currentValue: { foo: 'bar' } };
      const changes: SimpleChanges = {
        rowData,
      } as unknown as SimpleChanges;

      component.ngOnChanges(changes);

      expect(component['gridApi'].setRowData).toHaveBeenCalledWith(
        rowData.currentValue
      );
    });
  });

  describe('columnChange', () => {
    it('should receive current column state and set it via state service', () => {
      const mockEvent = {
        columnApi: { getColumnState: jest.fn(() => []) },
      } as unknown as SortChangedEvent;

      component.columnChange(mockEvent);

      expect(mockEvent.columnApi.getColumnState).toHaveBeenCalled();
      expect(stateService.setColumnState).toHaveBeenCalledWith(
        'referenceTypes',
        []
      );
    });
  });

  describe('onGridReady', () => {
    const event: GridReadyEvent = {
      api: {
        setRowData: jest.fn(),
      } as unknown as GridApi,
      columnApi: {
        applyColumnState: jest.fn(),
      } as unknown as ColumnApi,
    } as unknown as GridReadyEvent;

    it('should set gridApi', () => {
      component.onGridReady(event);

      expect(component['gridApi']).toEqual(event.api);
    });

    it('should applyColumnState', () => {
      const mockColumnState: any = [{ colId: 'foo', sort: 'asc' }];
      stateService.getColumnState = jest.fn(() => mockColumnState);

      component.onGridReady(event);

      expect(event.columnApi.applyColumnState).toHaveBeenCalledWith({
        state: mockColumnState,
        applyOrder: true,
      });
    });

    it('should set row data', () => {
      const rowData = [{ foo: 'bar' } as unknown as ReferenceType];

      component.rowData = rowData;

      component.onGridReady(event);

      expect(event.api.setRowData).toHaveBeenCalledWith(rowData);
    });
  });

  describe('onFirstDataRendered', () => {
    const params = {
      columnApi: {
        autoSizeAllColumns: jest.fn(),
        setColumnVisible: jest.fn(),
      },
      api: {
        setFilterModel: jest.fn(),
        refreshHeader: jest.fn(),
      },
    } as unknown as FirstDataRenderedEvent;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(component as any, 'selectNodes');
    });
    it('should call autoSizeAllColumns', () => {
      component.onFirstDataRendered(params);

      expect(params.columnApi.autoSizeAllColumns).toHaveBeenCalledWith(false);
      expect(params.api.refreshHeader).toHaveBeenCalledTimes(1);
    });

    it('should call selectNodes', () => {
      component.onFirstDataRendered(params);

      expect(component['selectNodes']).toHaveBeenCalled();
      expect(params.api.refreshHeader).toHaveBeenCalledTimes(1);
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
});
