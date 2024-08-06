import { NgModule } from '@angular/core';

import { SapSyncStatusEffects } from '@gq/core/store/active-case/sap-sync-status/sap-sync-status.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ActiveCaseEffects } from './active-case.effects';
import { ActiveCaseFacade } from './active-case.facade';
import { activeCaseFeature } from './active-case.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(activeCaseFeature),
    EffectsModule.forFeature([ActiveCaseEffects, SapSyncStatusEffects]),
  ],
  providers: [ActiveCaseFacade],
})
export class ActiveCaseModule {}
