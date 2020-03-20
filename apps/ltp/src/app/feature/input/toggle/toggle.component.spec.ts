import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { configureTestSuite } from 'ng-bullet';

import { ToggleComponent } from './toggle.component';

import { ToggleControl } from './toggle.model';

import * as en from '../../../../assets/i18n/en.json';

describe('ToggleComponent', () => {
  let component: ToggleComponent;
  let fixture: ComponentFixture<ToggleComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        NoopAnimationsModule,
        HttpClientModule,
        provideTranslocoTestingModule({ en })
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleComponent);
    component = fixture.componentInstance;
    component.control = new ToggleControl({
      key: 'testToggle',
      name: 'TEST_TOGGLE',
      disabled: false,
      default: false,
      formControl: new FormControl()
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
