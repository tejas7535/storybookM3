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
  loadTranslationForFile,
  loadTranslationForFileFailure,
  loadTranslationForFileSuccess,
  loadTranslationForText,
  loadTranslationForTextFailure,
  loadTranslationForTextSuccess,
  resetAll,
  resetTranslation
} from '../../actions';
import { initialState } from '../../reducers/translation/translation.reducer';
import { TranslationEffects } from './translation.effetcs';

describe('TranslationEffects', () => {
  let action: any;
  let actions$: any;
  let store: any;
  let effects: TranslationEffects;
  let dataService: DataService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslationEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: DataService,
          useValue: {
            postTranslationText: jest.fn(),
            postTranslationFile: jest.fn()
          }
        }
      ]
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(Store);
    effects = TestBed.inject(TranslationEffects);
    dataService = TestBed.inject(DataService);
  });

  describe('loadTranslationText', () => {
    beforeEach(() => {
      action = loadTranslationForText({
        textInput: APP_STATE_MOCK.translation.translationTextInput
      });
    });

    test('should return loadTranslationForTextSuccess action with translation', () => {
      const result = loadTranslationForTextSuccess({
        translation: APP_STATE_MOCK.translation.translationForText.translation
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: APP_STATE_MOCK.translation.translationForText.translation
      });
      const expected = cold('--b', { b: result });

      dataService.postTranslationText = jest.fn(() => response);

      expect(effects.loadTranslationText$).toBeObservable(expected);
      expect(dataService.postTranslationText).toHaveBeenCalledTimes(1);
      expect(dataService.postTranslationText).toHaveBeenCalledWith(
        APP_STATE_MOCK.translation.translationTextInput
      );
    });

    test('should return loadTranslationForTextFailure', () => {
      const error = new Error('shit happened');
      const result = loadTranslationForTextFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      dataService.postTranslationText = jest.fn(() => response);

      expect(effects.loadTranslationText$).toBeObservable(expected);
      expect(dataService.postTranslationText).toHaveBeenCalledTimes(1);
      expect(dataService.postTranslationText).toHaveBeenCalledWith(
        APP_STATE_MOCK.translation.translationTextInput
      );
    });
  });

  describe('loadTranslationFile', () => {
    beforeEach(() => {
      action = loadTranslationForFile({
        fileInput: APP_STATE_MOCK.translation.translationFileInput
      });
    });

    test('should return loadTranslationForFileSuccess action with translation', () => {
      const result = loadTranslationForFileSuccess({
        translation: APP_STATE_MOCK.translation.translationForFile.translation
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: APP_STATE_MOCK.translation.translationForFile.translation
      });
      const expected = cold('--b', { b: result });

      dataService.postTranslationFile = jest.fn(() => response);

      expect(effects.loadTranslationFile$).toBeObservable(expected);
      expect(dataService.postTranslationFile).toHaveBeenCalledTimes(1);
      expect(dataService.postTranslationFile).toHaveBeenCalledWith(
        APP_STATE_MOCK.translation.translationFileInput
      );
    });

    test('should return loadTranslationForFileFailure', () => {
      const error = new Error('shit happened');
      const result = loadTranslationForFileFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      dataService.postTranslationFile = jest.fn(() => response);

      expect(effects.loadTranslationFile$).toBeObservable(expected);
      expect(dataService.postTranslationFile).toHaveBeenCalledTimes(1);
      expect(dataService.postTranslationFile).toHaveBeenCalledWith(
        APP_STATE_MOCK.translation.translationFileInput
      );
    });
  });

  describe('resetAll', () => {
    test('should dispatch another action', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', { a: resetAll() });
      effects.resetTranslation$.subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(resetTranslation());
      });
    });
  });
});
