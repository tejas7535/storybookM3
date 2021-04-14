import { SimpleChange } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  GridApi,
  GridReadyEvent,
  IStatusPanelParams,
  RowSelectedEvent,
} from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { SharedModule } from '@cdba/shared';
import { CustomLoadingOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CustomOverlayModule } from '@cdba/shared/components/table/custom-overlay/custom-overlay.module';

import { ActionsCellRendererComponent } from './actions-cell-renderer/actions-cell-renderer.component';
import { DrawingsTableComponent } from './drawings-table.component';

describe('DrawingsTableComponent', () => {
  let component: DrawingsTableComponent;
  let spectator: Spectator<DrawingsTableComponent>;

  const createComponent = createComponentFactory({
    component: DrawingsTableComponent,
    declarations: [ActionsCellRendererComponent],
    imports: [
      SharedModule,
      MatButtonModule,
      MatIconModule,
      AgGridModule.withComponents([
        CustomLoadingOverlayComponent,
        CustomNoRowsOverlayComponent,
        ActionsCellRendererComponent,
      ]),
      CustomOverlayModule,
      ReactiveComponentModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should showLoadingOverlay when grid loaded and isLoading active', () => {
      component['gridApi'] = ({
        showLoadingOverlay: jest.fn(),
      } as unknown) as GridApi;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        isLoading: ({
          currentValue: true,
        } as unknown) as SimpleChange,
      });

      expect(component['gridApi'].showLoadingOverlay).toHaveBeenCalled();
    });

    it('should do nothing with the overlays when gridApi is not loaded', () => {
      component['gridApi'] = undefined;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        isLoading: ({
          currentValue: true,
        } as unknown) as SimpleChange,
      });

      // should just succeed - otherwise this test should throw an error
    });

    it('should hide loading spinner and show NoRowsOverlay when loading is done', () => {
      component['gridApi'] = ({
        showLoadingOverlay: jest.fn(),
        showNoRowsOverlay: jest.fn(),
      } as unknown) as GridApi;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        isLoading: ({
          currentValue: false,
        } as unknown) as SimpleChange,
      });

      expect(component['gridApi'].showLoadingOverlay).not.toHaveBeenCalled();
      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
    });
  });

  describe('onRowSelected', () => {
    const event = ({
      node: {
        id: 2,
      },
      api: {
        getSelectedRows: jest.fn(() => [{}]),
      },
    } as unknown) as RowSelectedEvent;

    it('should emit selectionChange event', () => {
      component.selectionChange.emit = jest.fn();
      const expected = { nodeId: 2, drawing: {} };

      component.onRowSelected(event);

      expect(component.selectionChange.emit).toHaveBeenCalledWith(expected);
    });
  });

  describe('onFirstDataRendered', () => {
    const params: IStatusPanelParams = ({
      columnApi: {
        autoSizeAllColumns: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;

    beforeEach(() => {
      component['gridApi'] = ({
        getRowNode: jest.fn(() => ({ setSelected: jest.fn() })),
      } as unknown) as GridApi;
    });

    it('should set node selected if nodeId is set', () => {
      component.selectedNodeId = '7';

      component.onFirstDataRendered(params);

      expect(component['gridApi'].getRowNode).toHaveBeenCalled();
    });

    it('should do nothing, if nodeId is not present', () => {
      component.selectedNodeId = undefined;

      component.onFirstDataRendered(params);

      expect(component['gridApi'].getRowNode).not.toHaveBeenCalled();
    });

    it('should autosize all columns', () => {
      component.onFirstDataRendered(params);

      expect(params.columnApi.autoSizeAllColumns).toHaveBeenCalledWith(false);
    });
  });

  describe('onGridReady', () => {
    const params = ({
      api: {
        showNoRowsOverlay: jest.fn(),
      },
    } as unknown) as GridReadyEvent;

    beforeEach(() => {
      jest.useFakeTimers();

      component['refreshHeaders'] = jest.fn();
    });

    afterEach(() => {
      // this is a workaround:
      // only using useFakeTimers will affect all following specs, which leads to failures
      jest.useRealTimers();
    });

    it('should set grid api', () => {
      component.isLoading = true;

      component.onGridReady(params);

      expect(component['gridApi']).toEqual(params.api);
    });

    it('should hide loading spinner when data is not loading', () => {
      component.isLoading = false;

      component.onGridReady(params);

      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
    });

    it('should call refreshHeaders', () => {
      component.onGridReady(params);

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 50);
      jest.advanceTimersByTime(51);
      expect(component['refreshHeaders']).toHaveBeenCalled();
    });
  });

  describe('refreshHeaders', () => {
    beforeEach(() => {
      component['gridApi'] = ({
        showNoRowsOverlay: jest.fn(),
        refreshHeader: jest.fn(),
        getColumnDef: jest.fn((colId) => ({
          headerName: colId,
        })),
      } as unknown) as GridApi;
    });

    it('should call refreshHeader of gridApi', () => {
      component['refreshHeaders']();

      expect(component['gridApi'].refreshHeader).toHaveBeenCalled();
    });
  });
});
