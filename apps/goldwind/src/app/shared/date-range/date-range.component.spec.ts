import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DateRangeComponent } from './date-range.component';

// import { provideMockStore } from '@ngrx/store/testing';
describe('DateRangeComponent', () => {
  let component: DateRangeComponent;
  let fixture: ComponentFixture<DateRangeComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        provideTranslocoTestingModule({}),
      ],
      providers: [
        // provideMockStore()
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
});
