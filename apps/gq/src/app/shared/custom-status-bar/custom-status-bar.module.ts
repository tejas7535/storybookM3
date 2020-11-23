import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AddToOfferButtonComponent } from './add-to-offer-button/add-to-offer-button.component';
import { CreateCaseButtonComponent } from './create-case-button/create-case-button.component';
import { DeleteCaseButtonComponent } from './delete-case-button/delete-case-button.component';
import { DetailViewButtonComponent } from './detail-view-button/detail-view-button.component';
import { ExportToExcelButtonComponent } from './export-to-excel-button/export-to-excel-button.component';
import { FinishOfferButtonComponent } from './finish-offer-button/finish-offer-button.component';
import { OpenCaseButtonComponent } from './open-case-button/open-case-button.component';
import { RemoveFromOfferButtonComponent } from './remove-from-offer-button/remove-from-offer-button.component';
import { ResetAllButtonComponent } from './reset-all-button/reset-all-button.component';
import { TotalRowCountComponent } from './total-row-count/total-row-count.component';
import { UploadToSapButtonComponent } from './upload-to-sap-button/upload-to-sap-button.component';

@NgModule({
  declarations: [
    AddToOfferButtonComponent,
    CreateCaseButtonComponent,
    DeleteCaseButtonComponent,
    DetailViewButtonComponent,
    ExportToExcelButtonComponent,
    FinishOfferButtonComponent,
    OpenCaseButtonComponent,
    ResetAllButtonComponent,
    RemoveFromOfferButtonComponent,
    TotalRowCountComponent,
    UploadToSapButtonComponent,
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
    AddToOfferButtonComponent,
    CreateCaseButtonComponent,
    DeleteCaseButtonComponent,
    DetailViewButtonComponent,
    ExportToExcelButtonComponent,
    FinishOfferButtonComponent,
    OpenCaseButtonComponent,
    RemoveFromOfferButtonComponent,
    ResetAllButtonComponent,
    TotalRowCountComponent,
    UploadToSapButtonComponent,
  ],
})
export class CustomStatusBarModule {}
