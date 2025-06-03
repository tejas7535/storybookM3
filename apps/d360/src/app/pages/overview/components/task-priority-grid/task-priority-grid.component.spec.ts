import { of, take } from 'rxjs';

import { ColDef } from 'ag-grid-enterprise';

import { AlertService } from '../../../../feature/alerts/alert.service';
import { OpenFunction, Priority } from '../../../../feature/alerts/model';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { AbstractFrontendTableComponent } from '../../../../shared/components/table';
import { Stub } from '../../../../shared/test/stub.class';
import { TaskPrioritiesComponent } from '../task-priorities/task-priorities.component';
import { TaskPriorityGridComponent } from './task-priority-grid.component';

describe('TaskPriorityGridComponent', () => {
  let component: TaskPriorityGridComponent;
  let alertService: AlertService;
  let globalSelectionStateService: GlobalSelectionStateService;

  beforeEach(() => {
    component = Stub.getForEffect<TaskPriorityGridComponent>({
      component: TaskPriorityGridComponent,
      providers: [Stub.getAlertServiceProvider()],
    });

    alertService = component['alertService'];
    globalSelectionStateService = component['globalSelectionStateService'];

    Stub.setInput('openFunction', OpenFunction.Validation_Of_Demand);
    Stub.setInput('customers', ['Customer1']);
    Stub.setInput('gkamNumbers', ['GKAM1']);
    Stub.setInput('priorities', [Priority.Priority1]);
    Stub.setInput('headline', 'any headline');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should trigger reload$ when filteredData changes', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');
      const filteredDataSpy = jest.spyOn<any, any>(component, 'filteredData');

      // Mock filteredData to return a value
      filteredDataSpy.mockReturnValue([{ customerNumber: '123' }]);

      // Trigger the effect
      Stub.detectChanges();

      expect(filteredDataSpy).toHaveBeenCalled();
      expect(reloadSpy).toHaveBeenCalledWith(true);
    });

    it('should not trigger reload$ when filteredData is empty', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');
      const filteredDataSpy = jest.spyOn<any, any>(component, 'filteredData');

      // Mock filteredData to return an empty array
      filteredDataSpy.mockReturnValue(false);

      // Trigger the effect
      Stub.detectChanges();

      expect(filteredDataSpy).toHaveBeenCalled();
      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should call super.ngOnInit and subscribe to fetch error events', () => {
      const superNgOnInitSpy = jest.spyOn(
        AbstractFrontendTableComponent.prototype,
        'ngOnInit'
      );
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');
      const alertServiceSpy = jest
        .spyOn(component['alertService'], 'getFetchErrorEvent')
        .mockReturnValue(of(true));

      component.ngOnInit();

      expect(superNgOnInitSpy).toHaveBeenCalled();
      expect(alertServiceSpy).toHaveBeenCalled();
      expect(reloadSpy).toHaveBeenCalledWith(true);
    });

    it('should not trigger reload$ if there is no fetch error', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');
      jest
        .spyOn(component['alertService'], 'getFetchErrorEvent')
        .mockReturnValue(of(false));

      component.ngOnInit();

      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });

  describe('filteredData', () => {
    it('should filter alerts by openFunction, customers, gkamNumbers, and priorities', () => {
      const mockAlerts = [
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer1',
          keyAccount: 'GKAM1',
          priorityCount: { [Priority.Priority1]: 1 },
        },
        {
          openFunction: OpenFunction.Customer_Material_Portfolio,
          customerNumber: 'Customer2',
          keyAccount: 'GKAM2',
          priorityCount: { [Priority.Priority2]: 1 },
        },
      ];

      jest
        .spyOn(alertService, 'allActiveAlerts')
        .mockReturnValue(mockAlerts as any);
      jest
        .spyOn(alertService, 'groupDataByCustomerAndPriority')
        .mockImplementation((alerts) => alerts as any);

      const result = component['filteredData']();

      expect(result).toEqual([
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer1',
          keyAccount: 'GKAM1',
          priorityCount: { [Priority.Priority1]: 1 },
        },
      ]);
    });

    it('should return an empty array if no alerts match the filters', () => {
      const mockAlerts = [
        {
          openFunction: OpenFunction.Customer_Material_Portfolio,
          customerNumber: 'Customer2',
          keyAccount: 'GKAM2',
          priorityCount: { [Priority.Priority2]: 1 },
        },
      ];

      jest
        .spyOn(alertService, 'allActiveAlerts')
        .mockReturnValue(mockAlerts as any);
      jest
        .spyOn(alertService, 'groupDataByCustomerAndPriority')
        .mockImplementation((alerts) => alerts as any);

      const result = component['filteredData']();

      expect(result).toEqual([]);
    });

    it('should not filter by customers, gkamNumbers, or priorities if they are not set', () => {
      Stub.setInput('customers', null);
      Stub.setInput('gkamNumbers', null);
      Stub.setInput('priorities', null);

      const mockAlerts = [
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer1',
          keyAccount: 'GKAM1',
          priorityCount: { [Priority.Priority1]: 1 },
        },
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer2',
          keyAccount: 'GKAM2',
          priorityCount: { [Priority.Priority2]: 1 },
        },
      ];

      jest
        .spyOn(alertService, 'allActiveAlerts')
        .mockReturnValue(mockAlerts as any);
      jest
        .spyOn(alertService, 'groupDataByCustomerAndPriority')
        .mockImplementation((alerts) => alerts as any);

      const result = component['filteredData']();

      expect(result).toEqual(mockAlerts);
    });

    it('should not filter if priorities is an empty array', () => {
      Stub.setInput('customers', null);
      Stub.setInput('gkamNumbers', null);
      Stub.setInput('priorities', []);

      const mockedAlerts = [
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer1',
          keyAccount: 'GKAM1',
          priorityCount: { [Priority.Priority1]: 1 },
        },
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer2',
          keyAccount: 'GKAM2',
          priorityCount: { [Priority.Priority2]: 1 },
        },
      ];

      jest
        .spyOn(alertService, 'allActiveAlerts')
        .mockReturnValue(mockedAlerts as any);
      jest
        .spyOn(alertService, 'groupDataByCustomerAndPriority')
        .mockImplementation((alerts) => alerts as any);

      const result = component['filteredData']();

      expect(result).toEqual(mockedAlerts);
    });

    it('should filter entries that contain least one alert with the priority', () => {
      Stub.setInput('customers', null);
      Stub.setInput('gkamNumbers', null);
      Stub.setInput('priorities', [Priority.Priority1]);

      const mockAlerts = [
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer1',
          keyAccount: 'GKAM1',
          priorityCount: { [Priority.Priority1]: 1 },
        },
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer2',
          keyAccount: 'GKAM2',
          priorityCount: { [Priority.Priority2]: 1 },
        },
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer3',
          keyAccount: 'GKAM3',
          priorityCount: { [Priority.Priority1]: 1, [Priority.Priority2]: 1 },
        },
      ];

      jest
        .spyOn(alertService, 'allActiveAlerts')
        .mockReturnValue(mockAlerts as any);
      jest
        .spyOn(alertService, 'groupDataByCustomerAndPriority')
        .mockImplementation((alerts) => alerts as any);

      const result = component['filteredData']();

      expect(result).toEqual([
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer1',
          keyAccount: 'GKAM1',
          priorityCount: { [Priority.Priority1]: 1 },
        },
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer3',
          keyAccount: 'GKAM3',
          priorityCount: { [Priority.Priority1]: 1, [Priority.Priority2]: 1 },
        },
      ]);
    });
    it('should handle allActiveAlerts returning null', () => {
      jest.spyOn(alertService, 'allActiveAlerts').mockReturnValue(null);

      const result = component['filteredData']();
      expect(result).toEqual([]);
    });

    it('should handle alerts with no priorityCount property', () => {
      const mockAlerts = [
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer1',
          keyAccount: 'GKAM1',
          // missing priorityCount
        },
      ];

      jest
        .spyOn(alertService, 'allActiveAlerts')
        .mockReturnValue(mockAlerts as any);
      jest
        .spyOn(alertService, 'groupDataByCustomerAndPriority')
        .mockImplementation((alerts) => alerts as any);

      Stub.setInput('priorities', [Priority.Priority1]);
      const result = component['filteredData']();
      expect(result).toEqual([]);
    });

    it('should handle multiple priorities in input', () => {
      Stub.setInput('priorities', [Priority.Priority1, Priority.Priority3]);
      Stub.detectChanges();

      const mockAlerts = [
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer1',
          keyAccount: 'GKAM1',
          priorityCount: { [Priority.Priority1]: 1 },
        },
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer2',
          keyAccount: 'GKAM2',
          priorityCount: { [Priority.Priority2]: 1 },
        },
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer3',
          keyAccount: 'GKAM3',
          priorityCount: { [Priority.Priority3]: 1 },
        },
      ];

      jest
        .spyOn(alertService, 'allActiveAlerts')
        .mockReturnValue(mockAlerts as any);
      jest
        .spyOn(alertService, 'groupDataByCustomerAndPriority')
        .mockImplementation((alerts) => alerts as any);

      const result = component['filteredData']();
      expect(result).toEqual([]);
    });

    it('should handle filter when priorityCount value is 0', () => {
      Stub.setInput('priorities', [Priority.Priority1]);

      const mockAlerts = [
        {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: 'Customer1',
          keyAccount: 'GKAM1',
          priorityCount: { [Priority.Priority1]: 0 },
        },
      ];

      jest
        .spyOn(alertService, 'allActiveAlerts')
        .mockReturnValue(mockAlerts as any);
      jest
        .spyOn(alertService, 'groupDataByCustomerAndPriority')
        .mockImplementation((alerts) => alerts as any);

      const result = component['filteredData']();
      expect(result).toEqual([]);
    });
  });

  describe('context', () => {
    it('should return a custom menu with priorities and selected priorities', () => {
      const mockRow = {
        data: {
          openFunction: OpenFunction.Customer_Material_Portfolio,
          customerNumber: '12345',
          customerName: 'Customer A',
          priorityCount: { [Priority.Priority1]: 1 },
          alertTypes: {
            [Priority.Priority1]: ['RESEDP'],
          },
          materialNumbers: {
            [Priority.Priority1]: [{ id: 'M1', text: 'Material 1' }],
          },
        },
      };

      jest
        .spyOn(alertService, 'getRouteForOpenFunction')
        .mockReturnValue('/route' as any);

      jest
        .spyOn(component as any, 'getSelectableOptionForAlert')
        .mockReturnValue({ id: 'RESEDP', text: 'RESEDP' });
      jest
        .spyOn(alertService, 'getModuleForOpenFunction')
        .mockReturnValue('Module');
      const navigateSpy = jest.spyOn(
        globalSelectionStateService,
        'navigateWithGlobalSelection'
      );

      const menu = component['context'].getMenu(mockRow);

      expect(menu).toEqual([
        {
          text: 'alert.action_menu.goto_function',
          submenu: [
            {
              text: 'overview.yourTasks.priority1',
              onClick: expect.any(Function),
            },
            {
              text: 'overview.yourTasks.selectedPriorities',
              onClick: expect.any(Function),
            },
          ],
        },
      ]);

      // Test submenu actions
      menu[0].submenu[0].onClick();
      expect(navigateSpy).toHaveBeenCalledWith(
        '/route',
        {
          customerNumber: [{ id: '12345', text: 'Customer A' }],
          alertType: [{ id: 'RESEDP', text: 'RESEDP' }],
          materialNumber: [{ id: 'M1', text: 'Material 1' }],
        },
        { state: { activateToggle: true } }
      );

      menu[0].submenu[1].onClick();
      expect(navigateSpy).toHaveBeenCalledWith(
        '/route',
        {
          customerNumber: [{ id: '12345', text: 'Customer A' }],
          alertType: [{ id: 'RESEDP', text: 'RESEDP' }],
          materialNumber: [{ id: 'M1', text: 'Material 1' }],
        },
        { state: { activateToggle: true } }
      );
    });

    it('should return an empty menu if openFunction is not defined', () => {
      const mockRow = { data: { openFunction: null } as any };

      const menu = component['context'].getMenu(mockRow);

      expect(menu).toEqual([]);
    });
  });

  describe('context menu additional tests', () => {
    it('should not include activateToggle state when openFunction is not Customer_Material_Portfolio', () => {
      const mockRow = {
        data: {
          openFunction: OpenFunction.Validation_Of_Demand,
          customerNumber: '12345',
          customerName: 'Customer A',
          priorityCount: { [Priority.Priority1]: 1 },
          alertTypes: {
            [Priority.Priority1]: ['ALERT_TYPE'],
          },
          materialNumbers: {
            [Priority.Priority1]: [{ id: 'M1', text: 'Material 1' }],
          },
        },
      };

      jest
        .spyOn(alertService, 'getRouteForOpenFunction')
        .mockReturnValue('/route' as any);
      jest
        .spyOn(component as any, 'getSelectableOptionForAlert')
        .mockReturnValue({ id: 'ALERT_TYPE', text: 'Alert Type' });
      const navigateSpy = jest.spyOn(
        globalSelectionStateService,
        'navigateWithGlobalSelection'
      );

      const menu = component['context'].getMenu(mockRow);
      menu[0].submenu[0].onClick();

      expect(navigateSpy).toHaveBeenCalledWith(
        '/route',
        {
          customerNumber: [{ id: '12345', text: 'Customer A' }],
          alertType: [{ id: 'ALERT_TYPE', text: 'Alert Type' }],
          materialNumber: [{ id: 'M1', text: 'Material 1' }],
        },
        undefined
      );
    });

    it('should handle empty or undefined alertTypes and materialNumbers', () => {
      const mockRow = {
        data: {
          openFunction: OpenFunction.Customer_Material_Portfolio,
          customerNumber: '12345',
          customerName: 'Customer A',
          priorityCount: { [Priority.Priority1]: 1 },
          alertTypes: {},
          materialNumbers: {},
        },
      };

      jest
        .spyOn(alertService, 'getRouteForOpenFunction')
        .mockReturnValue('/route' as any);
      jest
        .spyOn(alertService, 'getModuleForOpenFunction')
        .mockReturnValue('Module');
      const navigateSpy = jest.spyOn(
        globalSelectionStateService,
        'navigateWithGlobalSelection'
      );

      const menu = component['context'].getMenu(mockRow);
      menu[0].submenu[0].onClick();

      expect(navigateSpy).toHaveBeenCalledWith(
        '/route',
        {
          customerNumber: [{ id: '12345', text: 'Customer A' }],
          alertType: [],
          materialNumber: [],
        },
        { state: { activateToggle: false } }
      );
    });

    it('should handle null alertTypes and materialNumbers', () => {
      const mockRow = {
        data: {
          openFunction: OpenFunction.Customer_Material_Portfolio,
          customerNumber: '12345',
          customerName: 'Customer A',
          priorityCount: { [Priority.Priority1]: 1 },
          alertTypes: null,
          materialNumbers: null,
        },
      } as any;

      jest
        .spyOn(alertService, 'getRouteForOpenFunction')
        .mockReturnValue('/route' as any);
      jest
        .spyOn(alertService, 'getModuleForOpenFunction')
        .mockReturnValue('Module');
      const navigateSpy = jest.spyOn(
        globalSelectionStateService,
        'navigateWithGlobalSelection'
      );

      const menu = component['context'].getMenu(mockRow);
      menu[0].submenu[0].onClick();

      expect(navigateSpy).toHaveBeenCalledWith(
        '/route',
        {
          customerNumber: [{ id: '12345', text: 'Customer A' }],
          alertType: [],
          materialNumber: [],
        },
        { state: { activateToggle: false } }
      );
    });

    it('should check all selected priorities for submenu actions', () => {
      Stub.setInput('priorities', [Priority.Priority1, Priority.Priority2]);
      Stub.detectChanges();

      const mockRow = {
        data: {
          openFunction: OpenFunction.Customer_Material_Portfolio,
          customerNumber: '12345',
          customerName: 'Customer A',
          priorityCount: {
            [Priority.Priority1]: 1,
            [Priority.Priority2]: 2,
          },
          alertTypes: {
            [Priority.Priority1]: ['TYPE1'],
            [Priority.Priority2]: ['TYPE2'],
          },
          materialNumbers: {
            [Priority.Priority1]: [{ id: 'M1', text: 'Material 1' }],
            [Priority.Priority2]: [{ id: 'M2', text: 'Material 2' }],
          },
        },
      };

      jest
        .spyOn(alertService, 'getRouteForOpenFunction')
        .mockReturnValue('/route' as any);
      jest
        .spyOn(component as any, 'getSelectableOptionForAlert')
        .mockImplementation((type) => ({ id: type, text: type }));
      const navigateSpy = jest.spyOn(
        globalSelectionStateService,
        'navigateWithGlobalSelection'
      );

      const menu = component['context'].getMenu(mockRow);

      // Test selectedPriorities action
      menu[0].submenu[2].onClick();

      expect(navigateSpy).toHaveBeenCalledWith(
        '/route',
        {
          customerNumber: [{ id: '12345', text: 'Customer A' }],
          alertType: [
            { id: 'TYPE1', text: 'TYPE1' },
            { id: 'TYPE2', text: 'TYPE2' },
          ],
          materialNumber: [
            { id: 'M1', text: 'Material 1' },
            { id: 'M2', text: 'Material 2' },
          ],
        },
        { state: { activateToggle: false } }
      );
    });
  });

  describe('getData', () => {
    it('should return filtered data wrapped in a FrontendTableResponse', (done) => {
      const mockFilteredData = [
        { customerNumber: '123', customerName: 'Customer A' },
        { customerNumber: '456', customerName: 'Customer B' },
      ];

      jest
        .spyOn(component as any, 'filteredData')
        .mockReturnValue(mockFilteredData);

      component['getData$']()
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({ content: mockFilteredData });
          done();
        });
    });

    it('should return an empty content array if filteredData is empty', (done) => {
      jest.spyOn(component as any, 'filteredData').mockReturnValue([]);

      component['getData$']()
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({ content: [] });
          done();
        });
    });
  });

  describe('setConfig', () => {
    it('should configure the table with the correct settings', () => {
      const mockColumnDefs: ColDef[] = [
        { field: 'customerNumber', width: 90 },
        { field: 'customerName', flex: 1 },
      ];

      const configSetSpy = jest.spyOn(component['config'], 'set');
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');

      component['selectableOptionsService'].loading$.next(false);
      jest.spyOn(component['isLoading$'], 'pipe').mockReturnValue(of(false));

      component['setConfig'](mockColumnDefs);

      expect(configSetSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          table: expect.objectContaining({
            tableId: `task-priority-grid${component.openFunction()}`,
            context: component['context'],
            columnDefs: [
              {
                columnDefs: mockColumnDefs,
                layoutId: 0,
                title: 'table.defaultTab',
              },
            ],
            noRowsMessage: 'overview.yourTasks.noTasks',
            getRowId: expect.any(Function),
            autoSizeStrategy: false,
            sideBar: {},
            headerHeight: 0,
            cellSelection: false,
            suppressCellFocus: true,
          }),
          isLoading$: expect.any(Object),
          hasTabView: false,
          hasToolbar: false,
          callbacks: {
            onGridReady: expect.any(Function),
          },
        })
      );

      // Test getRowId function
      const getRowIdFn = configSetSpy.mock.calls[0][0].table.getRowId as any;
      const mockRowData = { customerNumber: '12345' };
      expect(getRowIdFn({ data: mockRowData })).toBe('12345');

      // Test onGridReady callback
      const onGridReadyFn = configSetSpy.mock.calls[0][0].callbacks
        .onGridReady as any;
      onGridReadyFn();
      expect(reloadSpy).toHaveBeenCalledWith(true);
    });

    it('should combine isLoading$ and selectableOptionsService.loading$ for isLoading$', (done) => {
      component['selectableOptionsService'].loading$.next(true);
      component['isLoading$'] = of(false);

      component['setConfig']([]);

      component['config']()
        .isLoading$.pipe(take(1))
        .subscribe((isLoading) => {
          expect(isLoading).toBe(true);
          done();
        });
    });
  });

  describe('setColumnDefinitions', () => {
    it('should configure the table with the correct column definitions', () => {
      const setConfigSpy = jest.spyOn<any, any>(component, 'setConfig');

      component['setColumnDefinitions']();

      expect(setConfigSpy).toHaveBeenCalledWith([
        {
          field: 'customerNumber',
          width: 90,
          cellStyle: { padding: 0 },
        },
        {
          field: 'customerName',
          flex: 1,
          cellStyle: { padding: 0 },
        },
        {
          field: 'priorityCount',
          width: 145,
          cellRenderer: TaskPrioritiesComponent,
          cellStyle: { padding: 0 },
        },
        {
          cellClass: ['fixed-action-column'],
          field: 'menu',
          width: 50,
          cellRenderer: ActionsMenuCellRendererComponent,
          cellStyle: { borderLeft: 0 },
        },
      ]);
    });
  });

  describe('getSelectableOptionForAlert', () => {
    it('should return the matching option when loadingError is null', () => {
      const mockOptions = {
        loadingError: null,
        options: [
          { id: 'success', text: 'success' },
          { id: 'info', text: 'info' },
        ],
      } as any;

      jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue(mockOptions);

      const result = component['getSelectableOptionForAlert']('success');

      expect(result).toEqual({ id: 'success', text: 'success' });
    });

    it('should return a fallback option when loadingError is not null', () => {
      const mockOptions = {
        loadingError: 'Error loading options',
        options: [],
      } as any;

      jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue(mockOptions);

      const result = component['getSelectableOptionForAlert']('success');

      expect(result).toEqual({
        id: 'success',
        text: 'success',
      });
    });

    it('should return a fallback option when no matching option is found', () => {
      const mockOptions = {
        loadingError: null,
        options: [{ id: 'info', text: 'info' }],
      } as any;

      jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue(mockOptions);

      const result = component['getSelectableOptionForAlert']('success');

      expect(result).toEqual({
        id: 'success',
        text: 'success',
      });
    });

    it('should return a fallback option if loadingError is not null', () => {
      const mockOptions = {
        loadingError: true,
        options: [],
      } as any;

      jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue(mockOptions);

      const result = component['getSelectableOptionForAlert']('success');

      expect(result).toEqual({
        id: 'success',
        text: 'success',
      });
    });

    it('should return the original alertType if selectableOptionsService.get returns undefined', () => {
      jest
        .spyOn(component['selectableOptionsService'], 'get')
        .mockReturnValue(undefined as any);

      const result = component['getSelectableOptionForAlert']('unknown' as any);

      expect(result).toEqual({
        id: 'unknown',
        text: 'unknown',
      });
    });
  });
});
