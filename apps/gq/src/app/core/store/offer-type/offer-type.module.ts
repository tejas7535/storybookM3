import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { OfferTypeEffects } from './offer-type.effects';
import { OfferTypeFacade } from './offer-type.facade';
import { offerTypeFeature } from './offer-type.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(offerTypeFeature),
    EffectsModule.forFeature([OfferTypeEffects]),
  ],
  providers: [OfferTypeFacade],
})
export class OfferTypeModule {}
