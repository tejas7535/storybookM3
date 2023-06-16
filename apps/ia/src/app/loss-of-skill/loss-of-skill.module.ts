import { NgModule } from '@angular/core';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared/shared.module';
import { LossOfSkillComponent } from './loss-of-skill.component';
import { LossOfSkillRoutingModule } from './loss-of-skill-routing.module';
import { LostJobProfilesModule } from './lost-job-profiles/lost-job-profiles.module';
import { RiskOfLeavingModule } from './risk-of-leaving/risk-of-leaving.module';
import * as fromLossOfSkill from './store';
import { LossOfSkillEffects } from './store/effects/loss-of-skill.effects';

@NgModule({
  declarations: [LossOfSkillComponent],
  imports: [
    SharedModule,
    LossOfSkillRoutingModule,
    SharedTranslocoModule,
    StoreModule.forFeature(
      fromLossOfSkill.lossOfSkillFeatureKey,
      fromLossOfSkill.reducer
    ),
    EffectsModule.forFeature([LossOfSkillEffects]),
    LostJobProfilesModule,
    RiskOfLeavingModule,
    MatCardModule,
    PushPipe,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'loss-of-skill' }],
})
export class LossOfSkillModule {}
