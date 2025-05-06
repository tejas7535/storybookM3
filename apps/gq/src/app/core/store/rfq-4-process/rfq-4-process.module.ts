import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { Rfq4ProcessEffects } from './rfq-4-process.effects';
import { rfq4ProcessFeature } from './rfq-4-process.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(rfq4ProcessFeature),
    EffectsModule.forFeature([Rfq4ProcessEffects]),
  ],
})
export class Rfq4ProcessModule {}
