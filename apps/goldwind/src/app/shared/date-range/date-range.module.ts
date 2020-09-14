import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DateRangeComponent } from './date-range.component';

@NgModule({
  declarations: [DateRangeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // UI Modules
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,

    // Translation
    SharedTranslocoModule,
  ],
  exports: [DateRangeComponent],
})
export class DateRangeModule {}
