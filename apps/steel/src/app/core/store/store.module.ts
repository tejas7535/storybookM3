import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BannerEffects, BannerModule } from '@schaeffler/shared/ui-components';

import { environment } from '../../../environments/environment';
import { CustomSerializer, metaReducers, reducers } from './reducers';

@NgModule({
  imports: [
    BannerModule,
    CommonModule,
    NgrxStoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: false
      }
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
      routerState: RouterState.Minimal
    }),
    EffectsModule.forRoot([BannerEffects]),
    environment.devToolsEnabled
      ? StoreDevtoolsModule.instrument({
          maxAge: 50
        })
      : /* istanbul ignore next: very difficult */ []
  ],
  exports: []
})
export class StoreModule {}
