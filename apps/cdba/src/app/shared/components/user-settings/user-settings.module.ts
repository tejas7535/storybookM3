import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    ReactiveFormsModule,

    // shared modules
    SharedTranslocoModule,

    // ui modules
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    LanguageSelectModule,
    LocaleSelectModule,
  ],
  exports: [UserSettingsComponent],
})
export class UserSettingsModule {}
