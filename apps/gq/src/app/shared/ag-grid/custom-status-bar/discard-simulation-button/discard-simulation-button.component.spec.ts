import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { EVENT_NAMES } from '../../../models';
import { DiscardSimulationButtonComponent } from './discard-simulation-button.component';

describe('DiscardSimulationButtonComponent', () => {
  let component: DiscardSimulationButtonComponent;
  let spectator: Spectator<DiscardSimulationButtonComponent>;
  let applicationInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: DiscardSimulationButtonComponent,
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
    providers: [
      MockProvider(ActiveCaseFacade, {
        simulationModeEnabled$: of(true),
        resetSimulatedQuotation: jest.fn(),
      } as unknown as ActiveCaseFacade),

      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    applicationInsightsService = spectator.inject(ApplicationInsightsService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should provide simulationModeEnabled$',
    marbles((m) => {
      m.expect(component.simulationModeEnabled$).toBeObservable(
        m.cold('(a|)', { a: true })
      );
    })
  );
  describe('agInit', () => {
    test('should initialize class variables', () => {
      component.agInit({} as any);

      expect(component.simulationModeEnabled$).toBeDefined();
    });
  });

  describe('discardSimulation', () => {
    test('should dispatch resetSimulationQuotation', () => {
      component.params = {
        context: {},
        api: {
          getSelectedRows: jest.fn(() => []),
        } as any,
      } as any;

      component.discardSimulation();

      expect(
        component['activeCaseFacade'].resetSimulatedQuotation
      ).toHaveBeenCalled();
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
