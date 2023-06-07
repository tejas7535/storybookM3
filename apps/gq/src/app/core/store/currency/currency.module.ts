import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CurrencyEffects } from './currency.effects';
import { CurrencyFacade } from './currency.facade';
import { currencyFeature } from './currency.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(currencyFeature),
    EffectsModule.forFeature([CurrencyEffects]),
  ],
  providers: [CurrencyFacade],
})
export class CurrencyModule {}
