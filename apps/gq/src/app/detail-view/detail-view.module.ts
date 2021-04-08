import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedModule } from '../shared';
import { CaseHeaderModule } from '../shared/header/case-header/case-header.module';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { OfferDrawerModule } from '../shared/offer-drawer/offer-drawer.module';
import { DetailViewRoutingModule } from './detail-view-routing.module';
import { DetailViewComponent } from './detail-view.component';
import { FilterPricingModule } from './filter-pricing/filter-pricing.module';
import { PricingDetailsModule } from './pricing-details/pricing-details.module';

@NgModule({
  declarations: [DetailViewComponent],
  imports: [
    CaseHeaderModule,
    DetailViewRoutingModule,
    FilterPricingModule,
    OfferDrawerModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    SharedModule,
    PricingDetailsModule,
    LoadingSpinnerModule,
  ],
})
export class DetailViewModule {}
