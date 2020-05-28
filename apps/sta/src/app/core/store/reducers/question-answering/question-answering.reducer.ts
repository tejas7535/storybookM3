import { Action, createReducer, on } from '@ngrx/store';

import { DEMO_TEXT_EN } from '../../../../constants/demo-text-en.constant';
import { Language } from '../../../../shared/result/models/language.enum';
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
import { QuestionAndAnswer } from './models/question-and-answer.model';
import { QuestionAndAnswerDataForFile } from './models/question-answering-data-for-file.model';
import { QuestionAndAnswerDataForText } from './models/question-answering-data-for-text.model';

export interface QuestionAnsweringState {
  fileUpload: QuestionAndAnswerDataForFile;
  text: QuestionAndAnswerDataForText;
  selectedTabIndex: number;
}

export const initialState: QuestionAnsweringState = {
  fileUpload: {
    input: undefined,
    conversation: [],
    loading: false,
    success: undefined,
  },
  text: {
    input: {
      question: undefined,
      text: DEMO_TEXT_EN,
      textLang: Language.EN,
    },
    conversation: [],
    loading: false,
  },
  selectedTabIndex: 0,
};

export const questionAnsweringReducer = createReducer(
  initialState,
  on(storeTextInput, (state: QuestionAnsweringState, { text, textLang }) => ({
    ...state,
    text: {
      ...state.text,
      input: {
        ...state.text.input,
        text,
        textLang,
      },
    },
  })),
  on(storeFileInput, (state: QuestionAnsweringState, { file }) => ({
    ...state,
    fileUpload: {
      ...state.fileUpload,
      input: {
        ...state.fileUpload.input,
        file,
      },
    },
  })),
  on(loadAnswerForText, (state: QuestionAnsweringState, { question }) => ({
    ...state,
    text: {
      ...state.text,
      input: {
        ...state.text.input,
        question,
      },
      conversation: [
        ...state.text.conversation,
        new QuestionAndAnswer(question),
      ],
      loading: true,
    },
  })),
  on(loadAnswerForFile, (state: QuestionAnsweringState, { question }) => ({
    ...state,
    fileUpload: {
      ...state.fileUpload,
      input: {
        ...state.fileUpload.input,
        question,
      },
      conversation: [
        ...state.fileUpload.conversation,
        new QuestionAndAnswer(question),
      ],
      loading: true,
    },
  })),
  on(loadAnswerForTextFailure, (state: QuestionAnsweringState) => ({
    ...state,
    text: {
      ...state.text,
      loading: false,
    },
  })),
  on(loadAnswerForFileFailure, (state: QuestionAnsweringState) => ({
    ...state,
    fileUpload: {
      ...state.fileUpload,
      loading: false,
      success: false,
    },
  })),
  on(loadAnswerForTextSuccess, (state: QuestionAnsweringState, { answer }) => {
    const updatedQuestionAndAnswer = new QuestionAndAnswer(
      state.text.conversation[state.text.conversation.length - 1].question,
      answer
    );

    return {
      ...state,
      text: {
        ...state.text,
        loading: false,
        conversation: [
          ...state.text.conversation.slice(
            0,
            state.text.conversation.length - 1
          ),
          updatedQuestionAndAnswer,
        ],
      },
    };
  }),
  on(
    loadAnswerForFileSuccess,
    (state: QuestionAnsweringState, { answer, textInput }) => {
      const updatedQuestionAndAnswer = new QuestionAndAnswer(
        state.fileUpload.conversation[
          state.fileUpload.conversation.length - 1
        ].question,
        answer
      );

      return {
        ...state,
        fileUpload: {
          ...state.fileUpload,
          input: {
            ...state.fileUpload.input,
            textInput,
          },
          loading: false,
          success: true,
          conversation: [
            ...state.fileUpload.conversation.slice(
              0,
              state.fileUpload.conversation.length - 1
            ),
            updatedQuestionAndAnswer,
          ],
        },
      };
    }
  ),
  on(setLoadingForTextInput, (state: QuestionAnsweringState, { loading }) => ({
    ...state,
    text: {
      ...state.text,
      loading,
    },
  })),
  on(setLoadingForFileInput, (state: QuestionAnsweringState, { loading }) => ({
    ...state,
    fileUpload: {
      ...state.fileUpload,
      loading,
    },
  })),
  on(resetQuestionAnswering, (state: QuestionAnsweringState) => ({
    ...initialState,
    selectedTabIndex: state.selectedTabIndex,
  })),
  on(
    setSelectedTabIndexQuestionAnswering,
    (state: QuestionAnsweringState, { selectedTabIndex }) => ({
      ...state,
      selectedTabIndex,
    })
  )
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: QuestionAnsweringState,
  action: Action
): QuestionAnsweringState {
  return questionAnsweringReducer(state, action);
}
