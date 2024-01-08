import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedQuotationEffects } from './shared-quotation.effects';
import { sharedQuotationFeature } from './shared-quotation.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(sharedQuotationFeature),
    EffectsModule.forFeature([SharedQuotationEffects]),
  ],
})
export class SharedQuotationModule {}
