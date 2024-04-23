import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE, TranslocoModule } from '@jsverse/transloco';

import {
  LanguageSelectModule,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import { RolesRightsModule } from './roles-rights/roles-rights.module';
import { UserSettingsComponent } from './user-settings.component';
@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    CommonModule,
    RolesRightsModule,
    TranslocoModule,
    LanguageSelectModule,
    LocaleSelectModule,
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
