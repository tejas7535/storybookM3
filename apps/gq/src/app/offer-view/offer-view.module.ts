import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared';
import { OfferTableModule } from '../shared/offer-table/offer-table.module';
import { OfferHeaderModule } from './offer-header/offer-header.module';
import { OfferViewRoutingModule } from './offer-view-routing.module';
import { OfferViewComponent } from './offer-view.component';

@NgModule({
  declarations: [OfferViewComponent],
  imports: [
    OfferHeaderModule,
    OfferTableModule,
    OfferViewRoutingModule,
    SharedModule,
    SharedTranslocoModule,
  ],
})
export class OfferViewModule {}
