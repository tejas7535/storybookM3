import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
import { RangeFilterComponent } from './range-filter/range-filter.component';
import { ReferenceTypesFiltersComponent } from './reference-types-filters.component';

describe('ReferenceTypesFiltersComponent', () => {
  let component: ReferenceTypesFiltersComponent;
  let fixture: ComponentFixture<ReferenceTypesFiltersComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReferenceTypesFiltersComponent,
        RangeFilterComponent,
        MultiSelectFilterComponent,
      ],
      imports: [
        NoopAnimationsModule,
        SharedModule,
        provideTranslocoTestingModule({}),
        FormsModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceTypesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
