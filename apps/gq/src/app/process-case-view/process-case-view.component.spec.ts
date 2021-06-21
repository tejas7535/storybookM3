import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../testing/mocks';
import { SharedModule } from '../shared';
import { AddEntryModule } from '../shared/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../shared/case-material/input-table/input-table.module';
import { AddItemsButtonComponent } from '../shared/custom-status-bar/add-items-button/add-items-button.component';
import { CustomStatusBarModule } from '../shared/custom-status-bar/custom-status-bar.module';
import { DeleteItemsButtonComponent } from '../shared/custom-status-bar/delete-items-button/delete-items-button.component';
import { ExportToExcelButtonComponent } from '../shared/custom-status-bar/export-to-excel-button/export-to-excel-button.component';
import { UploadSelectionToSapButtonComponent } from '../shared/custom-status-bar/upload-selection-to-sap-button/upload-selection-to-sap-button.component';
import { CaseHeaderModule } from '../shared/header/case-header/case-header.module';
import { AddMaterialDialogComponent } from './add-material-dialog/add-material-dialog.component';
import { HeaderContentModule } from './header-content/header-content.module';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { QuotationDetailsTableModule } from './quotation-details-table/quotation-details-table.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ProcessCaseViewComponent', () => {
  let component: ProcessCaseViewComponent;
  let spectator: Spectator<ProcessCaseViewComponent>;

  const createComponent = createComponentFactory({
    component: ProcessCaseViewComponent,
    imports: [
      AddEntryModule,
      InputTableModule,
      AgGridModule.withComponents([
        DeleteItemsButtonComponent,
        UploadSelectionToSapButtonComponent,
        AddItemsButtonComponent,
        ExportToExcelButtonComponent,
      ]),
      BrowserAnimationsModule,
      CaseHeaderModule,
      CustomStatusBarModule,
      MatCardModule,
      MatDialogModule,
      MatIconModule,
      MatSidenavModule,
      ProcessCaseViewRoutingModule,
      QuotationDetailsTableModule,
      RouterTestingModule,
      SharedModule,
      HeaderContentModule,
      provideTranslocoTestingModule({ en: {} }),
      LoadingSpinnerModule,
      ReactiveComponentModule,
      MatSnackBarModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: {
            customer: {
              item: CUSTOMER_MOCK,
            },
            quotation: {
              item: QUOTATION_MOCK,
            },
          },
        },
      }),
    ],
    entryComponents: [AddMaterialDialogComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
