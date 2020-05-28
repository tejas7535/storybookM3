import { TestBed } from '@angular/core/testing';

import { select, Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';

import {
  loadAnswerForFile,
  loadAnswerForFileSuccess,
  storeFileInput,
  storeTextInput,
} from '../..';
import { QUESTION_ANSWERING_STATE_MOCK } from '../../../../../testing/mocks/question-answering/question-answering-values.mock';
import { FileStatus } from '../../../../shared/file-upload/file-status.model';
import { loadAnswerForText, loadAnswerForTextSuccess } from '../../actions';
import * as fromRoot from '../../reducers';
import { initialState } from '../../reducers/question-answering/question-answering.reducer';
import {
  getFileInputQuestionAnswering,
  getFileStatusQuestionAnswering,
  getQuestionAnsweringDataForFile,
  getQuestionAnsweringDataForText,
  getSelectedTabIndexQuestionAnswering,
  getTextInputQuestionAnswering,
} from './question-answering.selector';

describe('QuestionAnsweringSelector', () => {
  let store: Store<fromRoot.AppState>;
  let sub: any;
  let result: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {
            ...fromRoot.reducers,
          },
          {
            runtimeChecks: {
              strictStateSerializability: true,
              strictActionSerializability: true,
            },
          }
        ),
      ],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
    result = undefined;
  });

  afterEach(() => {
    if (sub) {
      sub.unsubscribe();
      sub = undefined;
    }
  });

  describe('getSelectedTabIndexQuestionAnswering', () => {
    beforeEach(() => {
      store
        .pipe(select(getSelectedTabIndexQuestionAnswering))
        .subscribe((value) => (result = value));
    });

    test('should return initial tabIndex', () => {
      expect(result).toEqual(initialState.selectedTabIndex);
    });
  });

  describe('getTextInputQuestionAnswering', () => {
    beforeEach(() => {
      store
        .pipe(select(getTextInputQuestionAnswering))
        .subscribe((value) => (result = value));
    });

    test('should return initial state textInput when state is not defined', () => {
      expect(result).toEqual(initialState.text.input);
    });

    test('should return text input', () => {
      const text = QUESTION_ANSWERING_STATE_MOCK.text.input.text;
      const textLang = QUESTION_ANSWERING_STATE_MOCK.text.input.textLang;
      store.dispatch(
        storeTextInput({
          text,
          textLang,
        })
      );

      const question = QUESTION_ANSWERING_STATE_MOCK.text.input.question;
      store.dispatch(
        loadAnswerForText({
          question,
        })
      );

      expect(result).toEqual(QUESTION_ANSWERING_STATE_MOCK.text.input);
    });
  });

  describe('getFileInputQuestionAnswering', () => {
    beforeEach(() => {
      store
        .pipe(select(getFileInputQuestionAnswering))
        .subscribe((value) => (result = value));
    });

    test('should return undefined fileInput when state is not defined', () => {
      expect(result).toBeUndefined();
    });

    test('should return file input', () => {
      const file = QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.file;
      store.dispatch(
        storeFileInput({
          file,
        })
      );

      const question = QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.question;
      store.dispatch(
        loadAnswerForFile({
          question,
        })
      );

      const answer =
        QUESTION_ANSWERING_STATE_MOCK.fileUpload.conversation[0].answer;
      const textInput =
        QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.textInput;
      store.dispatch(
        loadAnswerForFileSuccess({
          answer,
          textInput,
        })
      );
      expect(result).toEqual(QUESTION_ANSWERING_STATE_MOCK.fileUpload.input);
    });
  });

  describe('getFileStatusQuestionAnswering', () => {
    beforeEach(() => {
      store.pipe(select(getFileStatusQuestionAnswering)).subscribe((value) => {
        result = value;
      });
    });

    test('should return undefined fileInput when state is not defined', () => {
      expect(result).toBeUndefined();
    });

    test('should return fileStatus when loading (success = undefined)', () => {
      const file = QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.file;
      store.dispatch(
        storeFileInput({
          file,
        })
      );

      const expected: FileStatus = {
        fileName: file.name,
        fileType: file.type,
        success: undefined,
      };

      expect(result).toEqual(expected);
    });

    test('should return fileStatus when loading successful (success = true)', () => {
      const file = QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.file;
      store.dispatch(
        storeFileInput({
          file,
        })
      );

      const expected: FileStatus = {
        fileName: file.name,
        fileType: file.type,
        success: true,
      };

      const question = QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.question;
      store.dispatch(
        loadAnswerForFile({
          question,
        })
      );

      const answer =
        QUESTION_ANSWERING_STATE_MOCK.fileUpload.conversation[0].answer;
      const textInput =
        QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.textInput;

      store.dispatch(
        loadAnswerForFileSuccess({
          answer,
          textInput,
        })
      );

      expect(result).toEqual(expected);
    });
  });

  describe('getQuestionAnsweringDataForText', () => {
    beforeEach(() => {
      store
        .pipe(select(getQuestionAnsweringDataForText))
        .subscribe((value) => (result = value));
    });

    test('should return initial state text when state is not defined', () => {
      expect(result).toEqual(initialState.text);
    });

    test('should return text data', () => {
      const text = QUESTION_ANSWERING_STATE_MOCK.text.input.text;
      const textLang = QUESTION_ANSWERING_STATE_MOCK.text.input.textLang;
      store.dispatch(
        storeTextInput({
          text,
          textLang,
        })
      );

      const question = QUESTION_ANSWERING_STATE_MOCK.text.input.question;
      store.dispatch(
        loadAnswerForText({
          question,
        })
      );

      const answer = QUESTION_ANSWERING_STATE_MOCK.text.conversation[0].answer;
      store.dispatch(
        loadAnswerForTextSuccess({
          answer,
        })
      );

      expect(result).toEqual(QUESTION_ANSWERING_STATE_MOCK.text);
    });
  });

  describe('getQuestionAnsweringDataForFile', () => {
    beforeEach(() => {
      store
        .pipe(select(getQuestionAnsweringDataForFile))
        .subscribe((value) => (result = value));
    });

    test('should return initial state fileUpload when state is not defined', () => {
      expect(result).toEqual(initialState.fileUpload);
    });

    test('should return fileUpload data', () => {
      const file = QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.file;
      store.dispatch(
        storeFileInput({
          file,
        })
      );

      const question = QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.question;
      store.dispatch(
        loadAnswerForFile({
          question,
        })
      );

      const answer =
        QUESTION_ANSWERING_STATE_MOCK.fileUpload.conversation[0].answer;
      const textInput =
        QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.textInput;

      store.dispatch(
        loadAnswerForFileSuccess({
          answer,
          textInput,
        })
      );

      expect(result).toEqual(QUESTION_ANSWERING_STATE_MOCK.fileUpload);
    });
  });
});
