import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomStatusBarModule } from '../custom-status-bar/custom-status-bar.module';
import { ExportToCsvButtonComponent } from '../custom-status-bar/export-to-csv-button/export-to-csv-button.component';
import { FinishOfferButtonComponent } from '../custom-status-bar/finish-offer-button/finish-offer-button.component';
import { RemoveFromOfferButtonComponent } from '../custom-status-bar/remove-from-offer-button/remove-from-offer-button.component';
import { UploadToSapButtonComponent } from '../custom-status-bar/upload-to-sap-button/upload-to-sap-button.component';
import { SharedModule } from '../shared.module';
import { OfferTableComponent } from './offer-table.component';

@NgModule({
  declarations: [OfferTableComponent],
  imports: [
    AgGridModule.withComponents([
      FinishOfferButtonComponent,
      RemoveFromOfferButtonComponent,
      UploadToSapButtonComponent,
      ExportToCsvButtonComponent,
    ]),
    CustomStatusBarModule,
    SharedModule,
    SharedTranslocoModule,
  ],
  exports: [OfferTableComponent],
})
export class OfferTableModule {}
