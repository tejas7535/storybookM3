import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { environment } from '@ea/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import {
  CalculationParametersEffects,
  CalculationResultEffects,
} from './effects';
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
      CalculationResultEffects,
      CalculationParametersEffects,
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
