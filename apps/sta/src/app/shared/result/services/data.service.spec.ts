import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    service = injector.get(DataService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('postTaggingText', () => {
    test('should return response as promise', async(() => {
      const text = 'Get me some tags please.';
      const expectedTags = ['First', 'Tag', 'Artificial'];
      const url = 'https://dev.sta.dp.schaeffler/api/v1/tagging/text';

      service.postTaggingText(text).then(tags => {
        expect(tags).toEqual(expectedTags);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush({ tags: expectedTags });
    }));
  });

  describe('postTaggingFile', () => {
    test('should return response as promise', async(() => {
      const file = new File([], 'test');
      const expectedTags = ['First', 'Tag', 'Artificial'];
      const url = 'https://dev.sta.dp.schaeffler/api/v1/tagging/file';
      const form = new FormData();
      form.append('file', file, file.name);

      service.postTaggingFile(file).then(tags => {
        expect(tags).toEqual(expectedTags);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(form);
      req.flush({ tags: expectedTags });
    }));
  });

  describe('postTranslationText', () => {
    test('should return response as promise', async(() => {
      const text = 'Bitte einmal übersetzen.';
      const expectedTranslation = 'Please translate once.';
      const targetLang = 'en';
      const url = 'https://dev.sta.dp.schaeffler/api/v1/translation/text';

      service.postTranslationText(text, targetLang).then(trans => {
        expect(trans).toEqual(expectedTranslation);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush({ translation: expectedTranslation });
    }));
  });

  describe('postTranslationFile', () => {
    test('should return response as promise', async(() => {
      const file = new File([], 'test');
      const expectedTranslation = 'Please translate once.';
      const url = 'https://dev.sta.dp.schaeffler/api/v1/translation/file';
      const targetLang = 'en';

      service.postTranslationFile(file, targetLang).then(trans => {
        expect(trans).toEqual(expectedTranslation);
      });

      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('targetLang', targetLang);

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);

      req.flush({ translation: expectedTranslation });
    }));
  });
});
