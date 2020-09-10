import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FilterInputModule } from './filter-input/filter-input.module';
import { InputSectionComponent } from './input-section.component';

@NgModule({
  declarations: [InputSectionComponent],
  imports: [
    CommonModule,
    FilterInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [InputSectionComponent],
})
export class InputSectionModule {}
