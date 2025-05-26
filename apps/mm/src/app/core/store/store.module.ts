import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../../environments/environment';
import { CalculationOptionsEffects } from './effects/calculation-options/calculation-options.effects';
import { CalculationResultEffects } from './effects/calculation-result/calculation-result.effects';
import { CalculationSelectionEffects } from './effects/calculation-selection/calculation-selection.effects';
import * as GlobalEffects from './effects/global/global.effects';
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
      StorageMessagesEffects,
      CalculationResultEffects,
      CalculationSelectionEffects,
      CalculationOptionsEffects,
      GlobalEffects,
    ]),
    environment.devToolsEnabled
      ? StoreDevtoolsModule.instrument({
          maxAge: 50,
          connectInZone: true,
        })
      : /* istanbul ignore next: very difficult */ [],
  ],
  exports: [],
})
export class StoreModule {}
