import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { LanguageDetectionComponent } from './language-detection.component';

@NgModule({
  declarations: [LanguageDetectionComponent],
  imports: [CommonModule, MatIconModule, MatSelectModule, ReactiveFormsModule],
  exports: [LanguageDetectionComponent]
})
export class LanguageDetectionModule {}
