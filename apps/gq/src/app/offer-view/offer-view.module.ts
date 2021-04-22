import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HeaderContentModule } from '../process-case-view/header-content/header-content.module';
import { SharedModule } from '../shared';
import { CaseHeaderModule } from '../shared/header/case-header/case-header.module';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { OfferTableModule } from '../shared/offer-table/offer-table.module';
import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';
import { OfferViewRoutingModule } from './offer-view-routing.module';
import { OfferViewComponent } from './offer-view.component';

@NgModule({
  declarations: [OfferViewComponent],
  imports: [
    CaseHeaderModule,
    OfferTableModule,
    MatIconModule,
    HeaderContentModule,
    OfferViewRoutingModule,
    ReactiveComponentModule,
    SharedModule,
    SharedPipesModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
  ],
})
export class OfferViewModule {}
