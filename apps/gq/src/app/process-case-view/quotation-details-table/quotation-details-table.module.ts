import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { AddToOfferButtonComponent } from '../../shared/custom-status-bar/add-to-offer-button/add-to-offer-button.component';
import { CustomStatusBarModule } from '../../shared/custom-status-bar/custom-status-bar.module';
import { DetailViewButtonComponent } from '../../shared/custom-status-bar/detail-view-button/detail-view-button.component';
import { TotalRowCountComponent } from '../../shared/custom-status-bar/total-row-count/total-row-count.component';
import { CellRendererModule } from './cell-renderer/cell-renderer.module';
import { QuotationDetailsTableComponent } from './quotation-details-table.component';

@NgModule({
  declarations: [QuotationDetailsTableComponent],
  imports: [
    SharedModule,
    AgGridModule.withComponents([
      DetailViewButtonComponent,
      AddToOfferButtonComponent,
      TotalRowCountComponent,
    ]),
    ReactiveComponentModule,
    SharedTranslocoModule,
    CustomStatusBarModule,
    CellRendererModule,
  ],
  exports: [QuotationDetailsTableComponent],
})
export class QuotationDetailsTableModule {}
