import { Subject } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { FileUploadModule } from '../../shared/file-upload/file-upload.module';
import { FunFactsLoadingBarModule } from '../../shared/fun-facts-loading-bar/fun-facts-loading-bar.module';
import { TextInputModule } from '../../shared/text-input/text-input.module';

import { TranslationComponent } from './translation.component';

import { FileStatus } from '../../shared/file-upload/file-status.model';

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
        FileUploadModule,
        FunFactsLoadingBarModule
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should add subscription', () => {
      const spy = jest.spyOn(component['subscription'], 'add');
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('should reset fileStatus on reset Event', () => {
      component.fileStatus = new FileStatus('test', '', true);
      const sub = new Subject();
      Object.defineProperty(component['dataStore'], 'reset$', {
        value: sub
      });
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      sub.next(undefined);

      expect(component.fileStatus).toBeUndefined();
    });

    test('should not reset fileStatus if result has not been received yet', () => {
      const status = new FileStatus('test', '', undefined);
      component.fileStatus = status;
      const sub = new Subject();
      Object.defineProperty(component['dataStore'], 'reset$', {
        value: sub
      });
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      sub.next(undefined);

      expect(component.fileStatus).toEqual(status);
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component['subscription'].unsubscribe = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
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
