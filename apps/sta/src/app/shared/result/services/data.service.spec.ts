import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { environment } from '../../../../environments/environment';
import { Answer } from '../../../core/store/reducers/question-answering/models/answer.model';
import { QuestionAnsweringFileInput } from '../../../core/store/reducers/question-answering/models/question-answering-file-input.model';
import { QuestionAnsweringTextInput } from '../../../core/store/reducers/question-answering/models/question-answering-text-input.model';
import { TranslationFileInput } from '../../../core/store/reducers/translation/models/translation-file-input.model';
import {
  Classification,
  FileReplacement,
  Language,
  TextInput,
  Translation,
} from '../models';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService],
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
    test('should return an Observable<string[]>', (done) => {
      const text = 'Get me some tags please.';
      const expectedTags = ['First', 'Tag', 'Artificial'];
      const url = `${environment.apiBaseUrl}/tagging/text`;

      service.postTaggingText(text).subscribe((tags) => {
        expect(tags).toEqual(expectedTags);
        done();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush({ tags: expectedTags });
    });
  });

  describe('postTaggingFile', () => {
    test('should return an Observable<string[]>', (done) => {
      const fileReplacement: FileReplacement = {
        name: 'abc',
        type: 'xyz',
        content: [],
      };
      const expectedFile = new File(
        [Int8Array.from(fileReplacement.content)],
        fileReplacement.name,
        {
          type: fileReplacement.type,
        }
      );

      const expectedTags = ['First', 'Tag', 'Artificial'];
      const url = `${environment.apiBaseUrl}/tagging/file`;
      const form = new FormData();
      form.append('file', expectedFile, expectedFile.name);

      service.postTaggingFile(fileReplacement).subscribe((tags) => {
        expect(tags).toEqual(expectedTags);
        done();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(form);
      req.flush({ tags: expectedTags });
    });
  });

  describe('postTranslationText', () => {
    test('should return response as observable', (done) => {
      const text = 'Bitte einmal übersetzen.';
      const expectedTranslation = 'Please translate once.';
      const targetLang = Language.EN;
      const textLang = Language.DE;
      const url = `${environment.apiBaseUrl}/translation/text`;

      const textInput: TextInput = {
        text,
        targetLang,
        textLang,
      };

      service.postTranslationText(textInput).subscribe((trans) => {
        const expectedTrans: Translation = { translation: expectedTranslation };
        expect(trans).toEqual(expectedTrans);
        done();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush({ translation: expectedTranslation });
    });

    test('should set default values for textLang and targetLang', () => {
      jest.spyOn(service['http'], 'post');
      const text = 'Bitte einmal übersetzen.';
      const expectedTranslation = 'Please translate once.';
      const defaultTargetLang = Language.DE;
      const defaultTextLang = Language.EN;
      const url = `${environment.apiBaseUrl}/translation/text`;

      const textInput: TextInput = {
        text,
      };

      const expectedInput: TextInput = {
        text,
        textLang: defaultTextLang,
        targetLang: defaultTargetLang,
      };

      service.postTranslationText(textInput).subscribe((_trans) => {
        expect(service['http'].post).toHaveBeenCalledTimes(1);
        expect(service['http'].post).toHaveBeenCalledWith(url, expectedInput);
      });

      const req = httpMock.expectOne(url);
      req.flush({ translation: expectedTranslation });
    });
  });

  describe('postTranslationFile', () => {
    test('should return response as observable', (done) => {
      const expectedTranslation = 'Please translate once.';
      const url = `${environment.apiBaseUrl}/translation/file`;
      const targetLang = Language.EN;
      const textLang = Language.DE;

      const fileReplacement: FileReplacement = {
        name: 'abc',
        type: 'xyz',
        content: [],
      };

      const expectedFile = new File(
        [Int8Array.from(fileReplacement.content)],
        fileReplacement.name,
        {
          type: fileReplacement.type,
        }
      );

      const input: TranslationFileInput = {
        targetLang,
        textLang,
        file: fileReplacement,
      };

      service.postTranslationFile(input).subscribe((trans) => {
        const expectedTrans: Translation = { translation: expectedTranslation };
        expect(trans).toEqual(expectedTrans);
        done();
      });

      const formData = new FormData();
      formData.append('file', expectedFile, expectedFile.name);
      formData.append('targetLang', targetLang);
      formData.append('textLang', textLang);

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);

      req.flush({ translation: expectedTranslation });
    });

    test('should set default values for textLang and targetLang', () => {
      jest.spyOn(service['http'], 'post');
      const url = `${environment.apiBaseUrl}/translation/file`;
      const expectedTranslation = 'Please translate once.';
      const defaultTargetLang = Language.DE;
      const defaultTextLang = Language.EN;

      const fileReplacement: FileReplacement = {
        name: 'abc',
        type: 'xyz',
        content: [],
      };

      const input: TranslationFileInput = {
        file: fileReplacement,
      };

      const expectedInput: TranslationFileInput = {
        file: fileReplacement,
        targetLang: defaultTargetLang,
        textLang: defaultTextLang,
      };

      service.postTranslationFile(input).subscribe((_trans) => {
        expect(service['http'].post).toHaveBeenCalledTimes(1);
        expect(service['http'].post).toHaveBeenCalledWith(url, expectedInput);
      });
      const req = httpMock.expectOne(url);
      req.flush({ translation: expectedTranslation });
    });
  });

  describe('postLanguageDetectionText', () => {
    test('should return response correctly as observable', (done) => {
      const text = 'Was für eine Sprache bin ich?';
      const url = `${environment.apiBaseUrl}/language-detection/text`;
      const expectedLang = 'de';
      const userLang = Language.DE;

      service
        .postLanguageDetectionText(text, userLang)
        .subscribe((detectedLang) => {
          expect(detectedLang.textLang).toEqual(expectedLang);
          done();
        });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush({ textLang: expectedLang });
    });
  });

  describe('postLanguageDetectionFile', () => {
    test('should return response correctly as observable', (done) => {
      const file = new File([], 'test');
      const url = `${environment.apiBaseUrl}/language-detection/file`;
      const expectedLang = 'de';
      const userLang = Language.DE;

      service
        .postLanguageDetectionFile(file, userLang)
        .subscribe((detectedLang) => {
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

  describe('postLanguageDetectionFile', () => {
    test('should return response correctly as observable', (done) => {
      const textInput: QuestionAnsweringTextInput = {
        question: 'abc',
        text: 'abc',
        textLang: Language.EN,
      };

      const url = `${environment.apiBaseUrl}/question-answering/text`;

      const expectedAnswer: Answer = {
        answer: 'ja moin',
        exactMatch: 'Genaues moinsen',
        logit: 1,
        paragraphEnd: 1,
        paragraphStart: 0,
      };

      service.postQuestionAnsweringText(textInput).subscribe((answer) => {
        expect(answer).toEqual(expectedAnswer);
        done();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(expectedAnswer);
    });
  });

  describe('postQuestionAnsweringFile', () => {
    test('should return response as observable', (done) => {
      const fileInput: QuestionAnsweringFileInput = {
        file: {
          content: [0, 1, 2],
          name: 'servus',
          type: 'superfile',
        },
        question: 'Was sagt der Tacho?',
      };

      const url = `${environment.apiBaseUrl}/question-answering/file`;

      const expectedFile = new File(
        [Int8Array.from(fileInput.file.content)],
        fileInput.file.name,
        {
          type: fileInput.file.type,
        }
      );

      const expectedAnswer: Answer = {
        answer: 'ja moin',
        exactMatch: 'Genaues moinsen',
        logit: 1,
        paragraphEnd: 1,
        paragraphStart: 0,
      };

      service.postQuestionAnsweringFile(fileInput).subscribe((answer) => {
        expect(answer).toEqual(expectedAnswer);
        done();
      });

      const formData = new FormData();
      formData.append('file', expectedFile, expectedFile.name);
      formData.append('question', fileInput.question);

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData);

      req.flush(expectedAnswer);
    });
  });

  describe('postClassificationTextText', () => {
    test('should return an Observable<Classification>', (done) => {
      const text: TextInput = { text: 'Heya I wanna send something to ya!' };
      const expectedClassification: Classification = {
        categories: [[1]],
        probabilities: [[0.5]],
      };
      const url = `${environment.apiBaseUrl}/dreidmaster/text`;

      service.postClassificationText(text).subscribe((classification) => {
        expect(classification).toEqual(expectedClassification);
        done();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(expectedClassification);
    });
  });
});
