import { of } from 'rxjs';

import {
  FirstDataRenderedEvent,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  RowClassParams,
} from 'ag-grid-enterprise';

import { Alert, AlertStatus, Priority } from '../../../../feature/alerts/model';
import {
  serverSideTableDefaultProps,
  sideBar,
} from '../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { Stub } from '../../../../shared/test/stub.class';
import { AlertTableComponent } from './alert-table.component';
import * as ColDefHelper from './column-definitions';

describe('AlertTableComponent', () => {
  let component: AlertTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<AlertTableComponent>({
      component: AlertTableComponent,
      providers: [Stub.getAlertServiceProvider()],
    });

    Stub.setInputs([
      { property: 'priorities', value: [Priority.Priority1] },
      { property: 'status', value: AlertStatus.ACTIVE },
    ]);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('gridOptions', () => {
    it('should have the correct default properties', () => {
      expect(component['gridOptions']).toEqual(
        expect.objectContaining({
          ...serverSideTableDefaultProps,
          sideBar,
        })
      );
    });

    it('should have the correct row class rules', () => {
      const rowClassRules = component['gridOptions'].rowClassRules as any;

      expect(rowClassRules['is-active']).toBeDefined();
      expect(rowClassRules['is-prio1']).toBeDefined();
      expect(rowClassRules['is-prio2']).toBeDefined();
      expect(rowClassRules['is-info']).toBeDefined();
      expect(rowClassRules['is-deactivated']).toBeDefined();
      expect(rowClassRules['is-closed']).toBeDefined();
    });

    it('should apply "is-active" class if alert is open', () => {
      const rowClassRules = component['gridOptions'].rowClassRules as any;
      const params = { data: { open: true } } as RowClassParams<Alert>;
      const result = rowClassRules['is-active'](params);

      expect(result).toBe(true);
    });

    it('should apply "is-prio1" class if alert is open and priority is 1', () => {
      const rowClassRules = component['gridOptions'].rowClassRules as any;
      const params = {
        data: { open: true, alertPriority: 1 },
      } as RowClassParams<Alert>;
      const result = rowClassRules['is-prio1'](params);

      expect(result).toBe(true);
    });

    it('should apply "is-prio2" class if alert is open and priority is 2', () => {
      const rowClassRules = component['gridOptions'].rowClassRules as any;
      const params = {
        data: { open: true, alertPriority: 2 },
      } as RowClassParams<Alert>;
      const result = rowClassRules['is-prio2'](params);

      expect(result).toBe(true);
    });

    it('should apply "is-info" class if alert is open and priority is 3', () => {
      const rowClassRules = component['gridOptions'].rowClassRules as any;
      const params = {
        data: { open: true, alertPriority: 3 },
      } as RowClassParams<Alert>;
      const result = rowClassRules['is-info'](params);

      expect(result).toBe(true);
    });

    it('should apply "is-deactivated" class if alert is deactivated', () => {
      const rowClassRules = component['gridOptions'].rowClassRules as any;
      const params = { data: { deactivated: true } } as RowClassParams<Alert>;
      const result = rowClassRules['is-deactivated'](params);

      expect(result).toBe(true);
    });

    it('should apply "is-closed" class if alert is not open', () => {
      const rowClassRules = component['gridOptions'].rowClassRules as any;
      const params = { data: { open: false } } as RowClassParams<Alert>;
      const result = rowClassRules['is-closed'](params);

      expect(result).toBe(true);
    });
  });

  describe('context', () => {
    describe('getMenu', () => {
      let alert: Alert;
      let rowData: { data: Alert };

      beforeEach(() => {
        alert = {
          id: '1',
          openFunction: 'Function1',
          customerNumber: '123',
          customerName: 'Customer 1',
          materialNumber: '456',
          materialDescription: 'Material 1',
          open: true,
          deactivated: false,
        } as unknown as Alert;
        rowData = { data: alert };
      });

      it('should return context menu entries for an alert with openFunction', () => {
        jest
          .spyOn(component['alertService'], 'getRouteForOpenFunction')
          .mockReturnValue('/route' as any);
        jest
          .spyOn(component['alertService'], 'getModuleForOpenFunction')
          .mockReturnValue('Module 1');

        const menu = component['context'].getMenu(rowData);

        expect(menu.length).toBeGreaterThan(0);
        expect(menu[0].text).toBe('alert.action_menu.goto_function');
        expect(menu[0].submenu.length).toBe(3);
      });

      it('should return context menu entries for completing an open alert', () => {
        jest
          .spyOn(component['alertService'], 'completeAlert')
          .mockReturnValue(of({}));
        jest.spyOn(component['alertService'], 'refreshHashTimer');
        jest.spyOn(component['alertService'], 'loadActiveAlerts');
        jest.spyOn(component['snackbarService'], 'openSnackBar');
        component['gridApi'] = {
          applyServerSideTransaction: jest.fn(),
        } as unknown as GridApi<Alert>;

        const menu = component['context'].getMenu(rowData);
        const completeAction = menu.find(
          (item: any) => item.text === 'alert.action_menu.complete'
        );

        completeAction.onClick();

        expect(component['alertService'].completeAlert).toHaveBeenCalledWith(
          alert.id
        );
        expect(
          component['gridApi'].applyServerSideTransaction
        ).toHaveBeenCalled();
        expect(component['alertService'].refreshHashTimer).toHaveBeenCalled();
        expect(component['alertService'].loadActiveAlerts).toHaveBeenCalled();
        expect(component['snackbarService'].openSnackBar).toHaveBeenCalledWith(
          'alert.action_menu.alert_completed'
        );
      });

      it('should return context menu entries for activating a deactivated alert', () => {
        alert.open = false;
        alert.deactivated = true;
        jest
          .spyOn(component['alertService'], 'activateAlert')
          .mockReturnValue(of({}));
        jest.spyOn(component['alertService'], 'refreshHashTimer');
        jest.spyOn(component['alertService'], 'loadActiveAlerts');
        jest.spyOn(component['snackbarService'], 'openSnackBar');
        component['gridApi'] = {
          applyServerSideTransaction: jest.fn(),
        } as unknown as GridApi<Alert>;

        const menu = component['context'].getMenu(rowData);
        const activateAction = menu.find(
          (item: any) => item.text === 'alert.action_menu.activate'
        );

        activateAction.onClick();

        expect(component['alertService'].activateAlert).toHaveBeenCalledWith(
          alert.id
        );
        expect(
          component['gridApi'].applyServerSideTransaction
        ).toHaveBeenCalled();
        expect(component['alertService'].refreshHashTimer).toHaveBeenCalled();
        expect(component['alertService'].loadActiveAlerts).toHaveBeenCalled();
        expect(component['snackbarService'].openSnackBar).toHaveBeenCalledWith(
          'alert.action_menu.alert_activated'
        );
      });

      it('should return context menu entries for deactivating an active alert', () => {
        jest
          .spyOn(component['alertService'], 'deactivateAlert')
          .mockReturnValue(of({}));
        jest.spyOn(component['alertService'], 'refreshHashTimer');
        jest.spyOn(component['alertService'], 'loadActiveAlerts');
        jest.spyOn(component['snackbarService'], 'openSnackBar');
        component['gridApi'] = {
          applyServerSideTransaction: jest.fn(),
        } as unknown as GridApi<Alert>;

        const menu = component['context'].getMenu(rowData);
        const deactivateAction = menu.find(
          (item: any) => item.text === 'alert.action_menu.deactivate'
        );

        deactivateAction.onClick();

        expect(component['alertService'].deactivateAlert).toHaveBeenCalledWith(
          alert.id
        );
        expect(
          component['gridApi'].applyServerSideTransaction
        ).toHaveBeenCalled();
        expect(component['alertService'].refreshHashTimer).toHaveBeenCalled();
        expect(component['alertService'].loadActiveAlerts).toHaveBeenCalled();
        expect(component['snackbarService'].openSnackBar).toHaveBeenCalledWith(
          'alert.action_menu.alert_deactivated'
        );
      });

      it('should navigate with global selection for base combination', () => {
        const route = '/route';
        jest
          .spyOn(component['alertService'], 'getRouteForOpenFunction')
          .mockReturnValue(route as any);
        jest.spyOn(
          component['globalSelectionStateService'],
          'navigateWithGlobalSelection'
        );

        const menu = component['context'].getMenu(rowData);
        const baseCombinationAction = menu[0].submenu.find(
          (item: any) => item.text === 'alert.action_menu.base_combination'
        );

        baseCombinationAction.onClick();

        expect(
          component['globalSelectionStateService'].navigateWithGlobalSelection
        ).toHaveBeenCalledWith(route, {
          customerNumber: [
            {
              id: alert.customerNumber,
              text: alert.customerName,
            },
          ],
          materialNumber: [
            {
              id: alert.materialNumber,
              text: alert.materialDescription,
            },
          ],
        });
      });

      it('should navigate with global selection for customer category', () => {
        const route = '/route';
        jest
          .spyOn(component['alertService'], 'getRouteForOpenFunction')
          .mockReturnValue(route as any);
        jest.spyOn(
          component['globalSelectionStateService'],
          'navigateWithGlobalSelection'
        );

        const menu = component['context'].getMenu(rowData);
        const customerCategoryAction = menu[0].submenu.find(
          (item: any) => item.text === 'alert.action_menu.customer_category'
        );

        customerCategoryAction.onClick();

        expect(
          component['globalSelectionStateService'].navigateWithGlobalSelection
        ).toHaveBeenCalledWith(route, {
          customerNumber: [
            {
              id: alert.customerNumber,
              text: alert.customerName,
            },
          ],
          alertType: [
            {
              id: alert.type,
              text: `alert.category.${alert.type}`,
            },
          ],
        });
      });

      it('should navigate with global selection for customer', () => {
        const route = '/route';
        jest
          .spyOn(component['alertService'], 'getRouteForOpenFunction')
          .mockReturnValue(route as any);
        jest.spyOn(
          component['globalSelectionStateService'],
          'navigateWithGlobalSelection'
        );

        const menu = component['context'].getMenu(rowData);
        const customerAction = menu[0].submenu.find(
          (item: any) => item.text === 'alert.action_menu.customer'
        );

        customerAction.onClick();

        expect(
          component['globalSelectionStateService'].navigateWithGlobalSelection
        ).toHaveBeenCalledWith(route, {
          customerNumber: [
            {
              id: alert.customerNumber,
              text: alert.customerName,
            },
          ],
        });
      });
    });
  });

  describe('constructor', () => {
    it('should call setServerSideDatasource with status and priorities', () => {
      const setServerSideDatasourceSpy = jest.spyOn(
        component as any,
        'setServerSideDatasource'
      );

      Stub.setInputs([
        { property: 'priorities', value: [Priority.Priority3] },
        { property: 'status', value: AlertStatus.COMPLETED },
      ]);

      Stub.detectChanges();

      expect(setServerSideDatasourceSpy).toHaveBeenCalledWith(
        AlertStatus.COMPLETED,
        [Priority.Priority3]
      );
    });

    it('should subscribe to alertService.getRefreshEvent and call setServerSideDatasource and refreshHashTimer', () => {
      const setServerSideDatasourceSpy = jest.spyOn(
        component as any,
        'setServerSideDatasource'
      );

      jest
        .spyOn(component['alertService'], 'getRefreshEvent')
        .mockReturnValue(of(true) as any);

      Stub.setInputs([
        { property: 'priorities', value: [Priority.Priority2] },
        { property: 'status', value: AlertStatus.DEACTIVATED },
      ]);
      Stub.detectChanges();

      expect(setServerSideDatasourceSpy).toHaveBeenCalledWith(
        AlertStatus.DEACTIVATED,
        [Priority.Priority2]
      );
    });
  });

  describe('updateColumnDefs', () => {
    it('should set column definitions on gridApi', () => {
      component.gridApi = Stub.getGridApi();
      jest.spyOn(component.gridApi, 'setGridOption');
      jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue({ options: [] });

      component['updateColumnDefs']();

      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'columnDefs',
        expect.any(Array)
      );
    });

    it('should call getAlertTableColumnDefinitions with correct parameters', () => {
      component.gridApi = Stub.getGridApi();
      jest.spyOn(component.gridApi, 'setGridOption');
      const getAlertTableColumnDefinitionsSpy = jest.spyOn(
        ColDefHelper,
        'getAlertTableColumnDefinitions'
      );
      jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue({ options: [] });

      component['updateColumnDefs']();

      expect(getAlertTableColumnDefinitionsSpy).toHaveBeenCalledWith(
        component['agGridLocalizationService'],
        []
      );
    });

    it('should map column definitions correctly', () => {
      component.gridApi = Stub.getGridApi();
      jest.spyOn(component.gridApi, 'setGridOption');
      jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue({ options: [] });
      const columnDefinitions = [
        {
          field: 'testField',
          colId: 'testColId',
          filter: 'testFilter',
          filterParams: 'testFilterParams',
          sortable: true,
          flex: 1,
          type: 'testType',
          cellRenderer: 'testCellRenderer',
          minWidth: 100,
          maxWidth: 200,
          tooltipValueGetter: 'testTooltipValueGetter',
          tooltipField: 'testTooltipField',
          valueFormatter: 'testValueFormatter',
        },
      ];

      jest
        .spyOn(ColDefHelper, 'getAlertTableColumnDefinitions')
        .mockReturnValue(columnDefinitions as any);

      component['updateColumnDefs']();

      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'columnDefs',
        expect.arrayContaining([
          expect.objectContaining({
            field: 'testField',
            headerName: 'testColId',
            sortable: true,
            filter: 'testFilter',
            flex: 1,
            type: 'testType',
            cellRenderer: 'testCellRenderer',
            minWidth: 100,
            maxWidth: 200,
            tooltipValueGetter: 'testTooltipValueGetter',
            tooltipField: 'testTooltipField',
            colId: 'testField',
            valueFormatter: 'testValueFormatter',
          }),
        ])
      );
    });

    it('should add fixed action column definition', () => {
      component.gridApi = Stub.getGridApi();
      jest.spyOn(component.gridApi, 'setGridOption');
      jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue({ options: [] });

      component['updateColumnDefs']();

      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'columnDefs',
        expect.arrayContaining([
          expect.objectContaining({
            cellClass: ['fixed-action-column'],
            field: 'menu',
            headerName: '',
            cellRenderer: ActionsMenuCellRendererComponent,
            lockVisible: true,
            pinned: 'right',
            lockPinned: true,
            suppressHeaderMenuButton: true,
            maxWidth: 64,
            suppressSizeToFit: true,
          }),
        ])
      );
    });
  });

  describe('onGridReady', () => {
    let event: GridReadyEvent<Alert>;

    beforeEach(() => {
      event = {
        api: Stub.getGridApi(),
      } as GridReadyEvent<Alert>;
      component.gridApi = event.api;

      jest.spyOn(component.getApi, 'emit');
      jest.spyOn(component as any, 'updateColumnDefs');
      jest.spyOn(component as any, 'setServerSideDatasource');
      jest
        .spyOn(component['alertService'], 'getDataFetchedEvent')
        .mockReturnValue(of({ rowCount: 10 } as any));
    });

    it('should set gridApi and emit the event', () => {
      component['onGridReady'](event);

      expect(component.gridApi).toBe(event.api);
      expect(component.getApi.emit).toHaveBeenCalledWith(event.api);
    });

    it('should call updateColumnDefs if gridApi is set', () => {
      component['onGridReady'](event);

      expect(component['updateColumnDefs']).toHaveBeenCalled();
    });

    it('should call setServerSideDatasource with status and priorities if gridApi is set', () => {
      component['onGridReady'](event);

      expect(component['setServerSideDatasource']).toHaveBeenCalledWith(
        AlertStatus.ACTIVE,
        [Priority.Priority1]
      );
    });

    it('should subscribe to alertService.getDataFetchedEvent and set rowCount', (done) => {
      component['onGridReady'](event);

      setTimeout(() => {
        expect(component['rowCount']()).toBe(10);
        done();
      });
    });

    it('should set isGridAutoSized to true and call autoSizeAllColumns if not already set', () => {
      component['isGridAutoSized'].set(false);
      jest.spyOn(component['isGridAutoSized'], 'set');
      jest.spyOn(event.api, 'autoSizeAllColumns');

      component['onGridReady'](event);

      expect(component['isGridAutoSized'].set).toHaveBeenCalledWith(true);
      expect(event.api.autoSizeAllColumns).toHaveBeenCalled();
    });

    it('should not call autoSizeAllColumns if isGridAutoSized is already set', () => {
      component['isGridAutoSized'].set(true);
      jest.spyOn(event.api, 'autoSizeAllColumns');

      component['onGridReady'](event);

      expect(event.api.autoSizeAllColumns).not.toHaveBeenCalled();
    });
  });

  describe('getRowId', () => {
    it('should return the id of the alert', () => {
      const params = {
        data: { id: '123' },
      } as GetRowIdParams<Alert>;

      const result = component['getRowId'](params);

      expect(result).toBe('123');
    });

    it('should return undefined if the alert id is not present', () => {
      const params = {
        data: {},
      } as GetRowIdParams<Alert>;

      const result = component['getRowId'](params);

      expect(result).toBeUndefined();
    });

    it('should handle null data gracefully', () => {
      const params = {
        data: null,
      } as GetRowIdParams<Alert>;

      const result = component['getRowId'](params);

      expect(result).toBeUndefined();
    });

    it('should handle undefined data gracefully', () => {
      const params = {
        data: undefined,
      } as GetRowIdParams<Alert>;

      const result = component['getRowId'](params);

      expect(result).toBeUndefined();
    });
  });

  describe('onFirstDataRendered', () => {
    it('should call autoSizeAllColumns on the grid API', () => {
      const event = {
        api: {
          autoSizeAllColumns: jest.fn(),
        },
      } as unknown as FirstDataRenderedEvent;

      component['onFirstDataRendered'](event);

      expect(event.api.autoSizeAllColumns).toHaveBeenCalled();
    });

    it('should handle null event gracefully', () => {
      const event = null as unknown as FirstDataRenderedEvent;

      expect(() => component['onFirstDataRendered'](event)).not.toThrow();
    });

    it('should handle undefined event gracefully', () => {
      const event = undefined as unknown as FirstDataRenderedEvent;

      expect(() => component['onFirstDataRendered'](event)).not.toThrow();
    });

    it('should handle event with null API gracefully', () => {
      const event = {
        api: null,
      } as unknown as FirstDataRenderedEvent;

      expect(() => component['onFirstDataRendered'](event)).not.toThrow();
    });

    it('should handle event with undefined API gracefully', () => {
      const event = {
        api: undefined,
      } as unknown as FirstDataRenderedEvent;

      expect(() => component['onFirstDataRendered'](event)).not.toThrow();
    });
  });

  describe('setServerSideDatasource', () => {
    it('should set serverSideDatasource on gridApi', () => {
      component.gridApi = Stub.getGridApi();
      jest.spyOn(component.gridApi, 'setGridOption');
      jest
        .spyOn(component['alertService'], 'createAlertDatasource')
        .mockReturnValue({} as any);

      component['setServerSideDatasource'](AlertStatus.ACTIVE, [
        Priority.Priority1,
      ]);

      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'serverSideDatasource',
        expect.any(Object)
      );
    });

    it('should call createAlertDatasource with correct parameters', () => {
      component.gridApi = Stub.getGridApi();
      const createAlertDatasourceSpy = jest
        .spyOn(component['alertService'], 'createAlertDatasource')
        .mockReturnValue({} as any);

      component['setServerSideDatasource'](AlertStatus.ACTIVE, [
        Priority.Priority1,
      ]);

      expect(createAlertDatasourceSpy).toHaveBeenCalledWith(
        AlertStatus.ACTIVE,
        [Priority.Priority1]
      );
    });

    it('should handle null status and priorities gracefully', () => {
      component.gridApi = Stub.getGridApi();
      jest.spyOn(component.gridApi, 'setGridOption');
      jest
        .spyOn(component['alertService'], 'createAlertDatasource')
        .mockReturnValue({} as any);

      component['setServerSideDatasource'](null, null);

      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'serverSideDatasource',
        expect.any(Object)
      );
    });

    it('should handle empty priorities array gracefully', () => {
      component.gridApi = Stub.getGridApi();
      jest.spyOn(component.gridApi, 'setGridOption');
      jest
        .spyOn(component['alertService'], 'createAlertDatasource')
        .mockReturnValue({} as any);

      component['setServerSideDatasource'](AlertStatus.ACTIVE, []);

      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'serverSideDatasource',
        expect.any(Object)
      );
    });
  });

  describe('onDataUpdated', () => {
    beforeEach(() => {
      component.gridApi = Stub.getGridApi();
    });

    it('should show no rows overlay if displayed row count is 0', () => {
      jest.spyOn(component.gridApi, 'getDisplayedRowCount').mockReturnValue(0);
      jest.spyOn(component.gridApi, 'showNoRowsOverlay');

      component['onDataUpdated']();

      expect(component.gridApi.showNoRowsOverlay).toHaveBeenCalled();
    });

    it('should hide overlay if displayed row count is greater than 0', () => {
      jest.spyOn(component.gridApi, 'getDisplayedRowCount').mockReturnValue(1);
      jest.spyOn(component.gridApi, 'hideOverlay');

      component['onDataUpdated']();

      expect(component.gridApi.hideOverlay).toHaveBeenCalled();
    });

    it('should not throw an error if gridApi is not defined', () => {
      component.gridApi = undefined;

      expect(() => component['onDataUpdated']()).not.toThrow();
    });
  });
});
