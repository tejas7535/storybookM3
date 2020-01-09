import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { SnackBarModule } from '@schaeffler/shared/ui-components';

import { ResultTranslationComponent } from './result-translation.component';

describe('ResultTranslationComponent', () => {
  let component: ResultTranslationComponent;
  let fixture: ComponentFixture<ResultTranslationComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        SnackBarModule,
        NoopAnimationsModule
      ],
      declarations: [ResultTranslationComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    test('should do nothing when change is not from translation', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({});

      expect(component.translationFormControl.value).toEqual('');
    });

    test('should save translation if translation changed', () => {
      const trans = 'new trans incoming';

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        translation: {
          previousValue: [],
          currentValue: trans,
          isFirstChange: () => false,
          firstChange: false
        }
      });

      expect(component.translationFormControl.value).toEqual(trans);
    });
  });

  describe('copyToClipBoard', () => {
    test('it should copy text to clip board', () => {
      component.translation = 'test';
      component['document'].execCommand = jest.fn();
      component.copyToClipBoard();

      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });
});
