import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';

import { Stub } from '../../test/stub.class';
import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;

  beforeEach(() => {
    component = Stub.getForEffect<DatePickerComponent>({
      component: DatePickerComponent,
      providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
        provideDateFnsAdapter(),
        Stub.getTranslocoLocaleServiceProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct inputs', () => {
    component['label'] = signal('Select Date') as any;
    component['appearance'] = signal('fill') as any;
    component['hint'] = signal('Select a date') as any;
    component['errorMessage'] = signal('Invalid date') as any;
    component['control'] = signal(new FormControl()) as any;

    Stub.detectChanges();

    expect(component['label']()).toEqual('Select Date');
    expect(component['appearance']()).toEqual('fill');
    expect(component['hint']()).toEqual('Select a date');
    expect(component['errorMessage']()).toEqual('Invalid date');
    expect(component['control']()).toBeInstanceOf(FormControl);
  });

  it('should have correct minDate and maxDate inputs', () => {
    const minDate = new Date('2023-01-01T00:00:00');
    const maxDate = new Date('2023-12-31T23:59:59');

    component['minDate'] = signal(minDate) as any;
    component['maxDate'] = signal(maxDate) as any;

    Stub.detectChanges();

    expect(component['minDate']()).toEqual(minDate);
    expect(component['maxDate']()).toEqual(maxDate);
  });

  describe('ngOnInit', () => {
    it('should convert string value to Date object', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2023, 10, 26));
      const control = new FormControl('2023-10-26');
      component['control'] = signal(control) as any;

      component.ngOnInit();

      expect(control.value).toBeInstanceOf(Date);
      expect(control.value).toEqual(new Date('2023-10-26T00:00:00.000Z'));
      jest.useRealTimers();
    });

    it('should not convert if value is already a Date object', () => {
      const initialDate = new Date();
      const control = new FormControl(initialDate);
      component['control'] = signal(control) as any;

      component.ngOnInit();

      expect(control.value).toBe(initialDate);
    });

    it('should not convert if value is null', () => {
      const control = new FormControl(null);
      component['control'] = signal(control) as any;

      component.ngOnInit();

      expect(control.value).toBeNull();
    });

    it('should not convert if value is undefined', () => {
      const control = new FormControl(undefined);
      component['control'] = signal(control) as any;

      component.ngOnInit();

      expect(control.value).toBeNull();
    });
  });
});
