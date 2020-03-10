import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { IconModule } from '@schaeffler/shared/ui-components';

import { LanguageDetectionComponent } from './language-detection.component';

@NgModule({
  declarations: [LanguageDetectionComponent],
  imports: [CommonModule, IconModule, MatSelectModule, ReactiveFormsModule],
  exports: [LanguageDetectionComponent]
})
export class LanguageDetectionModule {}
