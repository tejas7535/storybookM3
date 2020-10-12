import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AddToOfferButtonComponent } from '../../shared/custom-status-bar/add-to-offer-button/add-to-offer-button.component';
import { CustomStatusBarModule } from '../../shared/custom-status-bar/custom-status-bar.module';
import { DetailViewButtonComponent } from '../../shared/custom-status-bar/detail-view-button/detail-view-button.component';
import { SharedModule } from '../../shared/shared.module';
import { QuotationDetailsTableComponent } from './quotation-details-table.component';

@NgModule({
  declarations: [QuotationDetailsTableComponent],
  imports: [
    SharedModule,
    AgGridModule.withComponents([
      DetailViewButtonComponent,
      AddToOfferButtonComponent,
    ]),
    SharedTranslocoModule,
    CustomStatusBarModule,
  ],
  exports: [QuotationDetailsTableComponent],
})
export class QuotationDetailsTableModule {}
