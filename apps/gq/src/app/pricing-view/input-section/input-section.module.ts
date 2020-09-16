import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FilterInputModule } from './filter-input/filter-input.module';
import { InputSectionComponent } from './input-section.component';
import { MultiInputModule } from './multi-input/multi-input.module';

@NgModule({
  declarations: [InputSectionComponent],
  imports: [
    CommonModule,
    FilterInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MultiInputModule,
    MatChipsModule,
    MatIconModule,
  ],
  exports: [InputSectionComponent],
})
export class InputSectionModule {}
