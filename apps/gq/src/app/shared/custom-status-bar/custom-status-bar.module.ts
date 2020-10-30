import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AddToOfferButtonComponent } from './add-to-offer-button/add-to-offer-button.component';
import { CreateCaseButtonComponent } from './create-case-button/create-case-button.component';
import { DetailViewButtonComponent } from './detail-view-button/detail-view-button.component';
import { ExportToCsvButtonComponent } from './export-to-csv-button/export-to-csv-button.component';
import { FinishOfferButtonComponent } from './finish-offer-button/finish-offer-button.component';
import { RemoveFromOfferButtonComponent } from './remove-from-offer-button/remove-from-offer-button.component';
import { ResetAllButtonComponent } from './reset-all-button/reset-all-button.component';
import { UploadToSapButtonComponent } from './upload-to-sap-button/upload-to-sap-button.component';

@NgModule({
  declarations: [
    AddToOfferButtonComponent,
    CreateCaseButtonComponent,
    DetailViewButtonComponent,
    ExportToCsvButtonComponent,
    FinishOfferButtonComponent,
    ResetAllButtonComponent,
    RemoveFromOfferButtonComponent,
    UploadToSapButtonComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
  ],
  exports: [
    AddToOfferButtonComponent,
    CreateCaseButtonComponent,
    DetailViewButtonComponent,
    ExportToCsvButtonComponent,
    FinishOfferButtonComponent,
    RemoveFromOfferButtonComponent,
    ResetAllButtonComponent,
    UploadToSapButtonComponent,
  ],
})
export class CustomStatusBarModule {}
