import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared/shared.module';
import { LossOfSkillsRoutingModule } from './loss-of-skills-routing.module';
import { LossOfSkillsComponent } from './loss-of-skills.component';
import { LostJobProfilesModule } from './lost-job-profiles/lost-job-profiles.module';
import { RiskOfLeavingModule } from './risk-of-leaving/risk-of-leaving.module';
import * as fromLossOfSkills from './store';
import { LossOfSkillsEffects } from './store/effects/loss-of-skills.effects';

@NgModule({
  declarations: [LossOfSkillsComponent],
  imports: [
    SharedModule,
    LossOfSkillsRoutingModule,
    SharedTranslocoModule,
    StoreModule.forFeature(
      fromLossOfSkills.lossOfSkillsFeatureKey,
      fromLossOfSkills.reducer
    ),
    EffectsModule.forFeature([LossOfSkillsEffects]),
    LostJobProfilesModule,
    RiskOfLeavingModule,
    MatCardModule,
    ReactiveComponentModule,
  ],
})
export class LossOfSkillsModule {}
