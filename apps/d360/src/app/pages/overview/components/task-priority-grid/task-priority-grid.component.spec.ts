import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';

import {
  AlertService,
  GroupedAlert,
} from '../../../../feature/alerts/alert.service';
import {
  Alert,
  AlertCategory,
  OpenFunction,
  Priority,
} from '../../../../feature/alerts/model';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableOptionsService } from '../../../../shared/services/selectable-options.service';
import { Stub } from '../../../../shared/test/stub.class';
import { TaskPrioritiesComponent } from '../task-priorities/task-priorities.component';
import {
  aciadpOption,
  alertTypeOptionMocks,
  cfpraoOption,
} from './alert.service.mocks';
import { TaskPriorityGridComponent } from './task-priority-grid.component';

describe('TaskPriorityGridComponent', () => {
  let spectator: Spectator<TaskPriorityGridComponent>;
  const groupedAlert: GroupedAlert = {
    alertTypes: {
      1: [AlertCategory.ACIADP],
      2: [AlertCategory.ACIADP, AlertCategory.CFPRAO],
    },
    customerName: 'first customer',
    customerNumber: '1',
    openFunction: OpenFunction.Validation_Of_Demand,
    priorityCount: { 1: 5, 2: 1 },
    materialNumbers: {
      1: [{ id: '1', text: 'Material 1' }],
      2: [{ id: '2', text: 'Material 2' }],
      3: [{ id: '3', text: 'Material 3' }],
    },
  };
  const globalNavigate = jest.fn();
  const testAlert1: Alert = {
    customerName: 'first customer',
    customerNumber: '1',
    materialNumber: '1',
    materialDescription: 'Material 1',
    keyAccount: 'gkam1',
    alertPriority: Priority.Priority1,
    open: true,
    priority: false,
    deactivated: false,
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.ACIADP,
  };
  const testAlert2: Alert = {
    customerName: 'second customer',
    customerNumber: '2',
    materialNumber: '2',
    materialDescription: 'Material 2',
    keyAccount: 'gkam2',
    alertPriority: Priority.Priority2,
    open: true,
    priority: false,
    deactivated: false,
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.CFPRAO,
  };
  const testAlert3 = {
    customerName: 'third customer',
    customerNumber: '3',
    materialNumber: '3',
    materialDescription: 'Material 3',
    keyAccount: 'gkam3',
    alertPriority: Priority.Priority3,
    open: true,
    priority: false,
    deactivated: false,
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.NPOSDP,
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('context', () => {
    it('should set activateToggle to true if any alert type in alert.alertTypes[priority] is included in alertTypesToActivateToggleViaURL', () => {
      const alert = {
        alertTypes: {
          high: ['type1', 'type2'],
        },
        openFunction: OpenFunction.Customer_Material_Portfolio,
      };
      const alertTypesToActivateToggleViaURL = ['type2', 'type3'] as any;
      const priority = 'high';

      const result =
        alert.openFunction === OpenFunction.Customer_Material_Portfolio
          ? {
              state: {
                activateToggle: (alert?.alertTypes[priority] || [])?.some(
                  (type: any) => alertTypesToActivateToggleViaURL.includes(type)
                ),
              },
            }
          : undefined;

      expect(result?.state?.activateToggle).toBe(true);
    });

    it('should set activateToggle to false if no alert type in alert.alertTypes[priority] is included in alertTypesToActivateToggleViaURL', () => {
      const alert = {
        alertTypes: {
          high: ['type1', 'type4'],
        },
        openFunction: OpenFunction.Customer_Material_Portfolio,
      };
      const alertTypesToActivateToggleViaURL = ['type2', 'type3'] as any;
      const priority = 'high';

      const result =
        alert.openFunction === OpenFunction.Customer_Material_Portfolio
          ? {
              state: {
                activateToggle: (alert?.alertTypes[priority] || [])?.some(
                  (type: any) => alertTypesToActivateToggleViaURL.includes(type)
                ),
              },
            }
          : undefined;

      expect(result?.state?.activateToggle).toBe(false);
    });

    it('should return undefined if alert.openFunction is not Customer_Material_Portfolio', () => {
      const alert = {
        alertTypes: {
          high: ['type1', 'type2'],
        },
        openFunction: 'DifferentFunction',
      };
      const alertTypesToActivateToggleViaURL = ['type2', 'type3'] as any;
      const priority = 'high';

      const result =
        alert.openFunction === OpenFunction.Customer_Material_Portfolio
          ? {
              state: {
                activateToggle: (alert?.alertTypes[priority] || [])?.some(
                  (type: any) => alertTypesToActivateToggleViaURL.includes(type)
                ),
              },
            }
          : undefined;

      expect(result).toBeUndefined();
    });
  });

  describe('unit', () => {
    let component: TaskPriorityGridComponent;
    beforeEach(() => {
      component = Stub.getForEffect({
        component: TaskPriorityGridComponent,
        providers: [Stub.getAlertServiceProvider()],
      });
      jest
        .spyOn(component['alertService'], 'allActiveAlerts')
        .mockImplementation(() => [testAlert1, testAlert2, testAlert3]);
    });

    it('should create', () => {
      expect(component).toBeDefined();
    });

    describe('menu', () => {
      let globalNavigateSpy: jest.SpyInstance;
      let selectableOptionsSpy: jest.SpyInstance;

      beforeEach(() => {
        globalNavigateSpy = jest.spyOn(
          component['globalSelectionStateService'],
          'navigateWithGlobalSelection'
        );
        selectableOptionsSpy = jest
          .spyOn(component['selectableOptionsService'], 'get')
          .mockImplementation((type) => ({
            options: [...alertTypeOptionMocks, { id: type, text: type }],
            loadingError: null,
          }));
      });

      it('should generate the correct context menu', () => {
        Stub.setInput('openFunction', OpenFunction.Validation_Of_Demand);
        const menu = component['context'].getMenu({ data: groupedAlert });

        expect(menu.length).toEqual(1);
        expect(menu[0].submenu.length).toEqual(3);
        expect(menu[0].submenu[0].text).toEqual('overview.yourTasks.priority1');
        expect(menu[0].submenu[1].text).toEqual('overview.yourTasks.priority2');
        expect(menu[0].submenu[2].text).toEqual(
          'overview.yourTasks.selectedPriorities'
        );
      });

      describe('single priority buttons', () => {
        it('should call the correct filter for the first priority button', () => {
          Stub.setInput('openFunction', OpenFunction.Validation_Of_Demand);
          const menu = component['context'].getMenu({ data: groupedAlert });

          const menuButton1 = menu[0].submenu[0];
          expect(menuButton1.text).toEqual('overview.yourTasks.priority1');
          menuButton1.onClick();
          expect(selectableOptionsSpy).toHaveBeenCalled();
          expect(globalNavigateSpy).toHaveBeenCalledWith(
            'demand-validation',
            {
              alertType: [aciadpOption],
              customerNumber: [{ id: '1', text: 'first customer' }],
              materialNumber: [{ id: '1', text: 'Material 1' }],
            },
            undefined
          );
        });

        it('should call the correct filter for the first priority button, when alertTypes and materialNumbers are undefined', () => {
          Stub.setInput('openFunction', OpenFunction.Validation_Of_Demand);
          const menu = component['context'].getMenu({
            data: {
              ...groupedAlert,
              alertTypes: undefined,
              materialNumbers: undefined,
            },
          });

          const menuButton1 = menu[0].submenu[0];
          expect(menuButton1.text).toEqual('overview.yourTasks.priority1');
          menuButton1.onClick();
          expect(globalNavigateSpy).toHaveBeenCalledWith(
            'demand-validation',
            {
              alertType: [],
              customerNumber: [{ id: '1', text: 'first customer' }],
              materialNumber: [],
            },
            undefined
          );
        });

        it('should call the correct filter for the second priority button', () => {
          Stub.setInput('openFunction', OpenFunction.Validation_Of_Demand);
          const menu = component['context'].getMenu({ data: groupedAlert });

          const menuButton2 = menu[0].submenu[1];
          expect(menuButton2.text).toEqual('overview.yourTasks.priority2');
          menuButton2.onClick();
          expect(globalNavigateSpy).toHaveBeenCalledWith(
            'demand-validation',
            {
              alertType: [aciadpOption, cfpraoOption],
              customerNumber: [{ id: '1', text: 'first customer' }],
              materialNumber: [{ id: '2', text: 'Material 2' }],
            },
            undefined
          );
        });
      });

      describe('selected priority button', () => {
        it('should call the correct filter, when both priorities are selected', () => {
          Stub.setInputs([
            {
              property: 'openFunction',
              value: OpenFunction.Validation_Of_Demand,
            },
            {
              property: 'priorities',
              value: [Priority.Priority1, Priority.Priority2],
            },
          ]);
          const menu = component['context'].getMenu({ data: groupedAlert });

          const menuButton3 = menu[0].submenu[2];
          expect(menuButton3.text).toEqual(
            'overview.yourTasks.selectedPriorities'
          );
          menuButton3.onClick();
          expect(globalNavigateSpy).toHaveBeenCalledWith(
            'demand-validation',
            {
              alertType: [aciadpOption, cfpraoOption],
              customerNumber: [{ id: '1', text: 'first customer' }],
              materialNumber: [
                { id: '1', text: 'Material 1' },
                { id: '2', text: 'Material 2' },
              ],
            },
            undefined
          );
        });

        it('should call the correct filter, when only one priority is selected', () => {
          Stub.setInputs([
            {
              property: 'openFunction',
              value: OpenFunction.Validation_Of_Demand,
            },
            { property: 'priorities', value: [Priority.Priority1] },
          ]);

          const menu = component['context'].getMenu({ data: groupedAlert });

          const menuButton3 = menu[0].submenu[2];
          expect(menuButton3.text).toEqual(
            'overview.yourTasks.selectedPriorities'
          );
          globalNavigateSpy = jest.spyOn(
            component['globalSelectionStateService'],
            'navigateWithGlobalSelection'
          );
          menuButton3.onClick();
          expect(globalNavigateSpy).toHaveBeenCalledWith(
            'demand-validation',
            {
              alertType: [aciadpOption],
              customerNumber: [{ id: '1', text: 'first customer' }],
              materialNumber: [{ id: '1', text: 'Material 1' }],
            },
            undefined
          );
        });

        it('should call the correct filter, when priority, alertTypes and materialNumbers are undefined', () => {
          Stub.setInputs([
            {
              property: 'openFunction',
              value: OpenFunction.Validation_Of_Demand,
            },
          ]);

          const menu = component['context'].getMenu({
            data: {
              ...groupedAlert,
              alertTypes: undefined,
              materialNumbers: undefined,
            },
          });

          const menuButton3 = menu[0].submenu[2];
          expect(menuButton3.text).toEqual(
            'overview.yourTasks.selectedPriorities'
          );
          globalNavigateSpy = jest.spyOn(
            component['globalSelectionStateService'],
            'navigateWithGlobalSelection'
          );
          menuButton3.onClick();
          expect(globalNavigateSpy).toHaveBeenCalledWith(
            'demand-validation',
            {
              alertType: [],
              customerNumber: [{ id: '1', text: 'first customer' }],
              materialNumber: [],
            },
            undefined
          );
        });
      });
    });

    describe('filter', () => {
      let groupDataSpy: jest.SpyInstance;
      beforeEach(() => {
        groupDataSpy = jest.spyOn(
          component['alertService'],
          'groupDataByCustomerAndPriority'
        );
      });
      it('should filter data by customer numbers', () => {
        Stub.setInputs([
          {
            property: 'openFunction',
            value: OpenFunction.Validation_Of_Demand,
          },
          { property: 'customers', value: ['1', '2'] },
        ]);
        Stub.detectChanges();

        expect(groupDataSpy).toHaveBeenCalledWith([testAlert1, testAlert2]);
      });

      it('should group no data when custom filter is an empty array', () => {
        Stub.setInputs([
          {
            property: 'openFunction',
            value: OpenFunction.Validation_Of_Demand,
          },
          { property: 'customers', value: [] },
        ]);
        Stub.detectChanges();

        expect(groupDataSpy).toHaveBeenCalledWith([]);
      });

      it('should group all data when no custom filter is passed', () => {
        Stub.setInputs([
          {
            property: 'openFunction',
            value: OpenFunction.Validation_Of_Demand,
          },
        ]);
        Stub.detectChanges();
        expect(groupDataSpy).toHaveBeenCalledWith([
          testAlert1,
          testAlert2,
          testAlert3,
        ]);
      });

      it('should group only alerts with matching gkam number when gkam filter has entries', () => {
        Stub.setInputs([
          {
            property: 'openFunction',
            value: OpenFunction.Validation_Of_Demand,
          },
          { property: 'gkamNumbers', value: ['gkam3', 'gkam2'] },
        ]);
        Stub.detectChanges();

        expect(groupDataSpy).toHaveBeenCalledWith([testAlert2, testAlert3]);
      });

      it('should group no data when gkam filter is empty array', () => {
        Stub.setInputs([
          {
            property: 'openFunction',
            value: OpenFunction.Validation_Of_Demand,
          },
          { property: 'gkamNumbers', value: [] },
        ]);
        Stub.detectChanges();

        expect(groupDataSpy).toHaveBeenCalledWith([]);
      });

      it('should group complete data when gkam filter is undefined', () => {
        Stub.setInputs([
          {
            property: 'openFunction',
            value: OpenFunction.Validation_Of_Demand,
          },
        ]);
        Stub.detectChanges();

        expect(groupDataSpy).toHaveBeenCalledWith([
          testAlert1,
          testAlert2,
          testAlert3,
        ]);
      });
    });
  });

  describe('integration', () => {
    const createIntegratedComponent = createComponentFactory({
      component: TaskPriorityGridComponent,
      providers: [
        AlertService,
        provideHttpClient(),
        provideHttpClientTesting(),
        mockProvider(GlobalSelectionStateService, {
          navigateWithGlobalSelection: globalNavigate,
        }),
        mockProvider(SelectableOptionsService),
      ],
      componentMocks: [TaskPrioritiesComponent, AgGridModule],
    });

    let gridApi: any;
    beforeEach(() => {
      gridApi = { setGridOption: jest.fn() };
    });
    it('should show the correct data in the grid, when a priority filter is set', () => {
      spectator = createIntegratedComponent({
        props: {
          openFunction: OpenFunction.Validation_Of_Demand,
          customers: ['1', '2'],
          priorities: [Priority.Priority1, Priority.Priority2],
        },
      });
      const alertService = spectator.inject(AlertService);
      alertService.allActiveAlerts.set([testAlert1, testAlert2, testAlert3]);
      const component = spectator.component;

      component['onGridReady']({ api: gridApi } as any);

      expect(gridApi.setGridOption).toHaveBeenCalledWith('rowData', [
        {
          alertTypes: {
            1: [AlertCategory.ACIADP],
          },
          customerName: 'first customer',
          customerNumber: '1',
          openFunction: OpenFunction.Validation_Of_Demand,
          priorityCount: { 1: 1 },
          materialNumbers: {
            '1': [
              {
                id: '1',
                text: 'Material 1',
              },
            ],
          },
        },
        {
          alertTypes: {
            2: [AlertCategory.CFPRAO],
          },
          customerName: 'second customer',
          customerNumber: '2',
          openFunction: OpenFunction.Validation_Of_Demand,
          priorityCount: { 2: 1 },
          materialNumbers: {
            '2': [
              {
                id: '2',
                text: 'Material 2',
              },
            ],
          },
        },
      ]);
    });

    it('should show the correct data in the grid, when the priority filter is an empty array', () => {
      spectator = createIntegratedComponent({
        props: {
          openFunction: OpenFunction.Validation_Of_Demand,
          customers: ['1', '2'],
          priorities: [],
        },
      });
      const alertService = spectator.inject(AlertService);
      alertService.allActiveAlerts.set([testAlert1, testAlert2, testAlert3]);
      const component = spectator.component;
      component['onGridReady']({ api: gridApi } as any);

      expect(gridApi.setGridOption).toHaveBeenCalledWith('rowData', []);
    });

    it('should show the correct data in the grid, when no filter is set', () => {
      spectator = createIntegratedComponent({
        props: {
          openFunction: OpenFunction.Validation_Of_Demand,
        },
      });
      const alertService = spectator.inject(AlertService);
      alertService.allActiveAlerts.set([testAlert1, testAlert2, testAlert3]);
      const component = spectator.component;
      component['onGridReady']({ api: gridApi } as any);

      expect(gridApi.setGridOption).toHaveBeenCalledWith('rowData', [
        {
          alertTypes: {
            1: [AlertCategory.ACIADP],
          },
          customerName: 'first customer',
          customerNumber: '1',
          openFunction: OpenFunction.Validation_Of_Demand,
          priorityCount: { 1: 1 },
          materialNumbers: {
            '1': [
              {
                id: '1',
                text: 'Material 1',
              },
            ],
          },
        },
        {
          alertTypes: {
            2: [AlertCategory.CFPRAO],
          },
          customerName: 'second customer',
          customerNumber: '2',
          openFunction: OpenFunction.Validation_Of_Demand,
          priorityCount: { 2: 1 },
          materialNumbers: {
            '2': [
              {
                id: '2',
                text: 'Material 2',
              },
            ],
          },
        },
        {
          alertTypes: {
            3: [AlertCategory.NPOSDP],
          },
          customerName: 'third customer',
          customerNumber: '3',
          openFunction: OpenFunction.Validation_Of_Demand,
          priorityCount: { 3: 1 },
          materialNumbers: {
            '3': [
              {
                id: '3',
                text: 'Material 3',
              },
            ],
          },
        },
      ]);
    });
  });
});
