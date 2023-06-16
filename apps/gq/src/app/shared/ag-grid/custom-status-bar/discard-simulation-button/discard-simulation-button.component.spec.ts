import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { EVENT_NAMES } from '../../../models';
import { DiscardSimulationButtonComponent } from './discard-simulation-button.component';

describe('DiscardSimulationButtonComponent', () => {
  let component: DiscardSimulationButtonComponent;
  let spectator: Spectator<DiscardSimulationButtonComponent>;
  let mockStore: MockStore;
  let applicationInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: DiscardSimulationButtonComponent,
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
    test('should initialize class variables', () => {
      component.agInit({} as any);

      expect(component.simulationModeEnabled$).toBeDefined();
    });
  });

  describe('discardSimulation', () => {
    test('should dispatch resetSimulationQuotation', () => {
      mockStore.dispatch = jest.fn();
      component.params = {
        context: {},
        api: {
          getSelectedRows: jest.fn(() => []),
        } as any,
      } as any;

      component.discardSimulation();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ActiveCaseActions.resetSimulatedQuotation()
      );
    });
  });

  describe('tracking', () => {
    test('should track MASS_SIMULATION_CANCELLED on discard', () => {
      component.params = {
        context: {
          simulatedField: 'price',
          simulatedValue: 20,
        },
        api: {
          getSelectedRows: jest.fn(() => [1, 2]),
        } as any,
      } as any;

      component.discardSimulation();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.MASS_SIMULATION_CANCELLED,
        {
          type: 'price',
          simulatedValue: 20,
          numberOfSimulatedRows: 2,
        }
      );
    });
  });
});
