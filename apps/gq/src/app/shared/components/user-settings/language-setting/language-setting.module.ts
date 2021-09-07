import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TranslocoModule } from '@ngneat/transloco';

import { LanguageSettingComponent } from './language-setting.component';

@NgModule({
  declarations: [LanguageSettingComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [LanguageSettingComponent],
})
export class LanguageSettingModule {}
