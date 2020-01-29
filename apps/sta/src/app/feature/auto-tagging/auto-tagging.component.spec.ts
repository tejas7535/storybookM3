import { Subject } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { FileUploadModule } from '../../shared/file-upload/file-upload.module';
import { TextInputModule } from '../../shared/text-input/text-input.module';

import { AutoTaggingComponent } from './auto-tagging.component';

import { FileStatus } from '../../shared/file-upload/file-status.model';

describe('AutoTaggingComponent', () => {
  let component: AutoTaggingComponent;
  let fixture: ComponentFixture<AutoTaggingComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatTabsModule,
        TextInputModule,
        FileUploadModule
      ],
      declarations: [AutoTaggingComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoTaggingComponent);
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

  describe('getTagsForText', () => {
    test('should call getTagsForText', () => {
      component['dataStore'].getTagsForText = jest.fn();
      const text = 'text';

      component.getTagsForText(text);

      expect(component['dataStore'].getTagsForText).toHaveBeenCalledWith(text);
    });
  });

  describe('getTagsForFile', () => {
    test('should call getTagsFromFile', () => {
      component['dataStore'].getTagsForFile = jest.fn();
      const file = new File([], 'file');

      component.getTagsForFile(file);

      expect(component['dataStore'].getTagsForFile).toHaveBeenCalledWith(file);
    });
  });
});
