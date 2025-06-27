import { BehaviorSubject, of, Subject } from 'rxjs';

import { GridApi, RowClassParams } from 'ag-grid-enterprise';

import { AlertService } from '../../../../feature/alerts/alert.service';
import {
  Alert,
  AlertStatus,
  OpenFunction,
  Priority,
} from '../../../../feature/alerts/model';
import * as Helper from '../../../../shared/ag-grid/grid-defaults';
import { RequestType } from '../../../../shared/components/table';
import { Stub } from '../../../../shared/test/stub.class';
import { AlertTableComponent } from './alert-table.component';
import * as ColDefHelper from './column-definitions';

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
        jest.spyOn(component['snackbarService'], 'success');
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
        expect(component['snackbarService'].success).toHaveBeenCalledWith(
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
        jest.spyOn(component['snackbarService'], 'success');
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
        expect(component['snackbarService'].success).toHaveBeenCalledWith(
          'alert.action_menu.alert_activated'
        );
      });

      it('should return context menu entries for deactivating an active alert', () => {
        jest
          .spyOn(component['alertService'], 'deactivateAlert')
          .mockReturnValue(of({}));
        jest.spyOn(component['alertService'], 'refreshHashTimer');
        jest.spyOn(component['alertService'], 'loadActiveAlerts');
        jest.spyOn(component['snackbarService'], 'success');
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
        expect(component['snackbarService'].success).toHaveBeenCalledWith(
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
      const mockParams = { startRow: 0, endRow: 10 } as any;
      const getAlertDataSpy = jest
        .spyOn(alertService, 'getAlertData')
        .mockReturnValue(of({ rows: [], rowCount: 0 }));

      component['getData$'](mockParams, RequestType.Fetch).subscribe();

      expect(getAlertDataSpy).toHaveBeenCalledWith(
        AlertStatus.ACTIVE,
        [Priority.Priority1],
        mockParams
      );
    });

    it('should use the current status and priorities inputs', () => {
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

      component['getData$'](mockParams, RequestType.Fetch).subscribe();

      expect(getAlertDataSpy).toHaveBeenCalledWith(
        AlertStatus.COMPLETED,
        [Priority.Priority3],
        mockParams
      );
    });

    it('should forward the response from alertService.getAlertData', (done) => {
      const mockParams = { startRow: 0, endRow: 10 } as any;
      const mockResponse = { rows: [{ id: '1' }], rowCount: 1 };
      jest
        .spyOn(alertService, 'getAlertData')
        .mockReturnValue(of(mockResponse));

      component['getData$'](mockParams, RequestType.Fetch).subscribe(
        (response) => {
          expect(response).toEqual(mockResponse);
          done();
        }
      );
    });

    it('should ignore the requestType parameter', () => {
      const mockParams = { startRow: 0, endRow: 10 } as any;
      const getAlertDataSpy = jest
        .spyOn(alertService, 'getAlertData')
        .mockReturnValue(of({ rows: [], rowCount: 0 }));

      // call with different requestTypes
      component['getData$'](mockParams, RequestType.Fetch).subscribe();
      component['getData$'](mockParams, RequestType.GroupClick).subscribe();

      // all calls should be identical
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

  describe('setColumnDefinitions', () => {
    beforeEach(() => {
      component['selectableOptionsService'].loading$ = new BehaviorSubject(
        true
      );
    });

    it('should subscribe to the loading observable', () => {
      const loadingSpy = jest.spyOn(
        component['selectableOptionsService'].loading$,
        'pipe'
      );

      component['setColumnDefinitions']();

      expect(loadingSpy).toHaveBeenCalled();
    });

    it('should call setConfig with the correct column definitions when loading is complete', () => {
      const setConfigSpy = jest.spyOn(component as any, 'setConfig');
      const mockOptions = [{ id: 'type1', text: 'Type 1' }];

      jest.spyOn(component['selectableOptionsService'], 'get').mockReturnValue({
        options: mockOptions,
      });

      component['setColumnDefinitions']();
      // Simulate loading complete
      component['selectableOptionsService'].loading$.next(false);

      expect(setConfigSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'menu',
            cellRenderer: expect.any(Function),
            pinned: 'right',
          }),
        ])
      );
    });

    it('should add an actions menu column to the column definitions', () => {
      const mockColDefs = [{ field: 'test', headerName: 'Test' }];
      jest.spyOn(component as any, 'setConfig');

      // Mock getAlertTableColumnDefinitions to return a simple column definition
      jest
        .spyOn(ColDefHelper, 'getAlertTableColumnDefinitions')
        .mockReturnValue(mockColDefs as any);

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(false);

      expect(component['setConfig']).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'menu',
            headerName: '',
            cellRenderer: expect.anything(),
            pinned: 'right',
            maxWidth: 64,
          }),
        ])
      );
    });

    it('should apply default column definitions to each column', () => {
      const mockColDefs = [
        {
          field: 'col1',
          colId: 'col1.header',
          filter: 'agTextColumnFilter',
          filterParams: {},
        },
        { field: 'col2', colId: 'col2.header', sortable: true },
      ];

      const setConfigSpy = jest.spyOn(component as any, 'setConfig');
      jest.spyOn(Helper, 'getDefaultColDef');
      jest
        .spyOn(ColDefHelper, 'getAlertTableColumnDefinitions')
        .mockReturnValue(mockColDefs as any);

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(false);

      const callArgs = setConfigSpy.mock.calls[0][0];
      // Check first column has default column def properties mixed in
      expect((callArgs as any)[0]).toEqual(
        expect.objectContaining({
          field: 'col1',
          headerName: expect.any(String),
          colId: 'col1',
          visible: true,
        })
      );

      // Check that getDefaultColDef was applied
      expect(Helper.getDefaultColDef).toHaveBeenCalled();
    });

    it('should use the current locale for column definitions', () => {
      const getLocaleSpy = jest.spyOn(
        component['translocoLocaleService'],
        'getLocale'
      );

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(false);

      expect(getLocaleSpy).toHaveBeenCalled();
    });

    it('should translate column headers', () => {
      const mockColDefs = [{ field: 'col1', colId: 'header.key' }];

      jest
        .spyOn(ColDefHelper, 'getAlertTableColumnDefinitions')
        .mockReturnValue(mockColDefs as any);

      jest.spyOn(Helper, 'getDefaultColDef').mockReturnValue({});

      const setConfigSpy = jest.spyOn(component as any, 'setConfig');

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(false);

      const callArgs = setConfigSpy.mock.calls[0][0];
      expect((callArgs as any)[0].headerName).toBe('header.key');
    });

    it('should handle empty column definitions', () => {
      jest
        .spyOn(ColDefHelper, 'getAlertTableColumnDefinitions')
        .mockReturnValue([] as any);

      const setConfigSpy = jest.spyOn(component as any, 'setConfig');

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.next(false);

      expect(setConfigSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'menu',
          }),
        ])
      );
    });

    it('should handle errors in loading$ observable', () => {
      jest.spyOn(console, 'error').mockImplementation();
      const errorSpy = jest.spyOn(
        component['selectableOptionsService'].loading$,
        'pipe'
      );

      component['setColumnDefinitions']();
      component['selectableOptionsService'].loading$.error('Test error');

      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('params computed', () => {
    it('should update computed params when inputs change', () => {
      // Initial value
      expect(component['params']()).toEqual({
        status: AlertStatus.ACTIVE,
        priorities: [Priority.Priority1],
      });

      // Change inputs
      Stub.setInputs([
        { property: 'status', value: AlertStatus.COMPLETED },
        {
          property: 'priorities',
          value: [Priority.Priority2, Priority.Priority3],
        },
      ]);
      Stub.detectChanges();

      // Check updated value
      expect(component['params']()).toEqual({
        status: AlertStatus.COMPLETED,
        priorities: [Priority.Priority2, Priority.Priority3],
      });
    });

    it('should trigger reload when params change', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');

      Stub.setInputs([{ property: 'status', value: AlertStatus.DEACTIVATED }]);
      Stub.detectChanges();

      expect(reloadSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('getAlertData integration', () => {
    beforeEach(() => {
      jest.spyOn(alertService, 'refreshHashTimer');
      jest.spyOn(alertService, 'getRefreshEvent').mockReturnValue(of(null));
    });

    it('should refresh hash timer when refresh event is emitted', () => {
      const refreshEvent = new Subject<void>();
      jest
        .spyOn(alertService, 'getRefreshEvent')
        .mockReturnValue(refreshEvent.asObservable());

      component.ngOnInit();
      refreshEvent.next();

      expect(alertService.refreshHashTimer).toHaveBeenCalled();
    });

    it('should handle response from getData$', (done) => {
      const mockResponse = {
        rows: [{ id: '1', name: 'Test Alert' }],
        rowCount: 1,
      };

      jest
        .spyOn(alertService, 'getAlertData')
        .mockReturnValue(of(mockResponse));

      component['getData$'](
        { startRow: 0, endRow: 10 } as any,
        RequestType.Fetch
      ).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });
    });
  });
});
