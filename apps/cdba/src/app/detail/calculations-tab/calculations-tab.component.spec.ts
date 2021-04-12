import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';

import { CALCULATIONS_MOCK } from '../../../testing/mocks';
import { selectCalculation } from '../../core/store';
import { Calculation } from '../../core/store/reducers/shared/models';
import {
  getCalculations,
  getCalculationsErrorMessage,
  getCalculationsLoading,
  getSelectedNodeId,
} from '../../core/store/selectors';
import { CalculationsTableModule } from '../../shared/calculations-table/calculations-table.module';
import { CustomStatusBarModule } from '../../shared/table/custom-status-bar/custom-status-bar.module';
import { CalculationsTabComponent } from './calculations-tab.component';

describe('CalculationsTabComponent', () => {
  let spectator: Spectator<CalculationsTabComponent>;
  let component: CalculationsTabComponent;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CalculationsTabComponent,
    imports: [
      SharedModule,
      RouterTestingModule,
      provideTranslocoTestingModule({}),
      MockModule(CalculationsTableModule),
      MockModule(CustomStatusBarModule),
      MatCardModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          calculations: {},
        },
        selectors: [
          {
            selector: getCalculations,
            value: CALCULATIONS_MOCK,
          },
          {
            selector: getSelectedNodeId,
            value: '7',
          },
          {
            selector: getCalculationsErrorMessage,
            value: 'Error Message',
          },
          {
            selector: getCalculationsLoading,
            value: false,
          },
        ],
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
      const calculation = ({} as unknown) as Calculation;

      component.selectCalculation({ nodeId, calculation });

      expect(store.dispatch).toHaveBeenCalledWith(
        selectCalculation({ nodeId, calculation })
      );
    });
  });
});
