import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedDirectivesModule } from '../shared/directives/shared-directives.module';
import { SharedModule } from '../shared/shared.module';
import { LossOfSkillComponent } from './loss-of-skill.component';
import { LossOfSkillRoutingModule } from './loss-of-skill-routing.module';
import { LostJobProfilesModule } from './lost-job-profiles/lost-job-profiles.module';
import { PmgmModule } from './pmgm/pmgm.module';
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
    PmgmModule,
    MatCardModule,
    PushPipe,
    SharedDirectivesModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'loss-of-skill' }],
})
export class LossOfSkillModule {}
