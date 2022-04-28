import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

const DATE_FORMATS = {
  parse: {
    dateInput: ['MM/YYYY', 'MMM YYYY'],
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Directive({
  selector: '[iaDateRangeFormat]',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }],
})
export class DateRangeFormatDirective {}
