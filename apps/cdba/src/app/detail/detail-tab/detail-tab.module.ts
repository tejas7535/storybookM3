import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { UnderConstructionModule } from '@schaeffler/shared/empty-states';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../shared/shared.module';
import { CustomerModule } from './customer/customer.module';
import { DetailTabRoutingModule } from './detail-tab-routing.module';
import { DetailTabComponent } from './detail-tab.component';
import { DimensionAndWeightModule } from './dimension-and-weight/dimension-and-weight.module';
import { PricingModule } from './pricing/pricing.module';
import { ProductionModule } from './production/production.module';
import { QuantitiesModule } from './quantities/quantities.module';
import { SalesAndDescriptionModule } from './sales-and-description/sales-and-description.module';

@NgModule({
  declarations: [DetailTabComponent],
  imports: [
    DetailTabRoutingModule,
    SharedModule,
    SharedTranslocoModule,
    MatCardModule,
    SalesAndDescriptionModule,
    PricingModule,
    DimensionAndWeightModule,
    CustomerModule,
    QuantitiesModule,
    ProductionModule,
    UnderConstructionModule,
    LoadingSpinnerModule,
  ],
})
export class DetailTabModule {}
