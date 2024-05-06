import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import {
  MatDatepicker,
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

  describe('onLast12MonthsSelected', () => {
    test('should emit the correct value', () => {
      const selectedDate = moment.utc('2021-07-01');
      const dp = {
        close: jest.fn(),
      } as unknown as MatDateRangePicker<Moment>;
      const expected = '1596240000|1627775999';
      const spySelected = jest.spyOn(component.selected, 'emit');

      component.onLast12MonthsSelected(selectedDate, dp);

      expect(spySelected).toHaveBeenCalledWith(expected);
    });
  });

  describe('onYearSelected', () => {
    test('should emit the correct value', () => {
      const selectedDate = moment('2021-07-01');
      const dp = {
        close: jest.fn(),
      } as unknown as MatDatepicker<Moment>;
      const expected = '1609459200|1640995199';
      const spySelected = jest.spyOn(component.selected, 'emit');

      component.onYearSelected(selectedDate, dp);

      expect(spySelected).toHaveBeenCalledWith(expected);
    });
  });

  describe('onMonthSelected', () => {
    test('should emit the correct value', () => {
      const selectedDate = moment('2021-07-01');
      const dp = {
        close: jest.fn(),
      } as unknown as MatDatepicker<Moment>;
      const expected = '1609459200|1640995199';
      const spySelected = jest.spyOn(component.selected, 'emit');

      component.onYearSelected(selectedDate, dp);

      expect(spySelected).toHaveBeenCalledWith(expected);
    });
  });
});
