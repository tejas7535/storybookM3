import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomerModule } from './customer/customer.module';
import { DetailTabComponent } from './detail-tab.component';
import { DetailTabRoutingModule } from './detail-tab-routing.module';
import { DimensionAndWeightModule } from './dimension-and-weight/dimension-and-weight.module';
import { DrawingsModule } from './drawings/drawings.module';
import { PcmCalculationsModule } from './pcm-calculations/pcm-calculations.module';
import { PricingModule } from './pricing/pricing.module';
import { ProductionModule } from './production/production.module';
import { QuantitiesModule } from './quantities/quantities.module';
import { SalesAndDescriptionModule } from './sales-and-description/sales-and-description.module';

@NgModule({
  declarations: [DetailTabComponent],
  imports: [
    CommonModule,
    ReactiveComponentModule,
    SharedTranslocoModule,
    DetailTabRoutingModule,
    LoadingSpinnerModule,
    CustomerModule,
    DrawingsModule,
    DimensionAndWeightModule,
    PricingModule,
    QuantitiesModule,
    PcmCalculationsModule,
    ProductionModule,
    SalesAndDescriptionModule,
  ],
})
export class DetailTabModule {}
