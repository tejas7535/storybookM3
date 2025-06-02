import { FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';

import { addMonths, endOfMonth, startOfMonth, subMonths } from 'date-fns';

import { Stub } from '../../test/stub.class';
import { DatePickerMonthYearComponent } from './date-picker-month-year.component';

jest.mock('../../constants/available-locales', () => ({
  getMonthYearDateFormatByCode: jest.fn(() => ({
    parse: { dateInput: 'MM.yyyy' },
    display: {
      dateInput: 'MM.yyyy',
      monthYearLabel: 'MMMM yyyy',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM yyyy',
    },
  })),
}));

describe('DatePickerMonthYearComponent', () => {
  let component: DatePickerMonthYearComponent;

  beforeEach(() => {
    component = Stub.getForEffect<DatePickerMonthYearComponent>({
      component: DatePickerMonthYearComponent,
      imports: [],
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        provideDateFnsAdapter(),
      ],
    });

    Stub.setInputs([
      { property: 'label', value: 'Select Month and Year' },
      { property: 'control', value: new FormControl(null) },
      { property: 'hint', value: 'Please select a month and year' },
      { property: 'errorMessage', value: 'Invalid date' },
      { property: 'endOf', value: false },
    ]);

    Stub.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should initialize the component with a date value', () => {
      const testDate = new Date();
      component['control']().setValue(testDate);

      component.ngOnInit();

      expect(component['control']().getRawValue()).toEqual(testDate);
    });

    it('should initialize the component with a string date value', () => {
      const testDate = '2024/12/31';
      component['control']().setValue(testDate);

      component.ngOnInit();

      expect(component['control']().getRawValue()).toEqual(
        startOfMonth(new Date(testDate))
      );
    });
  });

  describe('onSelectMonth', () => {
    it('should set the value of control to start of month when endOf is false', () => {
      const testDate = new Date();
      jest.spyOn(component as any, 'endOf').mockReturnValue(false);
      component['onSelectMonth'](testDate, {
        close: jest.fn(),
      } as any as MatDatepicker<Date>);

      expect(component['control']().getRawValue()).toEqual(
        startOfMonth(testDate)
      );
    });

    it('should set the value of control to end of month when endOf is true', () => {
      const testDate = new Date();
      jest.spyOn(component as any, 'endOf').mockReturnValue(true);
      component['onSelectMonth'](testDate, {
        close: jest.fn(),
      } as any as MatDatepicker<Date>);

      expect(component['control']().getRawValue()).toEqual(
        endOfMonth(testDate)
      );
    });
  });

  describe('input values', () => {
    it('should have default value for minDate and maxDate', () => {
      expect(component['minDate']()).toEqual(
        startOfMonth(subMonths(new Date(), 36))
      );
      expect(component['maxDate']()).toEqual(
        endOfMonth(addMonths(new Date(), 36))
      );
    });

    it('should have default value for endOf', () => {
      expect(component['endOf']()).toBeFalsy();
    });
  });
});
