import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { CalculationsTableModule } from '@cdba/shared/components';
import { Calculation } from '@cdba/shared/models';
import { CALCULATIONS_MOCK } from '@cdba/testing/mocks';

import { selectCalculations } from '../../core/store';
import { CalculationsTabComponent } from './calculations-tab.component';

describe('CalculationsTabComponent', () => {
  let spectator: Spectator<CalculationsTabComponent>;
  let component: CalculationsTabComponent;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CalculationsTabComponent,
    imports: [PushPipe, MockModule(CalculationsTableModule)],
    providers: [
      provideMockStore({
        initialState: {
          detail: {
            calculations: CALCULATIONS_MOCK,
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectCalculations', () => {
    test('should dispatch selectCalculations Action when two calculations are selected and there is a new selected calculation', () => {
      component['selectedNodeIds'] = ['1', '2'];
      store.dispatch = jest.fn();

      const calculation = {} as unknown as Calculation;

      component.selectCalculations([
        { nodeId: '2', calculation },
        { nodeId: '7', calculation },
      ]);

      expect(store.dispatch).toHaveBeenCalledWith(
        selectCalculations({ nodeIds: ['2', '7'] })
      );
    });

    test('should dispatch selectCalculations Action when one calculation is selected and there is already a selected calculation', () => {
      component['selectedNodeIds'] = ['5'];
      store.dispatch = jest.fn();

      const nodeId = '7';
      const calculation = {} as unknown as Calculation;

      component.selectCalculations([{ nodeId, calculation }]);

      expect(store.dispatch).toHaveBeenCalledWith(
        selectCalculations({ nodeIds: ['5', '7'] })
      );
    });

    test('should dispatch selectCalculations Action when one calculation is selected and there is no selected calculation', () => {
      component['selectedNodeIds'] = [];
      store.dispatch = jest.fn();

      const nodeId = '7';
      const calculation = {} as unknown as Calculation;

      component.selectCalculations([{ nodeId, calculation }]);

      expect(store.dispatch).toHaveBeenCalledWith(
        selectCalculations({ nodeIds: ['7'] })
      );
    });
  });
});
