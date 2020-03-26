import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';

import { AuthEffects } from './effects/auth.effects';
import { reducer } from './reducers/auth.reducer';

@NgModule({
  imports: [
    NgrxStoreModule.forFeature('auth', reducer),
    EffectsModule.forRoot([AuthEffects])
  ],
  exports: []
})
export class StoreModule {}
