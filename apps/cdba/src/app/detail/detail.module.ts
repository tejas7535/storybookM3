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
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import { PricingModule } from './pricing/pricing.module';
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
  ],
})
export class DetailModule {}
