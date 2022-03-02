import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CreateCustomerCaseButtonComponent } from '../../shared/custom-status-bar/case-view/create-customer-case-button/create-customer-case-button.component';
import { CreateManualCaseButtonComponent } from '../../shared/custom-status-bar/case-view/create-manual-case-button/create-manual-case-button.component';
import { ImportCaseButtonComponent } from '../../shared/custom-status-bar/case-view/import-case-button/import-case-button.component';
import { CustomStatusBarModule } from '../../shared/custom-status-bar/custom-status-bar.module';
import { DeleteCaseButtonComponent } from '../../shared/custom-status-bar/delete-case-button/delete-case-button.component';
import { CaseTableComponent } from './case-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CaseTableComponent', () => {
  let component: CaseTableComponent;
  let spectator: Spectator<CaseTableComponent>;

  const createComponent = createComponentFactory({
    component: CaseTableComponent,
    imports: [
      AgGridModule.withComponents({
        DeleteCaseButtonComponent,
        ImportCaseButtonComponent,
        CreateManualCaseButtonComponent,
        CreateCustomerCaseButtonComponent,
      }),
      CustomStatusBarModule,
      RouterTestingModule.withRoutes([]),
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    declarations: [CaseTableComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
