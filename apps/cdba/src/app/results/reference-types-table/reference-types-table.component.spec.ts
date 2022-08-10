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
  SelectionChangedEvent,
  SortChangedEvent,
} from 'ag-grid-community';
import { ColumnApi, GridApi } from 'ag-grid-enterprise';
import { MockModule } from 'ng-mocks';

import { ResultsStatusBarModule } from '@cdba/shared/components/table/status-bar/results-status-bar';
import { ReferenceType } from '@cdba/shared/models';
import { AgGridStateService } from '@cdba/shared/services';
import { CALCULATIONS_MOCK, SEARCH_STATE_MOCK } from '@cdba/testing/mocks';

import { ColumnDefinitionService } from './config';
import { ReferenceTypesTableComponent } from './reference-types-table.component';
import { TableStore } from './table.store';

describe('ReferenceTypesTableComponent', () => {
  let component: ReferenceTypesTableComponent;
  let spectator: Spectator<ReferenceTypesTableComponent>;
  let stateService: AgGridStateService;

  const createComponent = createComponentFactory({
    component: ReferenceTypesTableComponent,
    imports: [MockModule(AgGridModule), MockModule(ResultsStatusBarModule)],
    declarations: [ReferenceTypesTableComponent],
    providers: [
      mockProvider(ColumnDefinitionService, {
        COLUMN_DEFINITIONS: jest.fn(() => ''),
      }),
      mockProvider(AgGridStateService),
      TableStore,
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      } as unknown as GridApi;
    });

    it('should set node selected if nodeId is set', () => {
      component.selectedNodeIds = ['7'];

      component['selectNodes']();

      expect(component['gridApi'].getRowNode).toHaveBeenCalled();
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
