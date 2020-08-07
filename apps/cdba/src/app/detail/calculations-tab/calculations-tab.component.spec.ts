import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CALCULATIONS_TYPE_MOCK } from '../../../testing/mocks';
import { selectCalculation } from '../../core/store';
import { Calculation } from '../../core/store/reducers/shared/models';
import {
  getCalculations,
  getCalculationsErrorMessage,
  getCalculationsLoading,
  getSelectedNodeId,
} from '../../core/store/selectors';
import { BomViewButtonComponent } from '../../shared/table/custom-status-bar/bom-view-button/bom-view-button.component';
import { CustomStatusBarModule } from '../../shared/table/custom-status-bar/custom-status-bar.module';
import { DetailViewButtonComponent } from '../../shared/table/custom-status-bar/detail-view-button/detail-view-button.component';
import { CalculationsTabComponent } from './calculations-tab.component';
import { CalculationsTableModule } from './calculations-table/calculations-table.module';

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
        AgGridModule.withComponents([
          DetailViewButtonComponent,
          BomViewButtonComponent,
        ]),
        provideTranslocoTestingModule({}),
        CustomStatusBarModule,
        RouterTestingModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            calculations: {},
          },
          selectors: [
            {
              selector: getCalculations,
              value: CALCULATIONS_TYPE_MOCK,
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
