import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CustomStatusBarModule } from '../shared/custom-status-bar/custom-status-bar.module';
import { CaseTableModule } from './case-table/case-table.module';
import { CaseViewComponent } from './case-view.component';

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
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
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
