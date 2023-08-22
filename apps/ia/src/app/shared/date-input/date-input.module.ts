import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DateInputComponent } from './date-input.component';
import { DateRangeFormatDirective } from './date-range-format.directive';
import { DateYearFormatDirective } from './date-year-format.directive';

@NgModule({
  declarations: [
    DateInputComponent,
    DateRangeFormatDirective,
    DateYearFormatDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule,
    SharedTranslocoModule,
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
  exports: [DateInputComponent],
})
export class DateInputModule {}
