import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CellRendererModule } from '../../cell-renderer/cell-renderer.module';
import { AddMaterialButtonComponent } from '../../custom-status-bar/case-material-table/add-material-button/add-material-button.component';
import { CreateCaseButtonComponent } from '../../custom-status-bar/case-material-table/create-case-button/create-case-button.component';
import { CreateCaseResetAllButtonComponent } from '../../custom-status-bar/case-material-table/create-case-reset-all-button/create-case-reset-all-button.component';
import { ProcessCaseResetAllButtonComponent } from '../../custom-status-bar/case-material-table/process-case-reset-all-button/process-case-reset-all-button.component';
import { CustomStatusBarModule } from '../../custom-status-bar/custom-status-bar.module';
import { MaterialValidationStatusComponent } from '../../custom-status-bar/material-validation-status/material-validation-status.component';
import { InputTableComponent } from './input-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('InputTableComponent', () => {
  let component: InputTableComponent;
  let spectator: Spectator<InputTableComponent>;

  const createComponent = createComponentFactory({
    component: InputTableComponent,
    imports: [
      AgGridModule.withComponents([
        CreateCaseButtonComponent,
        AddMaterialButtonComponent,
        ProcessCaseResetAllButtonComponent,
        CreateCaseResetAllButtonComponent,
        MaterialValidationStatusComponent,
      ]),
      CellRendererModule,
      CustomStatusBarModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({}),
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
