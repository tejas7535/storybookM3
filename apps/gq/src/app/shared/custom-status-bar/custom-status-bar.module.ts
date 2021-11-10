import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AddItemsButtonComponent } from './add-items-button/add-items-button.component';
import { AddMaterialButtonComponent } from './case-material-table/add-material-button/add-material-button.component';
import { CreateCaseButtonComponent } from './case-material-table/create-case-button/create-case-button.component';
import { CreateCaseResetAllButtonComponent } from './case-material-table/create-case-reset-all-button/create-case-reset-all-button.component';
import { ProcessCaseResetAllButtonComponent } from './case-material-table/process-case-reset-all-button/process-case-reset-all-button.component';
import { CreateCustomerCaseButtonComponent } from './case-view/create-customer-case-button/create-customer-case-button.component';
import { CreateManualCaseButtonComponent } from './case-view/create-manual-case-button/create-manual-case-button.component';
import { ImportCaseButtonComponent } from './case-view/import-case-button/import-case-button.component';
import { DeleteCaseButtonComponent } from './delete-case-button/delete-case-button.component';
import { DeleteItemsButtonComponent } from './delete-items-button/delete-items-button.component';
import { ExportToExcelButtonComponent } from './export-to-excel-button/export-to-excel-button.component';
import { MaterialValidationStatusComponent } from './material-validation-status/material-validation-status.component';
import { QuotationDetailsStatusComponent } from './quotation-details-status/quotation-details-status.component';
import { RefreshSapPriceComponent } from './refresh-sap-price/refresh-sap-price.component';
import { TotalRowCountComponent } from './total-row-count/total-row-count.component';
import { UploadSelectionToSapButtonComponent } from './upload-selection-to-sap-button/upload-selection-to-sap-button.component';

@NgModule({
  declarations: [
    AddMaterialButtonComponent,
    CreateCaseButtonComponent,
    DeleteCaseButtonComponent,
    ExportToExcelButtonComponent,
    QuotationDetailsStatusComponent,
    UploadSelectionToSapButtonComponent,
    DeleteItemsButtonComponent,
    MaterialValidationStatusComponent,
    CreateCaseResetAllButtonComponent,
    ProcessCaseResetAllButtonComponent,
    ImportCaseButtonComponent,
    CreateManualCaseButtonComponent,
    CreateCustomerCaseButtonComponent,
    AddItemsButtonComponent,
    TotalRowCountComponent,
    RefreshSapPriceComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
    FlexModule,
  ],
  exports: [
    AddMaterialButtonComponent,
    CreateCaseButtonComponent,
    DeleteCaseButtonComponent,
    ExportToExcelButtonComponent,
    QuotationDetailsStatusComponent,
    UploadSelectionToSapButtonComponent,
    DeleteItemsButtonComponent,
    MaterialValidationStatusComponent,
    CreateCaseResetAllButtonComponent,
    ProcessCaseResetAllButtonComponent,
    ImportCaseButtonComponent,
    CreateManualCaseButtonComponent,
    CreateCustomerCaseButtonComponent,
    AddItemsButtonComponent,
    TotalRowCountComponent,
    RefreshSapPriceComponent,
  ],
})
export class CustomStatusBarModule {}
