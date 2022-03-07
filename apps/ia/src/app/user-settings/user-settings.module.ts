import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { RolesAndRightsModule } from '@schaeffler/roles-and-rights';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { LanguageSelectModule } from '@schaeffler/transloco/components';

import { AutocompleteInputModule } from '../shared/autocomplete-input/autocomplete-input.module';
import { SharedModule } from '../shared/shared.module';
import * as fromUserSettings from '../user-settings/store/index';
import { UserSettingsEffects } from './store/effects/user-settings.effects';
import { UserSettingsComponent } from './user-settings.component';
import { UserSettingsDialogModule } from './user-settings-dialog/user-settings-dialog.module';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    LanguageSelectModule,
    StoreModule.forFeature(
      fromUserSettings.userSettingsFeatureKey,
      fromUserSettings.userSettingsReducer
    ),
    EffectsModule.forFeature([UserSettingsEffects]),
    UserSettingsDialogModule,
    AutocompleteInputModule,
    MatDividerModule,
    RolesAndRightsModule,
  ],
  exports: [UserSettingsComponent],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'user-settings' }],
})
export class UserSettingsModule {}
