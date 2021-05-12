import { SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  ColumnApi,
  ColumnEvent,
  GridApi,
  GridReadyEvent,
  IStatusPanelParams,
  RowSelectedEvent,
} from '@ag-grid-enterprise/all-modules';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import { CustomStatusBarModule } from '@cdba/shared/components/table/custom-status-bar/custom-status-bar.module';
import { ReferenceType } from '@cdba/shared/models';
import { AgGridStateService } from '@cdba/shared/services';

import { ColumnDefinitionService } from './config';
import { ReferenceTypesTableComponent } from './reference-types-table.component';

describe('ReferenceTypesTableComponent', () => {
  let component: ReferenceTypesTableComponent;
  let spectator: Spectator<ReferenceTypesTableComponent>;
  let stateService: AgGridStateService;

  const createComponent = createComponentFactory({
    component: ReferenceTypesTableComponent,
    imports: [
      SharedTranslocoModule,
      SharedModule,
      AgGridModule.withComponents([]),
      MatIconModule,
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(CustomStatusBarModule),
    ],
    declarations: [ReferenceTypesTableComponent],
    providers: [
      ColumnDefinitionService,
      mockProvider(AgGridStateService),
      provideMockStore(),
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
      } as unknown as ColumnEvent;

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
      const mockColumnState = [{ colId: 'foo', sort: 'asc' }];
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
    it('should call autoSizeAllColumns', () => {
      const params = {
        columnApi: {
          autoSizeAllColumns: jest.fn(),
          setColumnVisible: jest.fn(),
        },
      } as unknown as IStatusPanelParams;

      component.onFirstDataRendered(params);

      expect(params.columnApi.autoSizeAllColumns).toHaveBeenCalledWith(false);
    });
  });

  describe('onRowSelected', () => {
    const event = {
      node: {
        id: '2',
        isSelected: jest.fn(() => true),
      },
      api: {
        getRowNode: jest.fn(() => ({ setSelected: jest.fn() })),
      },
    } as unknown as RowSelectedEvent;

    it('should fill the selectedRows if the row is selected', () => {
      component.selectedRows = ['1'];

      component.onRowSelected(event);

      expect(component.selectedRows).toStrictEqual(['1', '2']);
    });

    it('should remove the selectedRows if the row is deselected', () => {
      component.selectionChange.emit = jest.fn();

      component.selectedRows = ['1', '2'];

      component.onRowSelected({
        ...event,
        node: {
          ...event.node,
          isSelected: jest.fn(() => false),
        },
      } as unknown as RowSelectedEvent);

      expect(component.selectedRows).toStrictEqual(['1']);

      expect(component.selectionChange.emit).toHaveBeenCalled();
    });

    it('should remove from selectedRows if there are to many entries', () => {
      component.selectedRows = ['1', '3'];

      component.onRowSelected(event);

      expect(component.selectedRows).toStrictEqual(['3', '2']);

      expect(event.api.getRowNode).toHaveBeenCalledWith('1');
    });
  });
});
