import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { IconModule } from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { LanguageDetectionComponent } from './language-detection.component';

describe('LanguageDetectionComponent', () => {
  let component: LanguageDetectionComponent;
  let fixture: ComponentFixture<LanguageDetectionComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        IconModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule
      ],
      declarations: [LanguageDetectionComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
