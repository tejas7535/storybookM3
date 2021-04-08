import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared';
import { CaseHeaderModule } from '../shared/header/case-header/case-header.module';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { OfferTableModule } from '../shared/offer-table/offer-table.module';
import { OfferViewRoutingModule } from './offer-view-routing.module';
import { OfferViewComponent } from './offer-view.component';

@NgModule({
  declarations: [OfferViewComponent],
  imports: [
    CaseHeaderModule,
    OfferTableModule,
    OfferViewRoutingModule,
    ReactiveComponentModule,
    SharedModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
  ],
})
export class OfferViewModule {}
