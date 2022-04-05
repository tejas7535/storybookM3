import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { resetSimulatedQuotation } from '../../../core/store';
import { DiscardSimulationButtonComponent } from './discard-simulation-button.component';

describe('DiscardSimulationButtonComponent', () => {
  let component: DiscardSimulationButtonComponent;
  let spectator: Spectator<DiscardSimulationButtonComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: DiscardSimulationButtonComponent,
    imports: [ReactiveComponentModule],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should initialize class variables', () => {
      component.agInit();

      expect(component.simulationModeEnabled$).toBeDefined();
    });
  });

  describe('discardSimulation', () => {
    test('should dispatch resetSimulationQuotation', () => {
      mockStore.dispatch = jest.fn();

      component.discardSimulation();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        resetSimulatedQuotation()
      );
    });
  });
});
