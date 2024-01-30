import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FPricingEffects } from './f-pricing.effects';
import { fPricingFeature } from './f-pricing.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(fPricingFeature),
    EffectsModule.forFeature([FPricingEffects]),
  ],
})
export class fPricingStoreModule {}
