import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
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
  ],
  exports: [InputSectionComponent],
})
export class InputSectionModule {}
