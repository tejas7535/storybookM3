import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '@ga/../environments/environment';

import { BearingSelectionEffects } from './effects/bearing-selection/bearing-selection.effects';
import { SettingsEffects } from './effects/settings/settings.effects';
import { CustomSerializer, metaReducers, reducers } from './reducers';

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
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
      routerState: RouterState.Minimal,
    }),
    environment.devToolsEnabled
      ? StoreDevtoolsModule.instrument({
          maxAge: 50,
        })
      : /* istanbul ignore next: very difficult */ [],
    EffectsModule.forRoot([BearingSelectionEffects, SettingsEffects]),
  ],
  exports: [],
})
export class StoreModule {}
