import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
  MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import moment, { Moment } from 'moment';

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
      MatMomentDateModule,
      ReactiveFormsModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
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
    let refDate: Moment;

    beforeEach(() => {
      component.emitChange = jest.fn();
      refDate = moment('2015-10-23');
    });

    test('should set complete year for YEAR', (done) => {
      component.timePeriod = TimePeriod.YEAR;
      component.updateStartEndDates(refDate);

      expect(
        moment('2015-01-01').isSame(component.rangeInput.controls.start.value)
      ).toBeTruthy();
      expect(
        refDate
          .clone()
          .endOf('year')
          .isSame(component.rangeInput.controls.end.value)
      ).toBeTruthy();

      setTimeout(() => {
        expect(component.emitChange).toHaveBeenCalled();
        done();
      }, 50);
    });

    test('should set complete year for LAST_12_MONTHS', (done) => {
      component.timePeriod = TimePeriod.LAST_12_MONTHS;
      component.updateStartEndDates(refDate);

      expect(component.rangeInput.controls.end.value).toEqual(
        component.nowDate.clone().subtract(1, 'month').endOf('month')
      );

      setTimeout(() => {
        expect(component.emitChange).toHaveBeenCalled();
        done();
      }, 50);
    });
  });

  describe('setStartView', () => {
    test('should set startView to multi-year on YEAR', () => {
      component.timePeriod = TimePeriod.YEAR;
      component.setStartView();

      expect(component.startView).toEqual('multi-year');
    });
  });

  describe('chosenYearHandler', () => {
    test('should update dates on YEAR', () => {
      component.updateStartEndDates = jest.fn();
      component.timePeriod = TimePeriod.YEAR;
      const date = moment();
      const datepicker = {
        close: jest.fn(),
      } as unknown as MatDateRangePicker<any>;

      component.chosenYearHandler(date, datepicker);

      expect(datepicker.close).toHaveBeenCalled();
      expect(component.updateStartEndDates).toHaveBeenCalledWith(date);
    });

    test('should do nothing on default', () => {
      component.updateStartEndDates = jest.fn();
      component.timePeriod = TimePeriod.LAST_12_MONTHS;
      const date = moment();
      const datepicker = {
        close: jest.fn(),
      } as unknown as MatDateRangePicker<any>;

      component.chosenYearHandler(date, datepicker);

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

    test('should update dates on LAST_12_MONTHS', () => {
      component.timePeriod = TimePeriod.LAST_12_MONTHS;

      component.startDateChanged(evt, datepicker, endDateInput);

      expect(component.updateStartEndDates).toHaveBeenCalledWith(evt.value);
      expect(datepicker.close).toHaveBeenCalled();
      expect(endDateInput.focus).toHaveBeenCalled();
    });

    test('should do nothing on default', () => {
      component.timePeriod = undefined;

      component.startDateChanged(evt, datepicker, endDateInput);

      expect(datepicker.close).not.toHaveBeenCalled();
      expect(endDateInput.focus).not.toHaveBeenCalled();
    });
  });

  describe('emitChange', () => {
    test('should emit currently selected dates', () => {
      const start = moment();
      const end = moment();
      component.rangeInput.controls.start.setValue(start);
      component.rangeInput.controls.end.setValue(end);

      component.selected.emit = jest.fn();

      component.emitChange();

      expect(component.selected.emit).toHaveBeenCalledWith(
        `${start.unix()}|${end.unix()}`
      );
    });
  });
});
