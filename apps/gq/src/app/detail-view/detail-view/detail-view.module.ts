import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ReactiveComponentModule } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';

import { SharedModule } from '../../shared';
import { CustomerHeaderModule } from '../../shared/header/customer-header/customer-header.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { DetailViewComponent } from './detail-view.component';
import { DetailViewRoutingModule } from './detail-view-routing.module';
import { FilterPricingModule } from './filter-pricing/filter-pricing.module';
import { PricingDetailsModule } from './pricing-details/pricing-details.module';

@NgModule({
  declarations: [DetailViewComponent],
  imports: [
    DetailViewRoutingModule,
    FilterPricingModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    SharedPipesModule,
    SharedModule,
    PricingDetailsModule,
    LoadingSpinnerModule,
    SubheaderModule,
    BreadcrumbsModule,
    CustomerHeaderModule,
    ShareButtonModule,
  ],
})
export class DetailViewModule {}
