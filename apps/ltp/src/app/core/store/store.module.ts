import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BannerEffects, BannerModule } from '@schaeffler/shared/ui-components';

import { reducers } from './reducers';

import { InputEffects, PredictionEffects } from '.';
import { environment } from '../../../environments/environment';

@NgModule({
  imports: [
    BannerModule,
    NgrxStoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: false
      }
    }),
    EffectsModule.forRoot([BannerEffects, InputEffects, PredictionEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  exports: []
})
export class StoreModule {}
