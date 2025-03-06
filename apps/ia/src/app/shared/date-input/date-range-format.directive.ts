import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { DATE_FORMAT_BEAUTY } from '../constants';

const DATE_FORMATS = {
  parse: {
    dateInput: ['MM/YYYY', DATE_FORMAT_BEAUTY],
  },
  display: {
    dateInput: DATE_FORMAT_BEAUTY,
    monthYearLabel: DATE_FORMAT_BEAUTY,
    dateA11yLabel: 'LL',
    monthYearA11yLabel: DATE_FORMAT_BEAUTY,
  },
};

@Directive({
  selector: '[iaDateRangeFormat]',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }],
  standalone: false,
})
export class DateRangeFormatDirective {}
