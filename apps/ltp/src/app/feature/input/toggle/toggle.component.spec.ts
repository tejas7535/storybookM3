import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { getTranslocoModule } from '../../../shared/transloco/transloco-testing.module';

import { ToggleComponent } from './toggle.component';

import { ToggleControl } from './toggle.model';

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
        getTranslocoModule()
      ],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: async () => new Promise(() => {})
        }
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
