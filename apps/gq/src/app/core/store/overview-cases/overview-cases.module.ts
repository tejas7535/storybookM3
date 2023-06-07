import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { OverviewCasesEffects } from './overview-cases.effects';
import { OverviewCasesFacade } from './overview-cases.facade';
import { overviewCasesFeature } from './overview-cases.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(overviewCasesFeature),
    EffectsModule.forFeature([OverviewCasesEffects]),
  ],
  providers: [OverviewCasesFacade],
})
export class OverviewCasesModule {}
