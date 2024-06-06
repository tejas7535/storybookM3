import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { provideStore, StoreModule as NgrxStoreModule } from '@ngrx/store';
import {
  provideStoreDevtools,
  StoreDevtoolsModule,
} from '@ngrx/store-devtools';

import { environment } from '@mac/environments/environment';

import { RootEffects } from '.';
import { CustomSerializer, metaReducers, reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    NgrxStoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateSerializability: true,

        // We need to turn off this check because we need to transfer a file via the action 'uploadSapMaterials' to the corresponding effect.
        // The file is not stored in the state store!
        // File objects are not serializable and we get the NGRX error 'Detected unserializable action' if we have strictActionSerializability set to true.
        strictActionSerializability: false,
      },
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
      routerState: RouterState.Minimal,
    }),
    environment.devToolsEnabled
      ? StoreDevtoolsModule.instrument({
          maxAge: 50,
          connectInZone: true,
        })
      : /* istanbul ignore next: very difficult */ [],
    EffectsModule.forRoot([RootEffects]),
  ],
  providers: [
    provideStore(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateSerializability: true,

        // We need to turn off this check because we need to transfer a file via the action 'uploadSapMaterials' to the corresponding effect.
        // The file is not stored in the state store!
        // File objects are not serializable and we get the NGRX error 'Detected unserializable action' if we have strictActionSerializability set to true.
        strictActionSerializability: false,
      },
    }),
    provideStoreDevtools(),
  ],
  exports: [],
})
export class StoreModule {}
