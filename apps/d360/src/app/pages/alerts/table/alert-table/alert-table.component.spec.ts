import { of } from 'rxjs';

import { GridApi, RowClassParams } from 'ag-grid-enterprise';

import { AlertService } from '../../../../feature/alerts/alert.service';
import {
  Alert,
  AlertStatus,
  OpenFunction,
  Priority,
} from '../../../../feature/alerts/model';
import { RequestType } from '../../../../shared/components/table';
import { Stub } from '../../../../shared/test/stub.class';
import { AlertTableComponent } from './alert-table.component';

describe('AlertTableComponent', () => {
  let component: AlertTableComponent;
  let alertService: AlertService;

  beforeEach(() => {
    component = Stub.getForEffect<AlertTableComponent>({
      component: AlertTableComponent,
      providers: [Stub.getAlertServiceProvider()],
    });

    alertService = component['alertService'];

    Stub.setInputs([
      { property: 'priorities', value: [Priority.Priority1] },
      { property: 'status', value: AlertStatus.ACTIVE },
    ]);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rowClassRules', () => {
    beforeEach(() => component['setConfig']([]));
    it('should have the correct row class rules', () => {
      const rowClassRules = component['config']().table.rowClassRules as any;

      expect(rowClassRules['is-active']).toBeDefined();
      expect(rowClassRules['is-prio1']).toBeDefined();
      expect(rowClassRules['is-prio2']).toBeDefined();
      expect(rowClassRules['is-info']).toBeDefined();
      expect(rowClassRules['is-deactivated']).toBeDefined();
      expect(rowClassRules['is-closed']).toBeDefined();
    });

    it('should apply "is-active" class if alert is open', () => {
      const rowClassRules = component['config']().table.rowClassRules as any;
      const params = { data: { open: true } } as RowClassParams<Alert>;
      const result = rowClassRules['is-active'](params);

      expect(result).toBe(true);
    });

    it('should apply "is-prio1" class if alert is open and priority is 1', () => {
      const rowClassRules = component['config']().table.rowClassRules as any;
      const params = {
        data: { open: true, alertPriority: 1 },
      } as RowClassParams<Alert>;
      const result = rowClassRules['is-prio1'](params);

      expect(result).toBe(true);
    });

    it('should apply "is-prio2" class if alert is open and priority is 2', () => {
      const rowClassRules = component['config']().table.rowClassRules as any;
      const params = {
        data: { open: true, alertPriority: 2 },
      } as RowClassParams<Alert>;
      const result = rowClassRules['is-prio2'](params);

      expect(result).toBe(true);
    });

    it('should apply "is-info" class if alert is open and priority is 3', () => {
      const rowClassRules = component['config']().table.rowClassRules as any;
      const params = {
        data: { open: true, alertPriority: 3 },
      } as RowClassParams<Alert>;
      const result = rowClassRules['is-info'](params);

      expect(result).toBe(true);
    });

    it('should apply "is-deactivated" class if alert is deactivated', () => {
      const rowClassRules = component['config']().table.rowClassRules as any;
      const params = { data: { deactivated: true } } as RowClassParams<Alert>;
      const result = rowClassRules['is-deactivated'](params);

      expect(result).toBe(true);
    });

    it('should apply "is-closed" class if alert is not open', () => {
      const rowClassRules = component['config']().table.rowClassRules as any;
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
        component['setConfig']([]);
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

        const menu = component['config']().table.context.getMenu(rowData);

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

        const menu = component['config']().table.context.getMenu(rowData);
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

        const menu = component['config']().table.context.getMenu(rowData);
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

        const menu = component['config']().table.context.getMenu(rowData);
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

        const menu = component['config']().table.context.getMenu(rowData);
        const baseCombinationAction = menu[0].submenu.find(
          (item: any) => item.text === 'alert.action_menu.base_combination'
        );

        baseCombinationAction.onClick();

        expect(
          component['globalSelectionStateService'].navigateWithGlobalSelection
        ).toHaveBeenCalledWith(
          route,
          {
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
          },
          undefined
        );
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

        const menu = component['config']().table.context.getMenu(rowData);
        const customerCategoryAction = menu[0].submenu.find(
          (item: any) => item.text === 'alert.action_menu.customer_category'
        );

        customerCategoryAction.onClick();

        expect(
          component['globalSelectionStateService'].navigateWithGlobalSelection
        ).toHaveBeenCalledWith(
          route,
          {
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
          },
          undefined
        );
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

        const menu = component['config']().table.context.getMenu(rowData);
        const customerAction = menu[0].submenu.find(
          (item: any) => item.text === 'alert.action_menu.customer'
        );

        customerAction.onClick();

        expect(
          component['globalSelectionStateService'].navigateWithGlobalSelection
        ).toHaveBeenCalledWith(
          route,
          {
            customerNumber: [
              {
                id: alert.customerNumber,
                text: alert.customerName,
              },
            ],
          },
          undefined
        );
      });

      it('should set activateToggle to true if alert.type is included in alertTypesToActivateToggleViaURL', () => {
        alert = {
          type: 'someType',
          openFunction: OpenFunction.Customer_Material_Portfolio,
        } as any;
        const alertTypesToActivateToggleViaURL = ['someType', 'anotherType'];

        const result =
          alert.openFunction === OpenFunction.Customer_Material_Portfolio
            ? {
                state: {
                  activateToggle: alertTypesToActivateToggleViaURL.includes(
                    alert?.type
                  ),
                },
              }
            : undefined;

        expect(result?.state?.activateToggle).toBe(true);
      });

      it('should set activateToggle to false if alert.type is not included in alertTypesToActivateToggleViaURL', () => {
        alert = {
          type: 'differentType',
          openFunction: OpenFunction.Customer_Material_Portfolio,
        } as any;
        const alertTypesToActivateToggleViaURL = ['someType', 'anotherType'];

        const result =
          alert.openFunction === OpenFunction.Customer_Material_Portfolio
            ? {
                state: {
                  activateToggle: alertTypesToActivateToggleViaURL.includes(
                    alert?.type
                  ),
                },
              }
            : undefined;

        expect(result?.state?.activateToggle).toBe(false);
      });

      it('should return undefined if alert.openFunction is not Customer_Material_Portfolio', () => {
        alert = { type: 'someType', openFunction: 'DifferentFunction' } as any;
        const alertTypesToActivateToggleViaURL = ['someType', 'anotherType'];

        const result =
          alert.openFunction === OpenFunction.Customer_Material_Portfolio
            ? {
                state: {
                  activateToggle: alertTypesToActivateToggleViaURL.includes(
                    alert?.type
                  ),
                },
              }
            : undefined;

        expect(result).toBeUndefined();
      });
    });
  });

  describe('getData', () => {
    it('should call alertService.getAlertData with correct parameters', () => {
      // Arrange
      const mockParams = { startRow: 0, endRow: 10 } as any;
      const getAlertDataSpy = jest
        .spyOn(alertService, 'getAlertData')
        .mockReturnValue(of({ rows: [], rowCount: 0 }));

      // Act
      component['getData$'](mockParams, RequestType.Fetch).subscribe();

      // Assert
      expect(getAlertDataSpy).toHaveBeenCalledWith(
        AlertStatus.ACTIVE,
        [Priority.Priority1],
        mockParams
      );
    });

    it('should use the current status and priorities inputs', () => {
      // Arrange
      const mockParams = { startRow: 0, endRow: 10 } as any;
      const getAlertDataSpy = jest
        .spyOn(alertService, 'getAlertData')
        .mockReturnValue(of({ rows: [], rowCount: 0 }));

      // Change inputs to different values
      Stub.setInputs([
        { property: 'priorities', value: [Priority.Priority3] },
        { property: 'status', value: AlertStatus.COMPLETED },
      ]);
      Stub.detectChanges();

      // Act
      component['getData$'](mockParams, RequestType.Fetch).subscribe();

      // Assert
      expect(getAlertDataSpy).toHaveBeenCalledWith(
        AlertStatus.COMPLETED,
        [Priority.Priority3],
        mockParams
      );
    });

    it('should forward the response from alertService.getAlertData', (done) => {
      // Arrange
      const mockParams = { startRow: 0, endRow: 10 } as any;
      const mockResponse = { rows: [{ id: '1' }], rowCount: 1 };
      jest
        .spyOn(alertService, 'getAlertData')
        .mockReturnValue(of(mockResponse));

      // Act
      component['getData$'](mockParams, RequestType.Fetch).subscribe(
        (response) => {
          // Assert
          expect(response).toEqual(mockResponse);
          done();
        }
      );
    });

    it('should ignore the requestType parameter', () => {
      // Arrange
      const mockParams = { startRow: 0, endRow: 10 } as any;
      const getAlertDataSpy = jest
        .spyOn(alertService, 'getAlertData')
        .mockReturnValue(of({ rows: [], rowCount: 0 }));

      // Act - call with different requestTypes
      component['getData$'](mockParams, RequestType.Fetch).subscribe();
      component['getData$'](mockParams, RequestType.GroupClick).subscribe();

      // Assert - all calls should be identical
      expect(getAlertDataSpy).toHaveBeenCalledTimes(2);
      expect(getAlertDataSpy).toHaveBeenNthCalledWith(
        1,
        AlertStatus.ACTIVE,
        [Priority.Priority1],
        mockParams
      );
      expect(getAlertDataSpy).toHaveBeenNthCalledWith(
        2,
        AlertStatus.ACTIVE,
        [Priority.Priority1],
        mockParams
      );
    });
  });

  describe('constructor', () => {
    it('should call setColumnDefinitions with status and priorities', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');

      Stub.setInputs([
        { property: 'priorities', value: [Priority.Priority3] },
        { property: 'status', value: AlertStatus.COMPLETED },
      ]);

      Stub.detectChanges();

      expect(reloadSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('ngOnInit', () => {
    it('should call setColumnDefinitions', () => {
      const setColumnDefinitionsSpy = jest.spyOn<any, any>(
        component,
        'setColumnDefinitions'
      );

      component.ngOnInit();

      expect(setColumnDefinitionsSpy).toHaveBeenCalled();
    });

    it('should subscribe to the alertService refresh event and call refreshHashTimer', () => {
      const refreshHashTimerSpy = jest.spyOn(
        component['alertService'],
        'refreshHashTimer'
      );
      const getRefreshEventSpy = jest.spyOn(
        component['alertService'],
        'getRefreshEvent'
      );

      component.ngOnInit();
      component['alertService']['refreshEvent'].next();

      expect(getRefreshEventSpy).toHaveBeenCalled();
      expect(refreshHashTimerSpy).toHaveBeenCalled();
    });
  });

  describe('setConfig', () => {
    it('should set the table configuration with the provided column definitions', () => {
      const mockColumnDefs = [
        { field: 'col1', headerName: 'Column 1' },
        { field: 'col2', headerName: 'Column 2' },
      ];
      const setSpy = jest.spyOn(component['config'], 'set');

      component['setConfig'](mockColumnDefs);

      expect(setSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          table: expect.objectContaining({
            tableId: 'alerts',
            columnDefs: [
              {
                columnDefs: [
                  { field: 'col1', headerName: 'Column 1' },
                  { field: 'col2', headerName: 'Column 2' },
                ],
                layoutId: 0,
                title: 'table.defaultTab',
              },
            ],
          }),
        })
      );
    });

    it('should add context menu entries for alerts with openFunction', () => {
      const mockColumnDefs = [] as any;
      const mockAlert = {
        id: '1',
        openFunction: 'someFunction',
        customerNumber: '123',
        customerName: 'Customer Name',
        materialNumber: '456',
        materialDescription: 'Material Description',
        type: 'alertType',
      };
      component['setConfig'](mockColumnDefs);
      const getMenu = component['config']()['table'].context.getMenu;

      const menu = getMenu({ data: mockAlert });

      expect(menu).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: expect.any(String),
            submenu: expect.any(Array),
          }),
        ])
      );
    });

    it('should add a "complete" menu entry for open alerts', () => {
      const mockColumnDefs = [] as any;
      const mockAlert = {
        id: '1',
        open: true,
        deactivated: false,
      };
      const completeAlertSpy = jest
        .spyOn(component['alertService'], 'completeAlert')
        .mockReturnValue(of(null));
      component['setConfig'](mockColumnDefs);
      const getMenu = component['config']()['table'].context.getMenu;

      const menu = getMenu({ data: mockAlert });
      const completeMenu = menu.find((item: any) =>
        item.text.includes('alert.action_menu.complete')
      );

      expect(completeMenu).toBeDefined();
      completeMenu.onClick();
      expect(completeAlertSpy).toHaveBeenCalledWith('1');
    });

    it('should add an "activate" menu entry for deactivated alerts', () => {
      const mockColumnDefs = [] as any;
      const mockAlert = {
        id: '1',
        deactivated: true,
      };
      const activateAlertSpy = jest
        .spyOn(component['alertService'], 'activateAlert')
        .mockReturnValue(of(null));
      component['setConfig'](mockColumnDefs);
      const getMenu = component['config']()['table'].context.getMenu;

      const menu = getMenu({ data: mockAlert });
      const activateMenu = menu.find((item: any) =>
        item.text.includes('alert.action_menu.activate')
      );

      expect(activateMenu).toBeDefined();
      activateMenu.onClick();
      expect(activateAlertSpy).toHaveBeenCalledWith('1');
    });

    it('should add a "deactivate" menu entry for active alerts', () => {
      const mockColumnDefs = [] as any;
      const mockAlert = {
        id: '1',
        open: true,
        deactivated: false,
      };
      const deactivateAlertSpy = jest
        .spyOn(component['alertService'], 'deactivateAlert')
        .mockReturnValue(of(null));
      component['setConfig'](mockColumnDefs);
      const getMenu = component['config']()['table'].context.getMenu;

      const menu = getMenu({ data: mockAlert });
      const deactivateMenu = menu.find((item: any) =>
        item.text.includes('alert.action_menu.deactivate')
      );

      expect(deactivateMenu).toBeDefined();
      deactivateMenu.onClick();
      expect(deactivateAlertSpy).toHaveBeenCalledWith('1');
    });
  });
});
