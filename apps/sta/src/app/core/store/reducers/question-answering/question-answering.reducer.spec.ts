import { QUESTION_ANSWERING_STATE_MOCK } from '../../../../../testing/mocks/question-answering/question-answering-values.mock';
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
} from '../../actions';
import {
  initialState,
  questionAnsweringReducer,
  reducer,
} from './question-answering.reducer';

describe('QuestionAnswering Reducer', () => {
  describe('storeTextInput', () => {
    it('should set text and text lang', () => {
      const action = storeTextInput({
        text: QUESTION_ANSWERING_STATE_MOCK.text.input.text,
        textLang: QUESTION_ANSWERING_STATE_MOCK.text.input.textLang,
      });

      const state = questionAnsweringReducer(initialState, action);

      expect(state.text.input.text).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.text.input.text
      );
      expect(state.text.input.textLang).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.text.input.textLang
      );
    });
  });

  describe('storeFileInput', () => {
    it('should set file', () => {
      const action = storeFileInput({
        file: QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.file,
      });

      const state = questionAnsweringReducer(initialState, action);

      expect(state.fileUpload.input.file).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.file
      );
    });
  });

  describe('loadAnswerForText', () => {
    it('should set question and add first conversation entry with question', () => {
      const action = loadAnswerForText({
        question: QUESTION_ANSWERING_STATE_MOCK.text.input.question,
      });

      const state = questionAnsweringReducer(initialState, action);

      expect(state.text.input.question).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.text.input.question
      );
      expect(state.text.conversation[0].question).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.text.input.question
      );
    });
  });

  describe('loadAnswerForFile', () => {
    it('should set question and add first conversation entry with question', () => {
      const action = loadAnswerForFile({
        question: QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.question,
      });

      const state = questionAnsweringReducer(initialState, action);

      expect(state.fileUpload.input.question).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.question
      );
      expect(state.fileUpload.conversation[0].question).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.question
      );
    });
  });

  describe('loadAnswerForText', () => {
    it('should set question and add first conversation entry with question', () => {
      const action = loadAnswerForText({
        question: QUESTION_ANSWERING_STATE_MOCK.text.input.question,
      });

      const state = questionAnsweringReducer(initialState, action);

      expect(state.text.input.question).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.text.input.question
      );
      expect(state.text.conversation[0].question).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.text.input.question
      );
    });
  });

  describe('loadAnswerForTextFailure', () => {
    it('should set loading to false', () => {
      const action = loadAnswerForTextFailure();

      const state = questionAnsweringReducer(initialState, action);

      expect(state.text.loading).toEqual(false);
    });
  });

  describe('loadAnswerForFileFailure', () => {
    it('should set loading and success to false', () => {
      const action = loadAnswerForFileFailure();

      const state = questionAnsweringReducer(initialState, action);

      expect(state.fileUpload.loading).toEqual(false);
      expect(state.fileUpload.success).toEqual(false);
    });
  });

  describe('loadAnswerForTextSuccess', () => {
    it('should set loading to false and add answer in last conversation entry', () => {
      // prepare question
      const prepareAction = loadAnswerForText({
        question: QUESTION_ANSWERING_STATE_MOCK.text.input.question,
      });
      const prepareState = questionAnsweringReducer(
        initialState,
        prepareAction
      );

      const action = loadAnswerForTextSuccess({
        answer: QUESTION_ANSWERING_STATE_MOCK.text.conversation[0].answer,
      });

      const state = questionAnsweringReducer(prepareState, action);

      expect(state.text.loading).toEqual(false);
      expect(state.text.conversation[0].answer).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.text.conversation[0].answer
      );
    });
  });

  describe('loadAnswerForFileSuccess', () => {
    it('should set loading to false, success to true and add answer in last conversation entry', () => {
      // Prepare question
      const prepareAction = loadAnswerForFile({
        question: QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.question,
      });
      const prepareState = questionAnsweringReducer(
        initialState,
        prepareAction
      );

      const action = loadAnswerForFileSuccess({
        answer: QUESTION_ANSWERING_STATE_MOCK.fileUpload.conversation[0].answer,
        textInput: QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.textInput,
      });

      const state = questionAnsweringReducer(prepareState, action);

      expect(state.fileUpload.loading).toEqual(false);
      expect(state.fileUpload.success).toEqual(true);
      expect(state.fileUpload.conversation[0].answer).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.fileUpload.conversation[0].answer
      );
      expect(state.fileUpload.input.textInput).toEqual(
        QUESTION_ANSWERING_STATE_MOCK.fileUpload.input.textInput
      );
    });
  });

  describe('setLoadingForTextInput', () => {
    it('should set loading', () => {
      const action = setLoadingForTextInput({
        loading: true,
      });

      const state = questionAnsweringReducer(initialState, action);

      expect(state.text.loading).toEqual(true);
    });
  });

  describe('setLoadingForFileInput', () => {
    it('should set loading', () => {
      const action = setLoadingForFileInput({
        loading: true,
      });

      const state = questionAnsweringReducer(initialState, action);

      expect(state.fileUpload.loading).toEqual(true);
    });
  });

  describe('resetQuestionAnswering', () => {
    it('should reset to initialState', () => {
      const action = resetQuestionAnswering();
      const state = questionAnsweringReducer(
        QUESTION_ANSWERING_STATE_MOCK,
        action
      );
      expect(state).toEqual(initialState);
    });

    it('should keep selectedTabIndex when resetting', () => {
      const mockState = QUESTION_ANSWERING_STATE_MOCK;
      mockState.selectedTabIndex = 1;

      const action = resetQuestionAnswering();
      const state = questionAnsweringReducer(mockState, action);

      expect(state.fileUpload).toEqual(initialState.fileUpload);
      expect(state.text).toEqual(initialState.text);
      expect(state.selectedTabIndex).toEqual(mockState.selectedTabIndex);
    });
  });

  describe('setSelectedTabIndex', () => {
    it('should set selectedTabIndex', () => {
      const action = setSelectedTabIndexQuestionAnswering({
        selectedTabIndex: 1,
      });
      const state = questionAnsweringReducer(initialState, action);
      expect(state.selectedTabIndex).toEqual(1);
    });
  });

  describe('Reducer function', () => {
    test('should return questionAnsweringReducer', () => {
      const action = loadAnswerForText({
        question: QUESTION_ANSWERING_STATE_MOCK.text.input.question,
      });
      expect(reducer(initialState, action)).toEqual(
        questionAnsweringReducer(initialState, action)
      );
    });
  });
});
