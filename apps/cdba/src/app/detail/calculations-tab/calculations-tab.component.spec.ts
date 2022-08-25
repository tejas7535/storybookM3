import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
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
    imports: [PushModule, MockModule(CalculationsTableModule)],
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

  describe('selectCalculation', () => {
    test('should dispatch selectCalculation Action', () => {
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
