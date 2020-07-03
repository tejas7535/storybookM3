import { OverlayModule } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { SnackBarService } from '@schaeffler/snackbar';

import { APP_STATE_MOCK } from '../../../../../testing/mocks/shared/app-state.mock';
import { DataService } from '../../../../shared/result/services/data.service';
import {
  loadTranslationForFile,
  loadTranslationForFileSuccess,
  loadTranslationForText,
  loadTranslationForTextSuccess,
  resetAll,
  resetTranslation,
} from '../../actions';
import { initialState } from '../../reducers/translation/translation.reducer';
import { TranslationEffects } from './translation.effects';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('TranslationEffects', () => {
  let action: any;
  let actions$: any;
  let store: any;
  let effects: TranslationEffects;
  let dataService: DataService;
  let snackBarService: SnackBarService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslationEffects,
        SnackBarService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: DataService,
          useValue: {
            postTranslationText: jest.fn(),
            postTranslationFile: jest.fn(),
          },
        },
      ],
      imports: [MatSnackBarModule, OverlayModule, NoopAnimationsModule],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(Store);
    effects = TestBed.inject(TranslationEffects);
    dataService = TestBed.inject(DataService);
    snackBarService = TestBed.inject(SnackBarService);
  });

  describe('loadTranslationText', () => {
    beforeEach(() => {
      action = loadTranslationForText({
        textInput: APP_STATE_MOCK.translation.translationTextInput,
      });
    });

    test('should return loadTranslationForTextSuccess action with translation', () => {
      const result = loadTranslationForTextSuccess({
        translation: APP_STATE_MOCK.translation.translationForText.translation,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: {
          translation:
            APP_STATE_MOCK.translation.translationForText.translation,
        },
      });
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
        fileInput: APP_STATE_MOCK.translation.translationFileInput,
      });
    });

    test('should return loadTranslationForFileSuccess action with translation', () => {
      const result = loadTranslationForFileSuccess({
        translation: APP_STATE_MOCK.translation.translationForFile.translation,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: {
          translation:
            APP_STATE_MOCK.translation.translationForFile.translation,
        },
      });
      const expected = cold('--b', { b: result });

      dataService.postTranslationFile = jest.fn(() => response);

      expect(effects.loadTranslationFile$).toBeObservable(expected);
      expect(dataService.postTranslationFile).toHaveBeenCalledTimes(1);
      expect(dataService.postTranslationFile).toHaveBeenCalledWith(
        APP_STATE_MOCK.translation.translationFileInput
      );
    });
  });

  describe('handleMaxRetries', () => {
    test('should trigger Snackbar and throw error', () => {
      snackBarService.showWarningMessage = jest
        .fn()
        .mockReturnValue(of('action'));
      const er = { code: '-100' };

      expect(() => effects.handleMaxRetries(er, 4)).toThrowError();
      expect(snackBarService.showWarningMessage).toHaveBeenCalledWith(
        'translate it'
      );
    });

    test('should  trigger no Snackbar and throw no error', () => {
      snackBarService.showWarningMessage = jest
        .fn()
        .mockReturnValue(of('action'));
      const er = { code: '-100' };

      expect(() => effects.handleMaxRetries(er, 3)).not.toThrowError();
      expect(snackBarService.showWarningMessage).toHaveBeenCalledTimes(0);
    });

    test('should  trigger no Snackbar and throw error when other code than -100 is returned', () => {
      snackBarService.showWarningMessage = jest
        .fn()
        .mockReturnValue(of('action'));
      const er = { message: 'example backend error', errorId: 1 };

      expect(() => effects.handleMaxRetries(er, 0)).toThrowError();
      expect(snackBarService.showWarningMessage).toHaveBeenCalledTimes(0);
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
