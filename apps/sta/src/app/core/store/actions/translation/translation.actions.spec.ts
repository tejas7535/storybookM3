import {
  FileReplacement,
  Language,
  TextInput
} from '../../../../shared/result/models';
import { TranslationFileInput } from '../../reducers/translation/models/translation-file-input.model';
import {
  loadTranslationForFile,
  loadTranslationForFileFailure,
  loadTranslationForFileSuccess,
  loadTranslationForText,
  loadTranslationForTextFailure,
  loadTranslationForTextSuccess,
  resetTranslation,
  setSelectedTabIndexTranslation
} from './translation.actions';

describe('TranslationActions', () => {
  describe('Loads Translation for Text Actions', () => {
    test('LoadTranslationForText', () => {
      const textInput: TextInput = {
        text: 'abc',
        targetLang: Language.DE,
        textLang: Language.EN
      };
      const action = loadTranslationForText({ textInput });

      expect(action).toEqual({
        textInput,
        type: '[Translation] Load Translation for Text'
      });
    });

    test('LoadTranslationForTextSuccess', () => {
      const translation = 'abc';
      const action = loadTranslationForTextSuccess({ translation });

      expect(action).toEqual({
        translation,
        type: '[Translation] Load Translation for Text Success'
      });
    });

    test('LoadTranslationForTextFailure', () => {
      const action = loadTranslationForTextFailure();

      expect(action).toEqual({
        type: '[Translation] Load Translation for Text Failure'
      });
    });
  });

  describe('Loads Translation for File Actions', () => {
    test('LoadTranslationForFile', () => {
      const file: FileReplacement = {
        name: 'abc',
        type: 'xyz',
        content: [12, 13, 14, 15]
      };
      const fileInput: TranslationFileInput = {
        file,
        targetLang: Language.DE,
        textLang: Language.EN
      };
      const action = loadTranslationForFile({ fileInput });

      expect(action).toEqual({
        fileInput,
        type: '[Translation] Load Translation for File'
      });
    });

    test('LoadTranslationForFileSuccess', () => {
      const translation = 'abc';
      const action = loadTranslationForFileSuccess({ translation });

      expect(action).toEqual({
        translation,
        type: '[Translation] Load Translation for File Success'
      });
    });

    test('LoadTranslationForFileFailure', () => {
      const action = loadTranslationForFileFailure();

      expect(action).toEqual({
        type: '[Translation] Load Translation for File Failure'
      });
    });
  });

  describe('Reset Translation Action', () => {
    test('ResetTranslation', () => {
      const action = resetTranslation();

      expect(action).toEqual({
        type: '[Translation] Reset Translation State to initialState'
      });
    });
  });

  describe('Set Selected Tab Index Action', () => {
    test('SetSelectedTabIndexTranslation', () => {
      const selectedTabIndex = 0;

      const action = setSelectedTabIndexTranslation({
        selectedTabIndex
      });

      expect(action).toEqual({
        selectedTabIndex,
        type: '[Translation] Set SelectedTabIndex'
      });
    });
  });
});
