import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { APP_STATE_MOCK } from '../../../testing/mocks/shared/app-state.mock';
import {
  AppState,
  setLoadingForFileInput,
  setSelectedTabIndexQuestionAnswering,
  storeFileInput,
  storeTextInput,
} from '../../core/store';
import { Answer } from '../../core/store/reducers/question-answering/models/answer.model';
import { FileUploadModule } from '../../shared/file-upload/file-upload.module';
import {
  FileReplacement,
  Language,
  TextInput,
} from '../../shared/result/models';
import { TextInputModule } from '../../shared/text-input/text-input.module';
import { QuestionAnsweringComponent } from './question-answering.component';

describe('QuestionAnsweringComponent', () => {
  let component: QuestionAnsweringComponent;
  let fixture: ComponentFixture<QuestionAnsweringComponent>;
  let store: Store<AppState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionAnsweringComponent],
      imports: [
        NoopAnimationsModule,
        FlexLayoutModule,
        MatTabsModule,
        TextInputModule,
        FileUploadModule,
        HttpClientTestingModule,
        provideTranslocoTestingModule({}),
      ],
      providers: [provideMockStore({ initialState: APP_STATE_MOCK })],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnsweringComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should call setObservables', () => {
      const mock = (component['setObservables'] = jest.fn());

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(mock).toHaveBeenCalledTimes(1);
      expect(component.subscription).toBeDefined();
      expect(component.questionAndAnsweringDataForFile$).toBeDefined();
    });
  });

  describe('setObservables', () => {
    test('should define observables', () => {
      component['setObservables']();

      expect(component.selectedTabIndex$).toBeDefined();
      expect(component.fileStatus$).toBeDefined();
      expect(component.textInput$).toBeDefined();
      expect(component.questionAndAnsweringDataForFile$).toBeDefined();
    });
  });

  describe('updateQuestionAnsweringData', () => {
    test('should set fileTextInput and fileAnswer', () => {
      component.fileTextInput = undefined;
      component.fileAnswer = undefined;

      component.updateQuestionAnsweringData(
        APP_STATE_MOCK.questionAnswering.fileUpload
      );

      expect(component.fileTextInput).toEqual(
        APP_STATE_MOCK.questionAnswering.fileUpload.input.textInput
      );
      expect(component.fileAnswer).toEqual(
        APP_STATE_MOCK.questionAnswering.fileUpload.conversation[
          APP_STATE_MOCK.questionAnswering.fileUpload.conversation.length - 1
        ].answer
      );
    });

    test('should not update when fileStoreData == undefined', () => {
      component.fileTextInput = undefined;
      component.fileAnswer = undefined;

      component.updateQuestionAnsweringData(undefined);
      expect(component.fileTextInput).toBeUndefined();
      expect(component.fileAnswer).toBeUndefined();
    });

    test('should not update when fileStoreData.input == undefined', () => {
      component.fileTextInput = undefined;
      component.fileAnswer = undefined;

      const fileUpload = Object.create(
        APP_STATE_MOCK.questionAnswering.fileUpload
      );
      fileUpload.input = undefined;

      component.updateQuestionAnsweringData(fileUpload);
      expect(component.fileTextInput).toBeUndefined();
      expect(component.fileAnswer).toBeUndefined();
    });

    test('should not update when fileStoreData.conversation == undefined', () => {
      component.fileTextInput = undefined;
      component.fileAnswer = undefined;

      const fileUpload = Object.create(
        APP_STATE_MOCK.questionAnswering.fileUpload
      );
      fileUpload.conversation = undefined;

      component.updateQuestionAnsweringData(fileUpload);
      expect(component.fileTextInput).toBeUndefined();
      expect(component.fileAnswer).toBeUndefined();
    });

    test('should not update when fileStoreData.conversation.length <= 0', () => {
      component.fileTextInput = undefined;
      component.fileAnswer = undefined;

      const fileUpload = Object.create(
        APP_STATE_MOCK.questionAnswering.fileUpload
      );
      fileUpload.conversation = [];

      component.updateQuestionAnsweringData(fileUpload);
      expect(component.fileTextInput).toBeUndefined();
      expect(component.fileAnswer).toBeUndefined();
    });

    test('should not update when fileStoreData.input.textInput == undefined', () => {
      component.fileTextInput = undefined;
      component.fileAnswer = undefined;

      const fileUpload = Object.create(
        APP_STATE_MOCK.questionAnswering.fileUpload
      );
      fileUpload.input.textInput = undefined;

      component.updateQuestionAnsweringData(fileUpload);
      expect(component.fileTextInput).toBeUndefined();
      expect(component.fileAnswer).toBeUndefined();
    });

    test('should replace special characters in textInput', () => {
      component.fileTextInput = undefined;
      component.fileAnswer = undefined;

      const fileUpload = Object.create(
        APP_STATE_MOCK.questionAnswering.fileUpload
      );
      fileUpload.input.textInput =
        'First line of text.\nSecond line of text.\rthird line.\n\rouh multiple ones.';
      const expected =
        'First line of text. Second line of text. third line. ouh multiple ones.';

      component.updateQuestionAnsweringData(fileUpload);
      expect(component.fileTextInput).toEqual(expected);
    });
  });

  describe('setSelectedTabIndex', () => {
    test('should dispatch setSelectedTabIndexQuestionAnswering action', () => {
      store.dispatch = jest.fn();
      const tabIndex = 1;

      component.setSelectedTabIndex(tabIndex);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        setSelectedTabIndexQuestionAnswering({ selectedTabIndex: tabIndex })
      );
    });
  });

  describe('storeFile', () => {
    test('should dispatch StoreFileInput action', async () => {
      store.dispatch = jest.fn();
      const file = new File(['moin'], 'file', { type: 'abc' });

      await component.storeFile(file);

      const expected: FileReplacement = {
        name: file.name,
        type: file.type,
        content: [109, 111, 105, 110],
      };
      expect(store.dispatch).toHaveBeenCalledTimes(3);
      expect(store.dispatch).toHaveBeenCalledWith(
        setLoadingForFileInput({ loading: true })
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        storeFileInput({ file: expected })
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        setLoadingForFileInput({ loading: false })
      );
    });
  });

  describe('storeTextInput', () => {
    test('should dispatch storeTextInput action', () => {
      store.dispatch = jest.fn();

      const textInput: TextInput = {
        text: 'text',
        textLang: Language.DE,
      };

      component.storeTextInput(textInput);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        storeTextInput({ text: textInput.text, textLang: textInput.textLang })
      );
    });

    test('should call storeTextInput with default textLang Language.EN', () => {
      store.dispatch = jest.fn();

      const textInput: TextInput = {
        text: 'text',
      };

      component.storeTextInput(textInput);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        storeTextInput({ text: textInput.text, textLang: Language.EN })
      );
    });
  });

  describe('getFileAnswerTextBeforeAnswer', () => {
    test('should return 40 words before answer', () => {
      const textInput =
        '0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41';
      component.fileTextInput = textInput;

      const answer: Answer = {
        answer: 'abc',
        exactMatch: 'abc',
        logit: 7,
        paragraphStart: 41,
        paragraphEnd: 41,
      };
      component.fileAnswer = answer;

      const expected =
        '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40';
      expect(component.getFileAnswerTextBeforeAnswer()).toEqual(expected);
    });

    test('should return all words before paragraphStart when paragraphStart - 40 < 0', () => {
      const textInput =
        '0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30';
      component.fileTextInput = textInput;

      const answer: Answer = {
        answer: 'abc',
        exactMatch: 'abc',
        logit: 7,
        paragraphStart: 30,
        paragraphEnd: 30,
      };
      component.fileAnswer = answer;

      const expected =
        '0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29';
      expect(component.getFileAnswerTextBeforeAnswer()).toEqual(expected);
    });
  });

  describe('getHighlightedAnswer', () => {
    test('should return highlighted words', () => {
      const textInput = '0 1 2 3 4 5 6 7 8 9 10 11 12';
      component.fileTextInput = textInput;

      const answer: Answer = {
        answer: 'abc',
        exactMatch: 'abc',
        logit: 7,
        paragraphStart: 5,
        paragraphEnd: 10,
      };
      component.fileAnswer = answer;

      const expected = '5 6 7 8 9 10';
      expect(component.getHighlightedAnswer()).toEqual(expected);
    });
  });

  describe('getFileAnswerTextAfterAnswer', () => {
    test('should return 40 words after answer', () => {
      const textInput =
        '0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41';
      component.fileTextInput = textInput;

      const answer: Answer = {
        answer: 'abc',
        exactMatch: 'abc',
        logit: 7,
        paragraphStart: 0,
        paragraphEnd: 0,
      };
      component.fileAnswer = answer;

      const expected =
        '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40';
      expect(component.getFileAnswerTextAfterAnswer()).toEqual(expected);
    });

    test('should return all words after paragraphEnd when paragraphEnd + 40 > wordsInText.length - 1', () => {
      const textInput =
        '0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30';
      component.fileTextInput = textInput;

      const answer: Answer = {
        answer: 'abc',
        exactMatch: 'abc',
        logit: 7,
        paragraphStart: 0,
        paragraphEnd: 0,
      };
      component.fileAnswer = answer;

      const expected =
        '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30';
      expect(component.getFileAnswerTextAfterAnswer()).toEqual(expected);
    });
  });
});
