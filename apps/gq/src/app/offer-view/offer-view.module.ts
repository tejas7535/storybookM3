import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared';
import { CaseHeaderModule } from '../shared/case-header/case-header.module';
import { OfferTableModule } from '../shared/offer-table/offer-table.module';
import { OfferViewRoutingModule } from './offer-view-routing.module';
import { OfferViewComponent } from './offer-view.component';

@NgModule({
  declarations: [OfferViewComponent],
  imports: [
    CaseHeaderModule,
    OfferTableModule,
    OfferViewRoutingModule,
    SharedModule,
    SharedTranslocoModule,
  ],
})
export class OfferViewModule {}
