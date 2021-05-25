import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CustomStatusBarModule } from '../shared/custom-status-bar/custom-status-bar.module';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { CaseTableModule } from './case-table/case-table.module';
import { CaseViewComponent } from './case-view.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CaseViewComponent', () => {
  let component: CaseViewComponent;
  let spectator: Spectator<CaseViewComponent>;

  const createComponent = createComponentFactory({
    component: CaseViewComponent,
    imports: [
      AgGridModule.withComponents([]),
      CaseTableModule,
      CustomStatusBarModule,
      provideTranslocoTestingModule({ en: {} }),
      LoadingSpinnerModule,
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          viewCases: {
            quotations: [],
          },
        },
      }),
    ],
    declarations: [CaseViewComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
