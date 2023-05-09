import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ActiveCaseEffects } from './active-case.effects';
import { activeCaseFeature } from './active-case.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(activeCaseFeature),
    EffectsModule.forFeature([ActiveCaseEffects]),
  ],
})
export class ActiveCaseModule {}
