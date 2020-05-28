import { TestBed } from '@angular/core/testing';

import { select, Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';

import {
  loadTranslationForFile,
  loadTranslationForFileSuccess,
  loadTranslationForText,
  loadTranslationForTextSuccess,
} from '../..';
import { TRANSLATION_STATE_MOCK } from '../../../../../testing/mocks/translation/translation-values.mock';
import { FileStatus } from '../../../../shared/file-upload/file-status.model';
import * as fromRoot from '../../reducers';
import {
  getFileStatusTranslation,
  getLoadingTranslationForFile,
  getLoadingTranslationForText,
  getSelectedTabIndexTranslation,
  getTextInputTranslation,
  getTranslationForFile,
  getTranslationForText,
} from './translation.selector';

describe('TranslationSelector', () => {
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

  describe('getTextInputTranslation', () => {
    beforeEach(() => {
      store
        .pipe(select(getTextInputTranslation))
        .subscribe((value) => (result = value));
    });

    test('should return undefined when state is not defined', () => {
      expect(result).toBeUndefined();
    });

    test('should return textInput', () => {
      const textInput = TRANSLATION_STATE_MOCK.translationTextInput;
      store.dispatch(loadTranslationForText({ textInput }));

      expect(result).toEqual(textInput);
    });
  });

  describe('getTranslationForText', () => {
    beforeEach(() => {
      store
        .pipe(select(getTranslationForText))
        .subscribe((value) => (result = value));
    });

    test('should return undefined translation when state is not defined', () => {
      expect(result).toBeUndefined();
    });

    test('should return translation', () => {
      store.dispatch(
        loadTranslationForTextSuccess({
          translation: TRANSLATION_STATE_MOCK.translationForText.translation,
        })
      );

      expect(result).toEqual(
        TRANSLATION_STATE_MOCK.translationForText.translation
      );
    });
  });

  describe('getTranslationForFile', () => {
    beforeEach(() => {
      store
        .pipe(select(getTranslationForFile))
        .subscribe((value) => (result = value));
    });

    test('should return undefined translation when state is not defined', () => {
      expect(result).toBeUndefined();
    });

    test('should return translation', () => {
      store.dispatch(
        loadTranslationForFileSuccess({
          translation: TRANSLATION_STATE_MOCK.translationForFile.translation,
        })
      );

      expect(result).toEqual(
        TRANSLATION_STATE_MOCK.translationForFile.translation
      );
    });
  });

  describe('getLoadingTranslationForText', () => {
    test('should return false on initialState', () => {
      store
        .pipe(select(getLoadingTranslationForText))
        .subscribe((value) => (result = value));
      expect(result).toBeFalsy();
    });
  });

  describe('getLoadingTranslationForFile', () => {
    test('should return false on initialState', () => {
      store
        .pipe(select(getLoadingTranslationForFile))
        .subscribe((value) => (result = value));
      expect(result).toBeFalsy();
    });
  });

  describe('getSelectedTabIndexTranslation', () => {
    test('should return 0 on initialState', () => {
      store
        .pipe(select(getSelectedTabIndexTranslation))
        .subscribe((value) => (result = value));
      expect(result).toEqual(0);
    });
  });

  describe('getFileStatusTranslation', () => {
    beforeEach(() => {
      store
        .pipe(select(getFileStatusTranslation))
        .subscribe((value) => (result = value));
    });

    test('should return undefined when state is not defined', () => {
      expect(result).toBeUndefined();
    });

    test('should return fileStatus when loading (success = undefined)', () => {
      const fileInput = TRANSLATION_STATE_MOCK.translationFileInput;
      store.dispatch(loadTranslationForFile({ fileInput }));

      const expected: FileStatus = {
        fileName: fileInput.file.name,
        fileType: fileInput.file.type,
        success: undefined,
      };
      expect(result).toEqual(expected);
    });

    test('should return fileStatus when loading successful (success = true)', () => {
      const fileInput = TRANSLATION_STATE_MOCK.translationFileInput;
      store.dispatch(loadTranslationForFile({ fileInput }));
      const translation = 'abc';
      store.dispatch(loadTranslationForFileSuccess({ translation }));

      const expected: FileStatus = {
        fileName: fileInput.file.name,
        fileType: fileInput.file.type,
        success: true,
      };
      expect(result).toEqual(expected);
    });
  });
});
