import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';

import { LanguageSettingModule } from './language-setting/language-setting.module';
import { RolesRightsModule } from './roles-rights/roles-rights.module';
import { UserSettingsComponent } from './user-settings.component';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    CommonModule,
    LanguageSettingModule,
    RolesRightsModule,
    TranslocoModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'user-settings',
    },
  ],
  exports: [UserSettingsComponent],
})
export class UserSettingsModule {}
