import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import {
  LanguageSelectModule,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import { UserSettingsComponent } from './user-settings.component';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    // angular modules
    CommonModule,

    // shared modules
    SharedTranslocoModule,
    LanguageSelectModule,
    LocaleSelectModule,
  ],
  exports: [UserSettingsComponent],
})
export class UserSettingsModule {}
