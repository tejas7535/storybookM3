import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { FileUploadModule } from '../../shared/file-upload/file-upload.module';
import { TextInputModule } from '../../shared/text-input/text-input.module';

import { TranslationComponent } from './translation.component';

describe('TranslationComponent', () => {
  let component: TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TranslationComponent],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatTabsModule,
        TextInputModule,
        FileUploadModule
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTranslationForText', () => {
    test('should call getTranslationForText', () => {
      component['dataStore'].getTranslationForText = jest.fn();
      const text = 'text';

      component.getTranslationForText(text);

      expect(component['dataStore'].getTranslationForText).toHaveBeenCalledWith(
        text
      );
    });
  });

  describe('getTranslationForFile', () => {
    test('should call getTagsFromFile', () => {
      component['dataStore'].getTranslationForFile = jest.fn();
      const file = new File([], 'file');

      component.getTranslationForFile(file);

      expect(component['dataStore'].getTranslationForFile).toHaveBeenCalledWith(
        file
      );
    });
  });
});
