import { TestBed } from '@angular/core/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { APP_STATE_MOCK } from '../../../../../testing/mocks/shared/app-state.mock';
import { DataService } from '../../../../shared/result/services/data.service';
import {
  loadAnswerForFile,
  loadAnswerForFileFailure,
  loadAnswerForFileSuccess,
  loadAnswerForText,
  loadAnswerForTextFailure,
  loadAnswerForTextSuccess,
  resetAll,
  resetQuestionAnswering,
} from '../../actions';
import { QuestionAnsweringEffects } from './question-answering.effects';

describe('QuestionAnsweringEffects', () => {
  let action: any;
  let actions$: any;
  let store: any;
  let effects: QuestionAnsweringEffects;
  let dataService: DataService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        QuestionAnsweringEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: APP_STATE_MOCK }),
        {
          provide: DataService,
          useValue: {
            postTranslationText: jest.fn(),
            postTranslationFile: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(Store);
    effects = TestBed.inject(QuestionAnsweringEffects);
    dataService = TestBed.inject(DataService);
  });

  describe('loadAnswerText$', () => {
    beforeEach(() => {
      action = loadAnswerForText({
        question: APP_STATE_MOCK.questionAnswering.text.input.question,
      });
    });

    test('should return loadAnswerForTextSuccess action with answer', () => {
      effects.getRandomInt = jest
        .fn()
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(0);

      const result = loadAnswerForTextSuccess({
        answer: APP_STATE_MOCK.questionAnswering.text.conversation[0].answer,
      });

      actions$ = hot('-a', { a: action });

      const responseMock = JSON.parse(
        JSON.stringify(
          APP_STATE_MOCK.questionAnswering.text.conversation[0].answer
        )
      );
      delete responseMock.confidenceAnswerIndex;
      delete responseMock.reengagementMessageIndex;

      const response = cold('-a|', {
        a: responseMock,
      });
      const expected = cold('--b', { b: result });

      dataService.postQuestionAnsweringText = jest.fn(() => response);

      expect(effects.loadAnswerText$).toBeObservable(expected);
      expect(dataService.postQuestionAnsweringText).toHaveBeenCalledTimes(1);
      expect(dataService.postQuestionAnsweringText).toHaveBeenCalledWith(
        APP_STATE_MOCK.questionAnswering.text.input
      );
      expect(effects.getRandomInt).toHaveBeenCalledTimes(2);
      expect(effects.getRandomInt).toHaveBeenCalledWith(4);
    });

    test('should return loadAnswerForTextFailure', () => {
      const error = new Error('shit happened');
      const result = loadAnswerForTextFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      dataService.postQuestionAnsweringText = jest.fn(() => response);

      expect(effects.loadAnswerText$).toBeObservable(expected);
      expect(dataService.postQuestionAnsweringText).toHaveBeenCalledTimes(1);
      expect(dataService.postQuestionAnsweringText).toHaveBeenCalledWith(
        APP_STATE_MOCK.questionAnswering.text.input
      );
    });
  });

  describe('loadAnswerFile$', () => {
    beforeEach(() => {
      action = loadAnswerForFile({
        question: APP_STATE_MOCK.questionAnswering.fileUpload.input.question,
      });
    });

    test('should return loadAnswerForFileSuccess action with answer', () => {
      effects.getRandomInt = jest
        .fn()
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(0);

      const result = loadAnswerForFileSuccess({
        answer:
          APP_STATE_MOCK.questionAnswering.fileUpload.conversation[0].answer,
        textInput: APP_STATE_MOCK.questionAnswering.fileUpload.input.textInput,
      });

      actions$ = hot('-a', { a: action });

      const responseMock = JSON.parse(
        JSON.stringify(
          APP_STATE_MOCK.questionAnswering.fileUpload.conversation[0].answer
        )
      );
      delete responseMock.confidenceAnswerIndex;
      delete responseMock.reengagementMessageIndex;

      responseMock.textInput =
        APP_STATE_MOCK.questionAnswering.fileUpload.input.textInput;

      const response = cold('-a|', {
        a: responseMock,
      });
      const expected = cold('--b', { b: result });

      dataService.postQuestionAnsweringFile = jest.fn(() => response);

      expect(effects.loadAnswerFile$).toBeObservable(expected);
      expect(dataService.postQuestionAnsweringFile).toHaveBeenCalledTimes(1);

      const expectedFunctionParam =
        APP_STATE_MOCK.questionAnswering.fileUpload.input;
      delete expectedFunctionParam.textInput;
      expect(dataService.postQuestionAnsweringFile).toHaveBeenCalledWith(
        expectedFunctionParam
      );

      expect(effects.getRandomInt).toHaveBeenCalledTimes(2);
      expect(effects.getRandomInt).toHaveBeenCalledWith(4);
    });

    test('should return loadAnswerForFileFailure', () => {
      const error = new Error('shit happened');
      const result = loadAnswerForFileFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      dataService.postQuestionAnsweringFile = jest.fn(() => response);

      const mockInput = APP_STATE_MOCK.questionAnswering.fileUpload.input;
      delete mockInput.textInput;

      expect(effects.loadAnswerFile$).toBeObservable(expected);
      expect(dataService.postQuestionAnsweringFile).toHaveBeenCalledTimes(1);
      expect(dataService.postQuestionAnsweringFile).toHaveBeenCalledWith(
        mockInput
      );
    });
  });

  describe('resetAll', () => {
    test('should dispatch another action', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', { a: resetAll() });
      effects.resetQuestionAnswering$.subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(resetQuestionAnswering());
      });
    });
  });

  describe('getRandomInt', () => {
    test('should return number in given range', () => {
      Math.random = jest.fn().mockReturnValue(0.5);
      expect(effects.getRandomInt(5)).toEqual(2);
    });
  });
});
