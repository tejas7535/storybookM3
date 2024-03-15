import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../../environments/environment';
import { ROOT_EFFECTS } from './effects';
import { HealthCheckModule } from './health-check/health-check.module';
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
          connectInZone: true,
        })
      : /* istanbul ignore next: very difficult */ [],
    EffectsModule.forRoot([...ROOT_EFFECTS]),
    HealthCheckModule,
  ],
  exports: [],
})
export class StoreModule {}
