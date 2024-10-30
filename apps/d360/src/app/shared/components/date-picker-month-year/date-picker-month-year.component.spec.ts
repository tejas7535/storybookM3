import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { DatePickerMonthYearComponent } from './date-picker-month-year.component';

describe('DatePickerMonthYearComponent', () => {
  let component: DatePickerMonthYearComponent;
  let spectator: Spectator<DatePickerMonthYearComponent>;

  const createComponent = createComponentFactory({
    component: DatePickerMonthYearComponent,
    imports: [
      DatePickerMonthYearComponent,
      CommonModule,
      MatButtonModule,
      MatInputModule,
      MatDatepickerModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
    ],
    providers: [
      provideMomentDateAdapter(),
      mockProvider(TranslocoLocaleService, {
        getLocale: () => 'DE-de',
      }),
      {
        provide: MomentDateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct inputs', () => {
    component.placeholder = 'Select Date';
    component.appearance = 'fill';
    component.color = 'accent';
    component.hint = 'Select a date';
    component.errorMessage = 'Invalid date';
    component.dateControl = new FormControl();

    spectator.detectChanges();

    expect(component.placeholder).toEqual('Select Date');
    expect(component.appearance).toEqual('fill');
    expect(component.color).toEqual('accent');
    expect(component.hint).toEqual('Select a date');
    expect(component.errorMessage).toEqual('Invalid date');
    expect(component.dateControl).toBeInstanceOf(FormControl);
  });
});
