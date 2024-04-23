import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { FeedbackDialogModule } from '../shared/dialogs/feedback-dialog/feedback-dialog.module';
import { SharedDirectivesModule } from '../shared/directives/shared-directives.module';
import { SharedModule } from '../shared/shared.module';
import * as fromUserSettings from './store';
import { UserEffects } from './store/effects/user.effects';
import { UserComponent } from './user.component';
import { UserSettingsModule } from './user-settings/user-settings.module';

@NgModule({
  declarations: [UserComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    SharedDirectivesModule,
    UserSettingsModule,
    FeedbackDialogModule,
    StoreModule.forFeature(
      fromUserSettings.userFeatureKey,
      fromUserSettings.userReducer
    ),
    EffectsModule.forFeature([UserEffects]),
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'user' }],
  exports: [UserComponent],
})
export class UserModule {}
