import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CALCULATIONS_TYPE_MOCK } from '../../../testing/mocks';
import {
  getCalculations,
  getCalculationsLoading,
} from '../../core/store/selectors';
import { BlockUiModule } from '../../shared/block-ui/block-ui.module';
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
        BlockUiModule,
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
