import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';

import { fPricingFeature } from './f-pricing.reducer';

@NgModule({
  imports: [StoreModule.forFeature(fPricingFeature)],
})
export class fPricingStoreModule {}
