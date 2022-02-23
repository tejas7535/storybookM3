import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PROCESS_CASE_STATE_MOCK } from '../../testing/mocks';
import { AddEntryModule } from '../shared/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../shared/case-material/input-table/input-table.module';
import { AddItemsButtonComponent } from '../shared/custom-status-bar/add-items-button/add-items-button.component';
import { CustomStatusBarModule } from '../shared/custom-status-bar/custom-status-bar.module';
import { DeleteItemsButtonComponent } from '../shared/custom-status-bar/delete-items-button/delete-items-button.component';
import { ExportToExcelButtonComponent } from '../shared/custom-status-bar/export-to-excel-button/export-to-excel-button.component';
import { RefreshSapPriceComponent } from '../shared/custom-status-bar/refresh-sap-price/refresh-sap-price.component';
import { TotalRowCountComponent } from '../shared/custom-status-bar/total-row-count/total-row-count.component';
import { UploadSelectionToSapButtonComponent } from '../shared/custom-status-bar/upload-selection-to-sap-button/upload-selection-to-sap-button.component';
import { CustomerHeaderModule } from '../shared/header/customer-header/customer-header.module';
import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';
import { AddMaterialDialogComponent } from './add-material-dialog/add-material-dialog.component';
import { CalculationInProgressComponent } from './calculation-in-progress/calculation-in-progress.component';
import { HeaderContentModule } from './header-content/header-content.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { QuotationDetailsTableModule } from './quotation-details-table/quotation-details-table.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
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
        TotalRowCountComponent,
        RefreshSapPriceComponent,
      ]),
      BrowserAnimationsModule,
      CustomStatusBarModule,
      MatCardModule,
      MatDialogModule,
      MatIconModule,
      MatSidenavModule,
      ProcessCaseViewRoutingModule,
      QuotationDetailsTableModule,
      RouterTestingModule,
      HeaderContentModule,
      provideTranslocoTestingModule({ en: {} }),
      LoadingSpinnerModule,
      ReactiveComponentModule,
      MatSnackBarModule,
      CustomerHeaderModule,
      MatCardModule,
      SubheaderModule,
      BreadcrumbsModule,
      SharedPipesModule,
      ShareButtonModule,
    ],
    declarations: [CalculationInProgressComponent],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      mockProvider(ApplicationInsightsService),
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          'azure-auth': {},
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

  describe('ngOnInit', () => {
    test('should add subscriptions', () => {
      component['subscription'].add = jest.fn();

      component.ngOnInit();

      expect(component['subscription'].add).toHaveBeenCalledTimes(1);
    });
  });
  describe('ngOnDestroy', () => {
    test('should unsubscribe subscription', () => {
      component['subscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
