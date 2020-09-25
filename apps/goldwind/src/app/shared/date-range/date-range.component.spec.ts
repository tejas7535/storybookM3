import { fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { DateRangeComponent } from './date-range.component';

describe('DateRangeComponent', () => {
  let component: DateRangeComponent;
  let spectator: Spectator<DateRangeComponent>;

  const createComponent = createComponentFactory({
    component: DateRangeComponent,
    imports: [
      ReactiveFormsModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatFormFieldModule,
    ],
    declarations: [DateRangeComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Range Form', () => {
    test('should emit rangeChange eventemitter on valueChanges', fakeAsync(() => {
      component['rangeChange'].emit = jest.fn();

      const mockInterval = {
        startDate: new Date(1599651508000),
        endDate: new Date(1599651509000),
      };

      component.rangeForm.markAsDirty();
      component.rangeForm.patchValue({ startDate: mockInterval.startDate });
      component.rangeForm.patchValue({ endDate: mockInterval.endDate });

      spectator.tick(500);

      expect(component['rangeChange'].emit).toHaveBeenCalledTimes(1);
      expect(component['rangeChange'].emit).toHaveBeenCalledWith({
        startDate: 1599651508,
        endDate: 1599651509,
      });
    }));
  });
});
