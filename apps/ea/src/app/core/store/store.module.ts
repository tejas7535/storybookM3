import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { environment } from '@ea/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import {
  CalculationParametersEffects,
  CatalogCalculationResultEffects,
  CO2UpstreamCalculationResultEffects,
} from './effects';
import { ProductSelectionEffects } from './effects/product-selection';
import { StorageMessagesEffects } from './effects/storage-messages/storage-messages.effects';
import { metaReducers, reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    NgrxStoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateSerializability: true,
        strictActionSerializability: true,
      },
    }),
    EffectsModule.forRoot([
      ProductSelectionEffects,
      CalculationParametersEffects,
      CO2UpstreamCalculationResultEffects,
      CatalogCalculationResultEffects,
      StorageMessagesEffects,
    ]),
    environment.devToolsEnabled
      ? StoreDevtoolsModule.instrument({
          maxAge: 50,
        })
      : /* istanbul ignore next: very difficult */ [],
  ],
  exports: [],
})
export class StoreModule {}
