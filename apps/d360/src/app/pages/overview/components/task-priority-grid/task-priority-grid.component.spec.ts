import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { Observable, of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';

import {
  AlertDataResult,
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
import { TaskPrioritiesComponent } from '../task-priorities/task-priorities.component';
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
  };
  const globalNavigate = jest.fn();
  const testAlert1: Alert = {
    customerName: 'first customer',
    customerNumber: '1',
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
    keyAccount: 'gkam3',
    alertPriority: Priority.Priority3,
    open: true,
    priority: false,
    deactivated: false,
    openFunction: OpenFunction.Validation_Of_Demand,
    type: AlertCategory.NPOSDP,
  };

  const mockedAlertServiceProvider = mockProvider(AlertService, {
    groupDataByCustomerAndPriority: jest.fn(() => []),
    getFetchErrorEvent(): Observable<HttpErrorResponse> {
      return of();
    },
    getDataFetchedEvent(): Observable<AlertDataResult> {
      return of();
    },
    getRefreshEvent(): Observable<void> {
      return of();
    },
    getRouteForOpenFunction() {
      return 'demand-validation';
    },
    allActiveAlerts(): Alert[] {
      return [testAlert1, testAlert2, testAlert3];
    },
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('unit', () => {
    const createComponent = createComponentFactory({
      component: TaskPriorityGridComponent,
      providers: [
        mockedAlertServiceProvider,
        mockProvider(GlobalSelectionStateService, {
          navigateWithGlobalSelection: globalNavigate,
        }),
      ],
      componentMocks: [TaskPrioritiesComponent, AgGridModule],
    });
    it('should create', () => {
      spectator = createComponent({
        props: { openFunction: OpenFunction.Validation_Of_Demand },
      });
      const component = spectator.component;
      expect(component).toBeDefined();
    });

    describe('menu', () => {
      it('should generate the correct context menu', () => {
        spectator = createComponent({
          props: { openFunction: OpenFunction.Validation_Of_Demand },
        });
        const component = spectator.component;
        const menu = component['context'].getMenu({ data: groupedAlert });

        expect(menu.length).toEqual(1);
        expect(menu[0].submenu.length).toEqual(3);
        expect(menu[0].submenu[0].text).toEqual('overview.yourTasks.priority1');
        expect(menu[0].submenu[1].text).toEqual('overview.yourTasks.priority2');
        expect(menu[0].submenu[2].text).toEqual(
          'overview.yourTasks.selectedPriorities'
        );
      });

      it('should call the correct filter for the first priority button', () => {
        spectator = createComponent({
          props: { openFunction: OpenFunction.Validation_Of_Demand },
        });
        const component = spectator.component;
        const menu = component['context'].getMenu({ data: groupedAlert });

        const menuButton1 = menu[0].submenu[0];
        expect(menuButton1.text).toEqual('overview.yourTasks.priority1');
        menuButton1.onClick();
        expect(globalNavigate).toHaveBeenCalledWith('demand-validation', {
          alertType: [{ id: AlertCategory.ACIADP, text: AlertCategory.ACIADP }],
          customerNumber: [{ id: '1', text: 'first customer' }],
        });
      });

      it('should call the correct filter for the second priority button', () => {
        spectator = createComponent({
          props: { openFunction: OpenFunction.Validation_Of_Demand },
        });
        const component = spectator.component;
        const menu = component['context'].getMenu({ data: groupedAlert });

        const menuButton2 = menu[0].submenu[1];
        expect(menuButton2.text).toEqual('overview.yourTasks.priority2');
        menuButton2.onClick();
        expect(globalNavigate).toHaveBeenCalledWith('demand-validation', {
          alertType: [
            { id: AlertCategory.ACIADP, text: AlertCategory.ACIADP },
            { id: AlertCategory.CFPRAO, text: AlertCategory.CFPRAO },
          ],
          customerNumber: [{ id: '1', text: 'first customer' }],
        });
      });

      it('should call the correct filter on selected filter button, when both priorities are selected', () => {
        spectator = createComponent({
          props: {
            openFunction: OpenFunction.Validation_Of_Demand,
            priorities: [Priority.Priority1, Priority.Priority2],
          },
        });
        const component = spectator.component;
        const menu = component['context'].getMenu({ data: groupedAlert });

        const menuButton3 = menu[0].submenu[2];
        expect(menuButton3.text).toEqual(
          'overview.yourTasks.selectedPriorities'
        );
        menuButton3.onClick();
        expect(globalNavigate).toHaveBeenCalledWith('demand-validation', {
          alertType: [
            { id: AlertCategory.ACIADP, text: AlertCategory.ACIADP },
            { id: AlertCategory.CFPRAO, text: AlertCategory.CFPRAO },
          ],
          customerNumber: [{ id: '1', text: 'first customer' }],
        });
      });

      it('should call the correct filter on selected filter button, when only one priority is selected', () => {
        spectator = createComponent({
          props: {
            openFunction: OpenFunction.Validation_Of_Demand,
            priorities: [Priority.Priority1],
          },
        });
        const component = spectator.component;
        const menu = component['context'].getMenu({ data: groupedAlert });

        const menuButton3 = menu[0].submenu[2];
        expect(menuButton3.text).toEqual(
          'overview.yourTasks.selectedPriorities'
        );
        menuButton3.onClick();
        expect(globalNavigate).toHaveBeenCalledWith('demand-validation', {
          alertType: [{ id: AlertCategory.ACIADP, text: AlertCategory.ACIADP }],
          customerNumber: [{ id: '1', text: 'first customer' }],
        });
      });
    });
    describe('filter', () => {
      it('should filter data by customer numbers', () => {
        spectator = createComponent({
          props: {
            openFunction: OpenFunction.Validation_Of_Demand,
            customers: ['1', '2'],
          },
        });
        const alertServiceSpy = spectator.inject(AlertService);

        expect(
          alertServiceSpy.groupDataByCustomerAndPriority
        ).toHaveBeenCalledWith([testAlert1, testAlert2]);
      });

      it('should group no data when custom filter is an empty array', () => {
        spectator = createComponent({
          props: {
            openFunction: OpenFunction.Validation_Of_Demand,
            customers: [],
          },
        });
        const alertServiceSpy = spectator.inject(AlertService);

        expect(
          alertServiceSpy.groupDataByCustomerAndPriority
        ).toHaveBeenCalledWith([]);
      });

      it('should group all data when no custom filter is passed', () => {
        spectator = createComponent({
          props: {
            openFunction: OpenFunction.Validation_Of_Demand,
          },
        });
        const alertServiceSpy = spectator.inject(AlertService);

        expect(
          alertServiceSpy.groupDataByCustomerAndPriority
        ).toHaveBeenCalledWith([testAlert1, testAlert2, testAlert3]);
      });

      it('should group only alerts with matching gkam number when gkam filter has entries', () => {
        spectator = createComponent({
          props: {
            openFunction: OpenFunction.Validation_Of_Demand,
            gkamNumbers: ['gkam3', 'gkam2'],
          },
        });

        const alertServiceMock = spectator.inject(AlertService);

        expect(
          alertServiceMock.groupDataByCustomerAndPriority
        ).toHaveBeenCalledWith([testAlert2, testAlert3]);
      });

      it('should group no data when gkam filter is empty array', () => {
        spectator = createComponent({
          props: {
            openFunction: OpenFunction.Validation_Of_Demand,
            gkamNumbers: [],
          },
        });

        const alertServiceMock = spectator.inject(AlertService);

        expect(
          alertServiceMock.groupDataByCustomerAndPriority
        ).toHaveBeenCalledWith([]);
      });

      it('should group complete data when gkam filter is undefined', () => {
        spectator = createComponent({
          props: {
            openFunction: OpenFunction.Validation_Of_Demand,
          },
        });

        const alertServiceMock = spectator.inject(AlertService);

        expect(
          alertServiceMock.groupDataByCustomerAndPriority
        ).toHaveBeenCalledWith([testAlert1, testAlert2, testAlert3]);
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
        },
        {
          alertTypes: {
            2: [AlertCategory.CFPRAO],
          },
          customerName: 'second customer',
          customerNumber: '2',
          openFunction: OpenFunction.Validation_Of_Demand,
          priorityCount: { 2: 1 },
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
        },
        {
          alertTypes: {
            2: [AlertCategory.CFPRAO],
          },
          customerName: 'second customer',
          customerNumber: '2',
          openFunction: OpenFunction.Validation_Of_Demand,
          priorityCount: { 2: 1 },
        },
        {
          alertTypes: {
            3: [AlertCategory.NPOSDP],
          },
          customerName: 'third customer',
          customerNumber: '3',
          openFunction: OpenFunction.Validation_Of_Demand,
          priorityCount: { 3: 1 },
        },
      ]);
    });
  });
});
