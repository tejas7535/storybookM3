import { Observable, of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import {
  AlertService,
  GroupedAlert,
} from '../../../../feature/alerts/alert.service';
import {
  AlertCategory,
  OpenFunction,
  Priority,
} from '../../../../feature/alerts/model';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
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
  const createComponent = createComponentFactory({
    component: TaskPriorityGridComponent,
    providers: [
      mockProvider(AlertService, {
        getRefreshEvent(): Observable<void> {
          return of();
        },
        getRouteForOpenFunction() {
          return '/vod';
        },
      }),
      mockProvider(GlobalSelectionStateService, {
        navigateWithGlobalSelection: globalNavigate,
      }),
    ],
  });
  createComponentFactory(TaskPriorityGridComponent);

  it('should create', () => {
    spectator = createComponent({
      props: { openFunction: OpenFunction.Validation_Of_Demand },
    });
    const component = spectator.component;
    expect(component).toBeDefined();
  });

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
    expect(globalNavigate).toHaveBeenCalledWith('/vod', {
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
    expect(globalNavigate).toHaveBeenCalledWith('/vod', {
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
    expect(menuButton3.text).toEqual('overview.yourTasks.selectedPriorities');
    menuButton3.onClick();
    expect(globalNavigate).toHaveBeenCalledWith('/vod', {
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
    expect(menuButton3.text).toEqual('overview.yourTasks.selectedPriorities');
    menuButton3.onClick();
    expect(globalNavigate).toHaveBeenCalledWith('/vod', {
      alertType: [{ id: AlertCategory.ACIADP, text: AlertCategory.ACIADP }],
      customerNumber: [{ id: '1', text: 'first customer' }],
    });
  });
});
