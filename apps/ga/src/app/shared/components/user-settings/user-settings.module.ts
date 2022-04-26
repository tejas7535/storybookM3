import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { LanguageSelectModule } from '@schaeffler/transloco/components';

import { UserSettingsComponent } from './user-settings.component';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    // angular modules
    CommonModule,

    // shared modules
    SharedTranslocoModule,
    LanguageSelectModule,
  ],
  exports: [UserSettingsComponent],
})
export class UserSettingsModule {}
