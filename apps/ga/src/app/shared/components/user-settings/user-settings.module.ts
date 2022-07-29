import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import {
  LanguageSelectModule,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import { MeasurementUnitsSelectComponent } from '@ga/shared/components/measurement-units-select';

import { UserSettingsComponent } from './user-settings.component';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    // angular modules
    CommonModule,
    MatDividerModule,

    // shared modules
    SharedTranslocoModule,
    LanguageSelectModule,
    LocaleSelectModule,

    // UI
    MeasurementUnitsSelectComponent,
  ],
  exports: [UserSettingsComponent],
})
export class UserSettingsModule {}
