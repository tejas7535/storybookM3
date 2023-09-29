import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../../environments/environment';
import { StorageMessagesEffects } from './effects/storage-messages/storage-messages.effects';
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
    EffectsModule.forRoot([StorageMessagesEffects]),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
      routerState: RouterState.Minimal,
    }),
    environment.devToolsEnabled
      ? StoreDevtoolsModule.instrument({
          maxAge: 50,
        })
      : /* istanbul ignore next: very difficult */ [],
  ],
  exports: [],
})
export class StoreModule {}
