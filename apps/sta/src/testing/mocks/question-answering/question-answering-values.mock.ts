import { DEMO_TEXT_EN } from '../../../app/constants/demo-text-en.constant';
import { QuestionAnsweringState } from '../../../app/core/store/reducers/question-answering/question-answering.reducer';
import { Language } from '../../../app/shared/result/models/language.enum';

export const QUESTION_ANSWERING_STATE_MOCK: QuestionAnsweringState = {
  fileUpload: {
    input: {
      file: {
        name: 'abc',
        type: 'text/plain',
        content: [84, 104, 101, 32],
      },
      question: 'abc?',
      textInput: 'abc',
    },
    conversation: [
      {
        question: 'abc?',
        answer: {
          answer: 'abc',
          exactMatch: 'abc',
          logit: 5,
          paragraphStart: 0,
          paragraphEnd: 2,
          confidenceAnswerIndex: 1,
          reengagementMessageIndex: 0,
        },
      },
    ],
    loading: false,
    success: true,
  },
  text: {
    input: {
      text: DEMO_TEXT_EN,
      question: 'abc?',
      textLang: Language.EN,
    },
    conversation: [
      {
        question: 'abc?',
        answer: {
          answer: 'abc',
          exactMatch: 'abc',
          logit: 5,
          paragraphStart: 0,
          paragraphEnd: 2,
          confidenceAnswerIndex: 1,
          reengagementMessageIndex: 0,
        },
      },
    ],
    loading: false,
  },
  selectedTabIndex: 0,
};
