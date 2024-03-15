import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../../environments/environment';
import { FilterEffects } from './effects';
import { CustomSerializer, metaReducers, ROOT_REDUCERS } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    NgrxStoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      runtimeChecks: {
        strictStateSerializability: true,
        strictActionSerializability: true,
      },
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
      routerState: RouterState.Minimal,
      stateKey: 'router',
    }),
    environment.devToolsEnabled
      ? StoreDevtoolsModule.instrument({
          maxAge: 50,
          connectInZone: true,
        })
      : /* istanbul ignore next: very difficult */ [],
    EffectsModule.forRoot([FilterEffects]),
  ],
  exports: [],
})
export class StoreModule {}
