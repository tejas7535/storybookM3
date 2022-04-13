import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { confirmSimulatedQuotation } from '../../../../core/store';
import { ConfirmSimulationButtonComponent } from './confirm-simulation-button.component';

describe('ConfirmSimulationComponent', () => {
  let component: ConfirmSimulationButtonComponent;
  let spectator: Spectator<ConfirmSimulationButtonComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: ConfirmSimulationButtonComponent,
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
      mockStore.dispatch = jest.fn();

      component.confirmSimulation();

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        confirmSimulatedQuotation()
      );
    });
  });
});
