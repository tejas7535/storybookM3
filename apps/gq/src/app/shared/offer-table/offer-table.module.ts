import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomStatusBarModule } from '../custom-status-bar/custom-status-bar.module';
import { FinishOfferButtonComponent } from '../custom-status-bar/finish-offer-button/finish-offer-button.component';
import { RemoveFromOfferButtonComponent } from '../custom-status-bar/remove-from-offer-button/remove-from-offer-button.component';
import { SharedModule } from '../shared.module';
import { OfferTableComponent } from './offer-table.component';

@NgModule({
  declarations: [OfferTableComponent],
  imports: [
    AgGridModule.withComponents([
      FinishOfferButtonComponent,
      RemoveFromOfferButtonComponent,
    ]),
    CustomStatusBarModule,
    SharedModule,
    SharedTranslocoModule,
  ],
  exports: [OfferTableComponent],
})
export class OfferTableModule {}
