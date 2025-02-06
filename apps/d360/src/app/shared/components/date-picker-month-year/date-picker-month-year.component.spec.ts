import { FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { addMonths, endOfMonth, startOfMonth, subMonths } from 'date-fns';

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
  let spectator: Spectator<DatePickerMonthYearComponent>;

  const createComponent = createComponentFactory({
    component: DatePickerMonthYearComponent,
    imports: [],
    providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
      provideDateFnsAdapter(),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        control: new FormControl(null),
        endOf: false,
      } as any,
    });
  });

  describe('ngOnInit', () => {
    it('should initialize the component with a date value', () => {
      const testDate = new Date();
      spectator.component['control']().setValue(testDate);

      spectator.component.ngOnInit();

      expect(spectator.component['control']().getRawValue()).toEqual(testDate);
    });

    it('should initialize the component with a string date value', () => {
      const testDate = '2024/12/31';
      spectator.component['control']().setValue(testDate);

      spectator.component.ngOnInit();

      expect(spectator.component['control']().getRawValue()).toEqual(
        startOfMonth(new Date(testDate))
      );
    });
  });

  describe('onSelectMonth', () => {
    it('should set the value of control to start of month when endOf is false', () => {
      const testDate = new Date();
      jest.spyOn(spectator.component as any, 'endOf').mockReturnValue(false);
      spectator.component['onSelectMonth'](testDate, {
        close: jest.fn(),
      } as any as MatDatepicker<Date>);

      expect(spectator.component['control']().getRawValue()).toEqual(
        startOfMonth(testDate)
      );
    });

    it('should set the value of control to end of month when endOf is true', () => {
      const testDate = new Date();
      jest.spyOn(spectator.component as any, 'endOf').mockReturnValue(true);
      spectator.component['onSelectMonth'](testDate, {
        close: jest.fn(),
      } as any as MatDatepicker<Date>);

      expect(spectator.component['control']().getRawValue()).toEqual(
        endOfMonth(testDate)
      );
    });
  });

  describe('input values', () => {
    it('should have default value for minDate and maxDate', () => {
      expect(spectator.component['minDate']()).toEqual(
        startOfMonth(subMonths(new Date(), 36))
      );
      expect(spectator.component['maxDate']()).toEqual(
        endOfMonth(addMonths(new Date(), 36))
      );
    });

    it('should have default value for endOf', () => {
      expect(spectator.component['endOf']()).toBeFalsy();
    });
  });
});
