import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DateRangeComponent } from './date-range.component';

describe('DateRangeComponent', () => {
  let component: DateRangeComponent;
  let fixture: ComponentFixture<DateRangeComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        provideTranslocoTestingModule({}),
      ],
      declarations: [DateRangeComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

      tick(500);

      expect(component['rangeChange'].emit).toHaveBeenCalledTimes(1);
      expect(component['rangeChange'].emit).toHaveBeenCalledWith({
        startDate: 1599651508,
        endDate: 1599651509,
      });
    }));
  });
});
