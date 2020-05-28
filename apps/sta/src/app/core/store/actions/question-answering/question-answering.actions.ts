import { createAction, props, union } from '@ngrx/store';

import { FileReplacement } from '../../../../shared/result/models/file-replacement.model';
import { Language } from '../../../../shared/result/models/language.enum';
import { Answer } from '../../reducers/question-answering/models/answer.model';

export const storeTextInput = createAction(
  '[Question Answering] Store Text Input',
  props<{ text: string; textLang: Language }>()
);

export const storeFileInput = createAction(
  '[Question Answering] Store File Input',
  props<{ file: FileReplacement }>()
);

export const loadAnswerForText = createAction(
  '[Question Answering] Load Answer for Text',
  props<{ question: string }>()
);

export const loadAnswerForTextSuccess = createAction(
  '[Question Answering] Load Answer for Text Success',
  props<{ answer: Answer }>()
);

export const loadAnswerForTextFailure = createAction(
  '[Question Answering] Load Answer for Text Failure'
);

export const loadAnswerForFile = createAction(
  '[Question Answering] Load Answer for File',
  props<{ question: string }>()
);

export const loadAnswerForFileSuccess = createAction(
  '[Question Answering] Load Answer for File Success',
  props<{ answer: Answer; textInput: string }>()
);

export const loadAnswerForFileFailure = createAction(
  '[Question Answering] Load Answer for File Failure'
);

export const resetQuestionAnswering = createAction(
  '[Question Answering] Reset Question Answering State to initialState'
);

export const setSelectedTabIndexQuestionAnswering = createAction(
  '[Question Answering] Set SelectedTabIndex',
  props<{ selectedTabIndex: number }>()
);

export const setLoadingForTextInput = createAction(
  '[Question Answering] Set loading status for textInput',
  props<{ loading: boolean }>()
);

export const setLoadingForFileInput = createAction(
  '[Question Answering] Set loading for fileInput',
  props<{ loading: boolean }>()
);

const all = union({
  loadAnswerForText,
  loadAnswerForTextSuccess,
  loadAnswerForTextFailure,
  loadAnswerForFile,
  loadAnswerForFileSuccess,
  loadAnswerForFileFailure,
  resetQuestionAnswering,
  setSelectedTabIndexQuestionAnswering,
  setLoadingForTextInput,
  setLoadingForFileInput,
});

export type AnswerActions = typeof all;
