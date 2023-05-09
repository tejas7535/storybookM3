import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { EVENT_NAMES } from '../../../models';
import { ConfirmSimulationButtonComponent } from './confirm-simulation-button.component';

describe('ConfirmSimulationComponent', () => {
  let component: ConfirmSimulationButtonComponent;
  let spectator: Spectator<ConfirmSimulationButtonComponent>;
  let mockStore: MockStore;
  let applicationInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: ConfirmSimulationButtonComponent,
    imports: [PushModule],
    providers: [
      provideMockStore({}),
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should initalize class variables', () => {
      const params = {
        api: {
          addEventListener: jest.fn(),
        },
      } as any;

      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.params.api.addEventListener).toHaveBeenCalledTimes(1);
      expect(component.simulationModeEnabled$).toBeDefined();
    });
  });

  describe('onSelectionChange', () => {
    test('should set row count', () => {
      component.selectedRowCount = 0;
      component.params = {
        api: {
          getSelectedRows: jest.fn(() => [1, 2]),
        },
      } as any;

      component.onSelectionChange();

      expect(component.selectedRowCount).toEqual(2);
      expect(component.params.api.getSelectedRows).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmSimulation', () => {
    test('should dispatch action', () => {
      component.params = {
        context: {},
        api: {
          getSelectedRows: jest.fn(() => []),
        } as any,
      } as any;
      mockStore.dispatch = jest.fn();

      component.confirmSimulation();

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ActiveCaseActions.confirmSimulatedQuotation()
      );
    });
  });

  describe('tracking', () => {
    test('should track MASS_SIMULATION_FINISHED on confirmation', () => {
      component.params = {
        context: {
          simulatedField: 'price',
          simulatedValue: 20,
        },
        api: {
          getSelectedRows: jest.fn(() => [1, 2]),
        } as any,
      } as any;

      component.confirmSimulation();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.MASS_SIMULATION_FINISHED,
        {
          type: 'price',
          simulatedValue: 20,
          numberOfSimulatedRows: 2,
        }
      );
    });
  });
});
