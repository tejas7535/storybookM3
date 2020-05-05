import { BehaviorSubject, EMPTY, Observable, of, throwError } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { configureTestSuite } from 'ng-bullet';

import { LanguageDetectionModule } from '../language-detection/language-detection.module';

import { TextInputComponent } from './text-input.component';

import { KeyValue, Language, TextInput } from '../result/models';

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LanguageDetectionModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        provideTranslocoTestingModule({}),
      ],
      declarations: [TextInputComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('identifyAvailableLanguages', () => {
    test('should return avl languages in en when userLang == en', () => {
      const expected = [
        new KeyValue('de', 'German'),
        new KeyValue('en', 'English'),
      ];

      const langs = TextInputComponent['identifyAvailableLanguages']('en');

      expect(langs).toEqual(expected);
    });

    test('should return avl languages in de when userLang == de', () => {
      const expected = [
        new KeyValue('de', 'Deutsch'),
        new KeyValue('en', 'Englisch'),
      ];

      const langs = TextInputComponent['identifyAvailableLanguages']('de');

      expect(langs).toEqual(expected);
    });

    test('should return empty array when userLang not supported', () => {
      const expected: KeyValue[] = [];

      const langs = TextInputComponent['identifyAvailableLanguages'](
        'es' as Language
      );

      expect(langs).toEqual(expected);
    });
  });

  describe('ngOnInit', () => {
    test('should initialize form and get avl languages', () => {
      const userLang = 'en';
      const langs = [new KeyValue('key', 'val')];
      component['languageService'].getActiveLang = jest.fn(() => userLang);
      component['initForm'] = jest.fn();
      TextInputComponent['identifyAvailableLanguages'] = jest.fn(() => langs);

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['initForm']).toHaveBeenCalledTimes(1);
      expect(component['languageService'].getActiveLang).toHaveBeenCalledTimes(
        1
      );
      expect(component.avlLanguages).toEqual(langs);
    });

    test('should initialize subscriptions and handle detected language changes', () => {
      component['handleLanguageDetectionChange'] = jest.fn();
      const testVal = 'test';

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      component.detectedLanguage.setValue(testVal);

      fixture.detectChanges();

      expect(component['handleLanguageDetectionChange']).toHaveBeenCalledWith(
        testVal
      );
    });

    test('should initialize subscriptions and handle text input changes', () => {
      const resp = {
        textLang: 'en',
        displayName: 'Englisch',
        supported: true,
      };
      component['validateTextInput'] = jest.fn(() => () => of(resp));
      component['handleTextInput'] = jest.fn();
      const testVal = 'test';

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      component.text.setValue(testVal);

      fixture.detectChanges();

      expect(component['validateTextInput']).toHaveBeenCalledTimes(1);
      expect(component['handleTextInput']).toHaveBeenCalledWith(resp);
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe from subscription', () => {
      const spy = jest.spyOn(component['subscription'], 'unsubscribe');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('get text', () => {
    test('should return correct control', () => {
      const control = component.text;

      expect(control).toEqual(component.textFormGroup.controls['text']);
    });
  });

  describe('get detectedLanguage', () => {
    test('should return correct control', () => {
      const control = component.detectedLanguage;

      expect(control).toEqual(
        component.textFormGroup.controls['detectedLanguage']
      );
    });
  });

  describe('get targetLanguage', () => {
    test('should return correct control', () => {
      const control = component.targetLanguage;

      expect(control).toEqual(
        component.textFormGroup.controls['targetLanguage']
      );
    });
  });

  describe('btnClick', () => {
    test('should emit TextInput', () => {
      const testText = 'testText';
      const testDetectedLang = 'en' as Language;
      const testTargetLang = 'de' as Language;
      component.textFormGroup.get('text').setValue(testText);
      component.textFormGroup
        .get('detectedLanguage')
        .setValue(testDetectedLang);
      component.textFormGroup.get('targetLanguage').setValue(testTargetLang);

      component.btnClicked.emit = jest.fn();

      component.btnClick();

      expect(component.btnClicked.emit).toHaveBeenCalledWith(
        new TextInput(testText, testTargetLang, testDetectedLang)
      );
    });
  });

  describe('initForm', () => {
    test('should initialize form', () => {
      component['initForm']();

      expect(component.textFormGroup).toBeDefined();
      expect(component.textFormGroup.get('text')).toBeDefined();
      expect(component.textFormGroup.get('detectedLanguage')).toBeDefined();
      expect(component.textFormGroup.get('targetLanguage')).toBeDefined();
      expect(component.textFormGroup.get('text').value).toEqual(
        component.defaultText
      );
    });

    test('should not add validator to targetLanguage control when target language should be hidden', () => {
      component.showTargetLanguage = false;
      component.targetLanguage.reset();

      component['initForm']();

      expect(component.textFormGroup.get('targetLanguage').valid).toBeTruthy();
    });
  });

  describe('validateTextInput', () => {
    let observable: Observable<string>;
    let subject: BehaviorSubject<string>;

    beforeEach(() => {
      subject = new BehaviorSubject('test');
      observable = subject.asObservable();
      component['setTextInputError'] = jest.fn();
    });

    test('should return detected language initially', (done) => {
      const userLang = 'de';
      const resp = {
        textLang: 'en',
        displayName: 'Englisch',
        supported: true,
      };
      component['dataService'].postLanguageDetectionText = jest.fn(() =>
        of(resp)
      );

      component.defaultText =
        'Das ist ein Standardtext - nicht mehr und nicht weniger.';

      observable
        .pipe(component['validateTextInput'](userLang))
        .subscribe((val) => {
          expect(val).toEqual(resp);
          done();
        });
    });

    test('should return detected language after text change', (done) => {
      const userLang = 'de';
      const resp = {
        textLang: 'en',
        displayName: 'Englisch',
        supported: true,
      };
      component['dataService'].postLanguageDetectionText = jest.fn(() =>
        of(resp)
      );

      observable
        .pipe(component['validateTextInput'](userLang))
        .subscribe((val) => {
          expect(val).toEqual(resp);
          done();
        });

      subject.next('This should also lead to a new language detection');
    });

    test('should not validate on changes when text is smaller than min length', async(() => {
      const userLang = 'de';
      const resp = {
        textLang: 'en',
        displayName: 'Englisch',
        supported: true,
      };
      component['dataService'].postLanguageDetectionText = jest.fn(() =>
        of(resp)
      );
      component.minLength = 10;

      observable
        .pipe(component['validateTextInput'](userLang))
        .subscribe(() => {
          // should not come here
          expect(true).toBeFalsy();
        });

      subject.next('too short');
      expect(component.disableSubmit).toBeTruthy();
    }));

    test('should set text input error when detected lang not supported', (done) => {
      const userLang = 'de';
      const resp = {
        textLang: 'es',
        displayName: 'Spanish',
        supported: false,
      };
      component['dataService'].postLanguageDetectionText = jest.fn(() =>
        of(resp)
      );
      component.defaultText =
        'Das ist ein Standardtext - nicht mehr und nicht weniger.';

      observable
        .pipe(component['validateTextInput'](userLang))
        .subscribe((val) => {
          expect(val).toEqual(resp);
          expect(component['setTextInputError']).toHaveBeenCalledTimes(1);
          expect(component.disableSubmit).toBeFalsy();
          done();
        });

      subject.next('Hasta pronto muchacho.');
    });

    test('should call error handler on REST error', async(() => {
      const userLang = 'de';

      component['dataService'].postLanguageDetectionText = jest.fn(() => {
        return throwError('This is an error!');
      });
      component['handlePostLanguageDetectionTextError'] = jest.fn(() => EMPTY);
      component.defaultText =
        'Das ist ein Standardtext - nicht mehr und nicht weniger.';

      observable
        .pipe(component['validateTextInput'](userLang))
        .subscribe(() => {
          // should not come here
          expect(true).toBeFalsy();
        });

      subject.next('absdasdasdsadegfd.');

      expect(
        component['handlePostLanguageDetectionTextError']
      ).toHaveBeenLastCalledWith('This is an error!');
    }));
  });

  describe('handleTextInput', () => {
    test('should set detected language and call setSupportedLanguages', () => {
      component['setSupportedLanguages'] = jest.fn();
      const resp = {
        textLang: 'en',
        displayName: 'English',
        supported: true,
      };

      component['handleTextInput'](resp);

      expect(component.detectedLanguage.value).toEqual(resp.textLang);
      expect(component['setSupportedLanguages']).toHaveBeenCalledWith(resp);
    });
  });

  describe('setTextInputError', () => {
    test('should set error and mark as touched if set', () => {
      component.text.markAsTouched = jest.fn();
      const testError = { test: true };

      component['setTextInputError'](testError, true);

      expect(component.text.errors.test).toBeTruthy();
      expect(component.text.markAsTouched).toHaveBeenCalledTimes(1);
    });

    test('should set error and not mark as touched if not set', () => {
      component.text.markAsTouched = jest.fn();
      const testError = { test: true };

      component['setTextInputError'](testError, false);

      expect(component.text.errors.test).toBeTruthy();
      expect(component.text.markAsTouched).not.toHaveBeenCalled();
    });
  });

  describe('handlePostLanguageDetectionTextError', () => {
    test('should reset detected lang, set input error and reset supported langs', () => {
      const error = 'Request failed';
      component['setTextInputError'] = jest.fn();
      component.detectedLanguage.reset = jest.fn();
      component['setSupportedLanguages'] = jest.fn();

      const result = component['handlePostLanguageDetectionTextError'](error);

      expect(result).toEqual(EMPTY);
      expect(component['setTextInputError']).toHaveBeenCalledWith(
        { apiError: true },
        true
      );
      expect(component.detectedLanguage.reset).toHaveBeenCalledTimes(1);
      expect(component['setSupportedLanguages']).toHaveBeenCalledTimes(1);
      expect(component.apiErrorMessage).toEqual(error);
    });
  });

  describe('handleLanguageDetectionChange', () => {
    beforeEach(() => {
      const langs = [
        new KeyValue('de', 'Deutsch'),
        new KeyValue('en', 'Englisch'),
      ];
      component.avlLanguages = langs;
    });

    test('should set target language if detected lang is allowed', () => {
      component.textFormGroup.value['detectedLanguage'] = 'de';
      component.targetLanguage.setValue = jest.fn();

      component['handleLanguageDetectionChange']('en');

      expect(component.targetLanguage.setValue).toHaveBeenCalledWith('de');
    });

    test('should set invalidLang error when new val is not supported', () => {
      component.textFormGroup.value['detectedLanguage'] = 'de';
      component['setTextInputError'] = jest.fn();

      component['handleLanguageDetectionChange']('es');

      expect(component['setTextInputError']).toHaveBeenCalled();
    });

    test('should reset text input error when error has been set and new val is supported', () => {
      component.text.setErrors({ invalidLang: true });
      component['setTextInputError'] = jest.fn();

      component['handleLanguageDetectionChange']('de');

      fixture.detectChanges();

      expect(component['setTextInputError']).toHaveBeenCalledWith(undefined);
    });

    test('should remove error when user manually selects supported language', () => {
      component.text.setErrors({ apiError: true });
      component.textFormGroup.value['detectedLanguage'] = undefined;
      component['setTextInputError'] = jest.fn();

      component['handleLanguageDetectionChange']('de');

      expect(component['setTextInputError']).toHaveBeenCalledWith(undefined);
    });

    test('do nothing when val is undefined', () => {
      component['setTextInputError'] = jest.fn();

      component['handleLanguageDetectionChange'](undefined);

      expect(component.text.value).toEqual('');
      expect(component['setTextInputError']).not.toHaveBeenCalled();
    });
  });

  describe('setSupportedLanguages', () => {
    test('should return avl languages if no param provided', () => {
      const langs = [
        new KeyValue('de', 'Deutsch'),
        new KeyValue('en', 'Englisch'),
      ];
      component.avlLanguages = langs;

      component['setSupportedLanguages']();

      expect(component.supportedLanguages).toEqual(langs);
    });

    test('should return avl languages if detected lang is supported', () => {
      const langs = [
        new KeyValue('de', 'Deutsch'),
        new KeyValue('en', 'Englisch'),
      ];
      const resp = {
        textLang: 'en',
        displayName: 'English',
        supported: true,
      };
      component.avlLanguages = langs;

      component['setSupportedLanguages'](resp);

      expect(component.supportedLanguages).toEqual(langs);
    });

    test('should return avl languages + detected lang if detected lang is not supported', () => {
      const langs = [
        new KeyValue('de', 'Deutsch'),
        new KeyValue('en', 'Englisch'),
      ];
      const resp = {
        textLang: 'es',
        displayName: 'Spanish',
        supported: false,
      };
      component.avlLanguages = langs;

      component['setSupportedLanguages'](resp);

      expect(component.supportedLanguages).toEqual([
        new KeyValue('es', 'Spanish'),
        ...langs,
      ]);
    });
  });
  // tslint:disable-next-line: max-file-line-count
});
