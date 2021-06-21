import { SimpleChange } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import {
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

import { AgGridStateService } from '../../services/ag-grid-state.service';
import { SharedModule } from '../../shared.module';
import { CustomOverlayModule } from '../table/custom-overlay/custom-overlay.module';
import { CustomStatusBarModule } from '../table/custom-status-bar/custom-status-bar.module';
import { CalculationsTableComponent } from './calculations-table.component';
import { ColumnDefinitionService } from './config';

describe('CalculationsTableComponent', () => {
  let component: CalculationsTableComponent;
  let spectator: Spectator<CalculationsTableComponent>;
  let stateService: AgGridStateService;

  const createComponent = createComponentFactory({
    component: CalculationsTableComponent,
    imports: [
      SharedTranslocoModule,
      SharedModule,
      AgGridModule.withComponents([]),
      MatCardModule,
      MatIconModule,
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(CustomOverlayModule),
      MockModule(CustomStatusBarModule),
    ],
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

  describe('noRowsOverlayComponentParams', () => {
    it('should return errorMessage on getMessage', () => {
      component.errorMessage = 'test';
      const result = component.noRowsOverlayComponentParams.getMessage();

      expect(result).toEqual(component.errorMessage);
    });
  });

  describe('ngOnChanges', () => {
    it('should showLoadingOverlay when grid loaded and isLoading active', () => {
      component['gridApi'] = {
        showLoadingOverlay: jest.fn(),
      } as unknown as GridApi;

      component.ngOnChanges({
        isLoading: {
          currentValue: true,
        } as unknown as SimpleChange,
      });

      expect(component['gridApi'].showLoadingOverlay).toHaveBeenCalled();
    });

    it('should do nothing with the overlays when gridApi is not loaded', () => {
      component['gridApi'] = undefined;

      component.ngOnChanges({
        isLoading: {
          currentValue: true,
        } as unknown as SimpleChange,
      });

      // should just succeed - otherwise this test should throw an error
    });

    it('should hide loading spinner and show NoRowsOverlay when loading is done', () => {
      component['gridApi'] = {
        showLoadingOverlay: jest.fn(),
        showNoRowsOverlay: jest.fn(),
      } as unknown as GridApi;

      component.ngOnChanges({
        isLoading: {
          currentValue: false,
        } as unknown as SimpleChange,
      });

      expect(component['gridApi'].showLoadingOverlay).not.toHaveBeenCalled();
      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
    });
  });

  describe('onRowSelected', () => {
    const event = {
      node: {
        id: '2',
        isSelected: jest.fn(() => true),
      },
      api: {
        getRowNode: jest.fn(() => ({
          setSelected: jest.fn(),
          data: undefined,
        })),
      },
    } as unknown as RowSelectedEvent;

    beforeEach(() => {
      jest.useFakeTimers('legacy');
      component.minified = false;

      component.selectionChange.emit = jest.fn();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should fill the selectedRows if the row is selected', () => {
      component.selectedNodeIds = ['1'];

      component.onRowSelected(event);

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);
      jest.advanceTimersByTime(10);

      expect(component.selectionChange.emit).toHaveBeenCalledWith([
        { nodeId: '1', calculation: undefined },
        { nodeId: '2', calculation: undefined },
      ]);
    });

    it('should remove the selectedRows if the row is deselected', () => {
      component.selectedNodeIds = ['1', '2'];

      component.onRowSelected({
        ...event,
        node: {
          ...event.node,
          isSelected: jest.fn(() => false),
        },
      } as unknown as RowSelectedEvent);

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);

      jest.advanceTimersByTime(10);

      expect(component.selectionChange.emit).toHaveBeenCalledWith([
        { nodeId: '1', calculation: undefined },
      ]);
    });

    it('should remove from selectedRows if there are to many entries', () => {
      component.selectedNodeIds = ['1', '3'];

      component.onRowSelected(event);

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);

      jest.advanceTimersByTime(10);

      expect(component.selectionChange.emit).toHaveBeenCalledWith([
        { nodeId: '3', calculation: undefined },
        { nodeId: '2', calculation: undefined },
      ]);
      expect(event.api.getRowNode).toHaveBeenCalledWith('1');
    });
  });

  describe('onFirstDataRendered', () => {
    let params: IStatusPanelParams;

    beforeEach(() => {
      params = {
        columnApi: {
          getAllColumns: jest.fn(() => [
            { getId: () => 'checkbox' },
            { getId: () => 'calculationDate' },
          ]),
          autoSizeColumns: jest.fn(),
        },
      } as unknown as IStatusPanelParams;

      component['selectNodes'] = jest.fn();
    });

    it('should autosize the columns', () => {
      component.onFirstDataRendered(params);

      expect(params.columnApi.autoSizeColumns).toHaveBeenCalled();
      expect(params.columnApi.getAllColumns).toHaveBeenCalled();
    });

    it('should call selectNodes', () => {
      component.onFirstDataRendered(params);

      expect(component['selectNodes']).toHaveBeenCalled();
    });
  });

  describe('selectNodes', () => {
    beforeEach(() => {
      component['gridApi'] = {
        getRowNode: jest.fn(() => ({ setSelected: jest.fn() })),
      } as unknown as GridApi;

      jest.useFakeTimers('legacy');
    });

    afterEach(() => {
      // this is a workaround:
      // only using useFakeTimers will affect all following specs, which leads to failures
      jest.useRealTimers();
    });

    it('should set node selected if nodeId is set', () => {
      component.selectedNodeIds = ['7'];

      component['selectNodes']();

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);
      jest.advanceTimersByTime(10);
      expect(component['gridApi'].getRowNode).toHaveBeenCalled();
    });

    it('should do nothing, if nodeId is not present', () => {
      component.selectedNodeIds = undefined;

      component['selectNodes']();

      expect(setTimeout).not.toHaveBeenCalled();
      expect(component['gridApi'].getRowNode).not.toHaveBeenCalled();
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
        'calculations',
        []
      );
    });
  });

  describe('onGridReady', () => {
    const params = {
      api: {
        showLoadingOverlay: jest.fn(),
        showNoRowsOverlay: jest.fn(),
      },
      columnApi: {
        applyColumnState: jest.fn(),
      },
    } as unknown as GridReadyEvent;

    it('should set grid api', () => {
      component.isLoading = true;

      component.onGridReady(params);

      expect(component['gridApi']).toEqual(params.api);
    });

    it('should apply column state from state service', () => {
      const mockColumnState = [{ colId: 'foo', sort: 'asc' }];
      stateService.getColumnState = jest.fn(() => mockColumnState);

      component.onGridReady(params);

      expect(params.columnApi.applyColumnState).toHaveBeenCalledWith({
        state: mockColumnState,
        applyOrder: true,
      });
    });

    it('should hide loading spinner when data is not loading', () => {
      component.isLoading = false;

      component.onGridReady(params);

      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
    });
  });
});
