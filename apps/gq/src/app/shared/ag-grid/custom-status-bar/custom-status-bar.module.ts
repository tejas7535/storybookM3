import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { AddItemsButtonComponent } from './add-items-button/add-items-button.component';
import { AddMaterialButtonComponent } from './case-material-table/add-material-button/add-material-button.component';
import { ProcessCaseResetAllButtonComponent } from './case-material-table/process-case-reset-all-button/process-case-reset-all-button.component';
import { RemoveAllFilteredButtonComponent } from './case-material-table/remove-all-filtered-button/remove-all-filtered-button.component';
import { ImportCaseButtonComponent } from './case-view/import-case-button/import-case-button.component';
import { ConfirmSimulationButtonComponent } from './confirm-simulation-button/confirm-simulation-button.component';
import { DiscardSimulationButtonComponent } from './discard-simulation-button/discard-simulation-button.component';
import { ExportToExcelButtonComponent } from './export-to-excel-button/export-to-excel-button.component';
import { MaterialValidationStatusComponent } from './material-validation-status/material-validation-status.component';
import { QuotationDetailsStatusComponent } from './quotation-details-status/quotation-details-status.component';
import { RefreshSapPriceComponent } from './refresh-sap-price/refresh-sap-price.component';
import { UpdateCaseStatusButtonComponent } from './update-case-status-button/update-case-status-button.component';
import { UploadQuoteToSapButtonComponent } from './upload-quote-to-sap-button/upload-quote-to-sap-button.component';
import { UploadSelectionToSapButtonComponent } from './upload-selection-to-sap-button/upload-selection-to-sap-button.component';

@NgModule({
  declarations: [
    AddMaterialButtonComponent,

    UpdateCaseStatusButtonComponent,
    ExportToExcelButtonComponent,
    UploadSelectionToSapButtonComponent,
    MaterialValidationStatusComponent,
    RemoveAllFilteredButtonComponent,
    ProcessCaseResetAllButtonComponent,
    ImportCaseButtonComponent,
    AddItemsButtonComponent,
    RefreshSapPriceComponent,
    ConfirmSimulationButtonComponent,
    DiscardSimulationButtonComponent,
    UploadQuoteToSapButtonComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    SharedTranslocoModule,
    LetDirective,
    PushPipe,
    QuotationDetailsStatusComponent,
    SharedPipesModule,
    SharedDirectivesModule,
  ],
  exports: [
    AddMaterialButtonComponent,
    UpdateCaseStatusButtonComponent,
    ExportToExcelButtonComponent,
    UploadSelectionToSapButtonComponent,
    MaterialValidationStatusComponent,
    RemoveAllFilteredButtonComponent,
    ProcessCaseResetAllButtonComponent,
    ImportCaseButtonComponent,
    AddItemsButtonComponent,
    RefreshSapPriceComponent,
    ConfirmSimulationButtonComponent,
    DiscardSimulationButtonComponent,
    UploadQuoteToSapButtonComponent,
  ],
})
export class CustomStatusBarModule {}
