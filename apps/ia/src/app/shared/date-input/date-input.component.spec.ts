import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MATERIAL_SANITY_CHECKS,
  MatNativeDateModule,
} from '@angular/material/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
  MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../assets/i18n/en.json';
import { TimePeriod } from '../models';
import { DateInputComponent } from './date-input.component';

describe('DateInputComponent', () => {
  let component: DateInputComponent;
  let spectator: Spectator<DateInputComponent>;

  const createComponent = createComponentFactory({
    component: DateInputComponent,
    declarations: [DateInputComponent],
    imports: [
      FormsModule,
      MatDatepickerModule,
      MatFormFieldModule,
      MatInputModule,
      MatNativeDateModule,
      ReactiveFormsModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set disabled', () => {
    test('should disable control when true', () => {
      component.rangeInput.controls.start.disable = jest.fn();
      component.rangeInput.controls.end.enable = jest.fn();

      component.disabled = true;

      expect(component.rangeInput.controls.start.disable).toHaveBeenCalled();
      expect(component.rangeInput.controls.end.enable).not.toHaveBeenCalled();
    });
    test('should enable control when false', () => {
      component.rangeInput.controls.start.disable = jest.fn();
      component.rangeInput.controls.end.enable = jest.fn();

      component.disabled = false;

      expect(
        component.rangeInput.controls.start.disable
      ).not.toHaveBeenCalled();
      expect(component.rangeInput.controls.end.enable).toHaveBeenCalled();
    });
  });

  describe('updateStartEndDates', () => {
    let refDate: Date;

    beforeEach(() => {
      component.emitChange = jest.fn();
      refDate = new Date('10/23/2015');
    });

    test('should set complete month for MONTH', (done) => {
      component.timePeriod = TimePeriod.MONTH;
      component.updateStartEndDates(refDate);

      expect(component.rangeInput.controls.start.value).toEqual(
        new Date('10/01/2015')
      );
      expect(component.rangeInput.controls.end.value).toEqual(
        new Date('10/31/2015')
      );

      setTimeout(() => {
        expect(component.emitChange).toHaveBeenCalled();
        done();
      }, 50);
    });

    test('should set complete year for YEAR', (done) => {
      component.timePeriod = TimePeriod.YEAR;
      component.updateStartEndDates(refDate);

      expect(component.rangeInput.controls.start.value).toEqual(
        new Date('01/01/2015')
      );
      expect(component.rangeInput.controls.end.value).toEqual(
        new Date('12/31/2015')
      );

      setTimeout(() => {
        expect(component.emitChange).toHaveBeenCalled();
        done();
      }, 50);
    });

    test('should set complete year for LAST_12_MONTHS', (done) => {
      component.timePeriod = TimePeriod.LAST_12_MONTHS;
      component.updateStartEndDates(refDate);

      expect(component.rangeInput.controls.end.value).toEqual(
        component.nowDate
      );

      setTimeout(() => {
        expect(component.emitChange).toHaveBeenCalled();
        done();
      }, 50);
    });

    test('should return on CUSTOM', () => {
      component.timePeriod = TimePeriod.CUSTOM;
      component.updateStartEndDates(refDate);
      expect(component.emitChange).not.toHaveBeenCalled();
    });
  });

  describe('setStartView', () => {
    test('should set startView to multi-year on YEAR', () => {
      component.timePeriod = TimePeriod.YEAR;
      component.setStartView();

      expect(component.startView).toEqual('multi-year');
    });

    test('should set startView to year on MONTH', () => {
      component.timePeriod = TimePeriod.MONTH;
      component.setStartView();

      expect(component.startView).toEqual('year');
    });

    test('should set startView to month on default', () => {
      component.timePeriod = TimePeriod.CUSTOM;
      component.setStartView();

      expect(component.startView).toEqual('month');
    });
  });

  describe('chosenYearHandler', () => {
    test('should update dates on YEAR', () => {
      component.updateStartEndDates = jest.fn();
      component.timePeriod = TimePeriod.YEAR;
      const date = new Date();
      const datepicker = {
        close: jest.fn(),
      } as unknown as MatDateRangePicker<any>;

      component.chosenYearHandler(date, datepicker);

      expect(datepicker.close).toHaveBeenCalled();
      expect(component.updateStartEndDates).toHaveBeenCalledWith(date);
    });

    test('should do nothing on default', () => {
      component.updateStartEndDates = jest.fn();
      component.timePeriod = TimePeriod.CUSTOM;
      const date = new Date();
      const datepicker = {
        close: jest.fn(),
      } as unknown as MatDateRangePicker<any>;

      component.chosenYearHandler(date, datepicker);

      expect(datepicker.close).not.toHaveBeenCalled();
    });
  });

  describe('chosenMonthHandler', () => {
    test('should update dates on MONTH', () => {
      component.updateStartEndDates = jest.fn();
      component.timePeriod = TimePeriod.MONTH;
      const date = new Date();
      const datepicker = {
        close: jest.fn(),
      } as unknown as MatDateRangePicker<any>;

      component.chosenMonthHandler(date, datepicker);

      expect(datepicker.close).toHaveBeenCalled();
      expect(component.updateStartEndDates).toHaveBeenCalledWith(date);
    });

    test('should do nothing on default', () => {
      component.updateStartEndDates = jest.fn();
      component.timePeriod = TimePeriod.CUSTOM;
      const date = new Date();
      const datepicker = {
        close: jest.fn(),
      } as unknown as MatDateRangePicker<any>;

      component.chosenMonthHandler(date, datepicker);

      expect(datepicker.close).not.toHaveBeenCalled();
    });
  });

  describe('startDateChanged', () => {
    let datepicker: MatDateRangePicker<any>;
    let endDateInput: HTMLInputElement;
    let evt: MatDatepickerInputEvent<any>;

    beforeEach(() => {
      component.updateStartEndDates = jest.fn();
      datepicker = {
        close: jest.fn(),
      } as unknown as MatDateRangePicker<any>;
      endDateInput = {
        focus: jest.fn(),
      } as unknown as HTMLInputElement;
      evt = {
        value: new Date(),
      } as unknown as MatDatepickerInputEvent<any>;
    });

    test('should update dates on YEAR', () => {
      component.timePeriod = TimePeriod.YEAR;

      component.startDateChanged(evt, datepicker, endDateInput);

      expect(component.updateStartEndDates).toHaveBeenCalledWith(evt.value);
      expect(datepicker.close).toHaveBeenCalled();
      expect(endDateInput.focus).toHaveBeenCalled();
    });
    test('should update dates on MONTH', () => {
      component.timePeriod = TimePeriod.MONTH;

      component.startDateChanged(evt, datepicker, endDateInput);

      expect(component.updateStartEndDates).toHaveBeenCalledWith(evt.value);
      expect(datepicker.close).toHaveBeenCalled();
      expect(endDateInput.focus).toHaveBeenCalled();
    });
    test('should update dates on LAST_12_MONTHS', () => {
      component.timePeriod = TimePeriod.LAST_12_MONTHS;

      component.startDateChanged(evt, datepicker, endDateInput);

      expect(component.updateStartEndDates).toHaveBeenCalledWith(evt.value);
      expect(datepicker.close).toHaveBeenCalled();
      expect(endDateInput.focus).toHaveBeenCalled();
    });

    test('should do nothing on default', () => {
      component.timePeriod = TimePeriod.CUSTOM;

      component.startDateChanged(evt, datepicker, endDateInput);

      expect(datepicker.close).not.toHaveBeenCalled();
      expect(endDateInput.focus).not.toHaveBeenCalled();
    });
  });

  describe('endDateChanged', () => {
    test('should do nothing on default', () => {
      component.timePeriod = TimePeriod.YEAR;
      component.emitChange = jest.fn();

      component.endDateChanged({} as unknown as MatDatepickerInputEvent<any>);

      expect(component.emitChange).not.toHaveBeenCalled();
    });

    test('should emit change on CUSTOM', () => {
      component.timePeriod = TimePeriod.CUSTOM;
      component.emitChange = jest.fn();

      component.endDateChanged({
        value: 'xx',
      } as unknown as MatDatepickerInputEvent<any>);

      expect(component.emitChange).toHaveBeenCalled();
    });
  });

  describe('emitChange', () => {
    test('should emit currently selected dates', () => {
      const start = new Date();
      const end = new Date();
      component.rangeInput.controls.start.setValue(start);
      component.rangeInput.controls.end.setValue(end);

      component.selected.emit = jest.fn();

      component.emitChange();

      expect(component.selected.emit).toHaveBeenCalledWith(
        `${start.getTime()}|${end.getTime()}`
      );
    });
  });
});
