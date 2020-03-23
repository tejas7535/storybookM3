import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataService } from './data.service';

import { FileReplacement, Language } from '../models';

describe('DataService', () => {
  let service: DataService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  const basePath = 'https://sta-d.dev.dp.schaeffler/api/v1';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    service = injector.inject(DataService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('postTaggingText', () => {
    test('should return an Observable<string[]>', () => {
      const text = 'Get me some tags please.';
      const expectedTags = ['First', 'Tag', 'Artificial'];
      const url = `${basePath}/tagging/text`;

      service.postTaggingText(text).subscribe(tags => {
        expect(tags).toEqual(expectedTags);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush({ tags: expectedTags });
    });
  });

  describe('postTaggingFile', () => {
    test('should return an Observable<string[]>', async(() => {
      const fileReplacement: FileReplacement = {
        name: 'abc',
        type: 'xyz',
        content: []
      };
      const expectedFile = new File(
        [Int8Array.from(fileReplacement.content)],
        fileReplacement.name,
        {
          type: fileReplacement.type
        }
      );

      const expectedTags = ['First', 'Tag', 'Artificial'];
      const url = `${basePath}/tagging/file`;
      const form = new FormData();
      form.append('file', expectedFile, expectedFile.name);

      service.postTaggingFile(fileReplacement).subscribe(tags => {
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
      const targetLang = Language.EN;
      const textLang = Language.DE;
      const url = `${basePath}/translation/text`;

      service.postTranslationText(text, targetLang, textLang).then(trans => {
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
      const url = `${basePath}/translation/file`;
      const targetLang = Language.EN;
      const textLang = Language.DE;

      service.postTranslationFile(file, targetLang, textLang).then(trans => {
        expect(trans).toEqual(expectedTranslation);
      });

      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('targetLang', targetLang);
      formData.append('textLang', textLang);

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);

      req.flush({ translation: expectedTranslation });
    }));
  });

  describe('postLanguageDetectionText', () => {
    test('should return response correctly as promise', done => {
      const text = 'Was für eine Sprache bin ich?';
      const url = `${basePath}/language-detection/text`;
      const expectedLang = 'de';
      const userLang = Language.DE;

      service
        .postLanguageDetectionText(text, userLang)
        .subscribe(detectedLang => {
          expect(detectedLang.textLang).toEqual(expectedLang);
          done();
        });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush({ textLang: expectedLang });
    });
  });

  describe('postLanguageDetectionFile', () => {
    test('should return response correctly as promise', done => {
      const file = new File([], 'test');
      const url = `${basePath}/language-detection/file`;
      const expectedLang = 'de';
      const userLang = Language.DE;

      service
        .postLanguageDetectionFile(file, userLang)
        .subscribe(detectedLang => {
          expect(detectedLang.textLang).toEqual(expectedLang);
          done();
        });

      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('userLang', userLang);

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);
      req.flush({ textLang: expectedLang });
    });
  });
});
