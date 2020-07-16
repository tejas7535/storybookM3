import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailEffects } from '../core/store/effects/detail/detail.effects';
import { detailReducer } from '../core/store/reducers/detail/detail.reducer';
import { SharedModule } from '../shared/shared.module';
import { CustomerModule } from './customer/customer.module';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import { DimensionAndWeightModule } from './dimension-and-weight/dimension-and-weight.module';
import { PricingModule } from './pricing/pricing.module';
import { ProductionModule } from './production/production.module';
import { QuantitiesModule } from './quantities/quantities.module';
import { SalesAndDescriptionModule } from './sales-and-description/sales-and-description.module';

@NgModule({
  declarations: [DetailComponent],
  imports: [
    SharedModule,
    DetailRoutingModule,
    MatTabsModule,
    SharedTranslocoModule,
    StoreModule.forFeature('detail', detailReducer),
    MatIconModule,
    MatCardModule,
    EffectsModule.forFeature([DetailEffects]),
    SalesAndDescriptionModule,
    PricingModule,
    DimensionAndWeightModule,
    CustomerModule,
    QuantitiesModule,
    ProductionModule,
  ],
})
export class DetailModule {}
