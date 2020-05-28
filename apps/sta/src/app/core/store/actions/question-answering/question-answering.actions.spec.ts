import { FileReplacement } from '../../../../shared/result/models/file-replacement.model';
import { Language } from '../../../../shared/result/models/language.enum';
import { Answer } from '../../reducers/question-answering/models/answer.model';
import {
  loadAnswerForFile,
  loadAnswerForFileFailure,
  loadAnswerForFileSuccess,
  loadAnswerForText,
  loadAnswerForTextFailure,
  loadAnswerForTextSuccess,
  resetQuestionAnswering,
  setLoadingForFileInput,
  setLoadingForTextInput,
  setSelectedTabIndexQuestionAnswering,
  storeFileInput,
  storeTextInput,
} from './question-answering.actions';

describe('QuestionAnsweringActions', () => {
  describe('Store TextInput Action', () => {
    test('StoreTextInput', () => {
      const text = 'abc';
      const textLang = Language.EN;

      const action = storeTextInput({ text, textLang });

      expect(action).toEqual({
        text,
        textLang,
        type: '[Question Answering] Store Text Input',
      });
    });
  });

  describe('Store FileInput Action', () => {
    test('StoreFileInput', () => {
      const file: FileReplacement = {
        content: [0, 1, 2],
        name: 'abc',
        type: 'typexyz',
      };

      const action = storeFileInput({ file });

      expect(action).toEqual({
        file,
        type: '[Question Answering] Store File Input',
      });
    });
  });

  describe('Loads Answer for Text Actions', () => {
    test('LoadTranslationForText', () => {
      const question = 'abc?';
      const action = loadAnswerForText({ question });

      expect(action).toEqual({
        question,
        type: '[Question Answering] Load Answer for Text',
      });
    });

    test('LoadAnswerForTextSuccess', () => {
      const answer: Answer = {
        answer: 'abc',
        exactMatch: 'abc',
        logit: 7,
        paragraphEnd: 1,
        paragraphStart: 0,
      };
      const action = loadAnswerForTextSuccess({ answer });

      expect(action).toEqual({
        answer,
        type: '[Question Answering] Load Answer for Text Success',
      });
    });

    test('LoadAnswerForTextFailure', () => {
      const action = loadAnswerForTextFailure();

      expect(action).toEqual({
        type: '[Question Answering] Load Answer for Text Failure',
      });
    });
  });

  describe('Loads Answer for File Actions', () => {
    test('LoadTranslationForFile', () => {
      const question = 'abc';
      const action = loadAnswerForFile({ question });

      expect(action).toEqual({
        question,
        type: '[Question Answering] Load Answer for File',
      });
    });

    test('LoadTranslationForFileSuccess', () => {
      const answer: Answer = {
        answer: 'abc',
        exactMatch: 'abc',
        logit: 7,
        paragraphEnd: 1,
        paragraphStart: 0,
      };
      const textInput = 'input';

      const action = loadAnswerForFileSuccess({ answer, textInput });

      expect(action).toEqual({
        answer,
        textInput,
        type: '[Question Answering] Load Answer for File Success',
      });
    });

    test('LoadTranslationForFileFailure', () => {
      const action = loadAnswerForFileFailure();

      expect(action).toEqual({
        type: '[Question Answering] Load Answer for File Failure',
      });
    });
  });

  describe('ResetQuestionAnswering Action', () => {
    test('ResetQuestionAnswering', () => {
      const action = resetQuestionAnswering();

      expect(action).toEqual({
        type:
          '[Question Answering] Reset Question Answering State to initialState',
      });
    });
  });

  describe('SetSelectedTabIndexQuestionAnswering Action', () => {
    test('SetSelectedTabIndexQuestionAnswering', () => {
      const selectedTabIndex = 1;
      const action = setSelectedTabIndexQuestionAnswering({ selectedTabIndex });

      expect(action).toEqual({
        selectedTabIndex,
        type: '[Question Answering] Set SelectedTabIndex',
      });
    });
  });

  describe('SetLoadingForTextInput Action', () => {
    test('SetLoadingForTextInput', () => {
      const loading = true;
      const action = setLoadingForTextInput({ loading });

      expect(action).toEqual({
        loading,
        type: '[Question Answering] Set loading status for textInput',
      });
    });
  });

  describe('SetLoadingForFileInput Action', () => {
    test('SetLoadingForFileInput', () => {
      const loading = true;
      const action = setLoadingForFileInput({ loading });

      expect(action).toEqual({
        loading,
        type: '[Question Answering] Set loading for fileInput',
      });
    });
  });
});
