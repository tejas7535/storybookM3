import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { CustomerModule } from './customer/customer.module';
import { DetailTabRoutingModule } from './detail-tab-routing.module';
import { DetailTabComponent } from './detail-tab.component';
import { DimensionAndWeightModule } from './dimension-and-weight/dimension-and-weight.module';
import { DrawingsModule } from './drawings/drawings.module';
import { PricingModule } from './pricing/pricing.module';
import { ProductionModule } from './production/production.module';
import { QuantitiesModule } from './quantities/quantities.module';
import { SalesAndDescriptionModule } from './sales-and-description/sales-and-description.module';

@NgModule({
  declarations: [DetailTabComponent],
  imports: [
    CommonModule,
    ReactiveComponentModule,
    DetailTabRoutingModule,
    SharedTranslocoModule,
    MatCardModule,
    SalesAndDescriptionModule,
    PricingModule,
    DimensionAndWeightModule,
    CustomerModule,
    QuantitiesModule,
    ProductionModule,
    DrawingsModule,
    LoadingSpinnerModule,
  ],
})
export class DetailTabModule {}
