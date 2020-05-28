import {
  loadTranslationForFile,
  loadTranslationForFileFailure,
  loadTranslationForFileSuccess,
  loadTranslationForText,
  loadTranslationForTextFailure,
  loadTranslationForTextSuccess,
  resetTranslation,
  setSelectedTabIndexTranslation,
} from '../..';
import { TRANSLATION_STATE_MOCK } from '../../../../../testing/mocks/translation/translation-values.mock';
import {
  initialState,
  reducer,
  translationReducer,
} from './translation.reducer';

describe('Translation Reducer', () => {
  describe('LoadTranslationForText', () => {
    test('should set translationTextInput and loading', () => {
      const action = loadTranslationForText({
        textInput: TRANSLATION_STATE_MOCK.translationTextInput,
      });
      const state = translationReducer(initialState, action);

      expect(state.translationTextInput).toEqual(
        TRANSLATION_STATE_MOCK.translationTextInput
      );
    });

    test('should set default values for targetLang and TextLang', () => {
      const withoutLangValues = {
        text: TRANSLATION_STATE_MOCK.translationTextInput.text,
      };
      const action = loadTranslationForText({ textInput: withoutLangValues });
      const state = translationReducer(initialState, action);

      expect(state.translationTextInput).toEqual(
        TRANSLATION_STATE_MOCK.translationTextInput
      );
    });
  });

  describe('LoadTranslationForFile', () => {
    test('should set translationFileInput and loading', () => {
      const action = loadTranslationForFile({
        fileInput: TRANSLATION_STATE_MOCK.translationFileInput,
      });
      const state = translationReducer(initialState, action);

      expect(state.translationFileInput).toEqual(
        TRANSLATION_STATE_MOCK.translationFileInput
      );
    });

    test('should set default values for targetLang and TextLang', () => {
      const withoutLangValues = {
        file: TRANSLATION_STATE_MOCK.translationFileInput.file,
      };
      const action = loadTranslationForFile({ fileInput: withoutLangValues });
      const state = translationReducer(initialState, action);

      expect(state.translationFileInput).toEqual(
        TRANSLATION_STATE_MOCK.translationFileInput
      );
    });
  });

  describe('LoadTranslationForTextFailure', () => {
    test('should set loading', () => {
      const action = loadTranslationForTextFailure();
      const state = translationReducer(initialState, action);

      expect(state.translationForText.loading).toBeFalsy();
    });
  });

  describe('LoadTranslationForFileFailure', () => {
    test('should set loading and success', () => {
      const action = loadTranslationForFileFailure();
      const state = translationReducer(initialState, action);

      expect(state.translationForFile.loading).toBeFalsy();
      expect(state.translationForFile.success).toBeFalsy();
    });
  });

  describe('LoadTranslationForTextSucces', () => {
    test('should set translation and loading', () => {
      const action = loadTranslationForTextSuccess({
        translation: TRANSLATION_STATE_MOCK.translationForText.translation,
      });
      const state = translationReducer(initialState, action);

      expect(state.translationForText.translation).toEqual(
        TRANSLATION_STATE_MOCK.translationForText.translation
      );
      expect(state.translationForText.loading).toBeFalsy();
    });
  });

  describe('LoadTranslationForFileSucces', () => {
    test('should set translation, loading and success', () => {
      const action = loadTranslationForFileSuccess({
        translation: TRANSLATION_STATE_MOCK.translationForFile.translation,
      });
      const state = translationReducer(initialState, action);

      expect(state.translationForFile.translation).toEqual(
        TRANSLATION_STATE_MOCK.translationForFile.translation
      );
      expect(state.translationForFile.loading).toBeFalsy();
      expect(state.translationForFile.success).toBeTruthy();
    });
  });

  describe('ResetTranslation', () => {
    test('should reset state to initialstate except selectedTabIndex', () => {
      const action = resetTranslation();
      const state = translationReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('SetSelectedTabIndexTranslation', () => {
    test('should set selectedTabIndex', () => {
      const action = setSelectedTabIndexTranslation({
        selectedTabIndex: TRANSLATION_STATE_MOCK.selectedTabIndex,
      });
      const state = translationReducer(initialState, action);

      expect(state.selectedTabIndex).toEqual(
        TRANSLATION_STATE_MOCK.selectedTabIndex
      );
    });
  });

  describe('Reducer function', () => {
    test('should return translationReducer', () => {
      const action = loadTranslationForText({
        textInput: TRANSLATION_STATE_MOCK.translationTextInput,
      });
      expect(reducer(initialState, action)).toEqual(
        translationReducer(initialState, action)
      );
    });
  });
});
