import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

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

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CalculationsTabComponent', () => {
  let component: CalculationsTabComponent;
  let fixture: ComponentFixture<CalculationsTabComponent>;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CalculationsTabComponent],
      imports: [
        CalculationsTableModule,
        provideTranslocoTestingModule({}),
        CustomStatusBarModule,
        RouterTestingModule,
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationsTabComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
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
