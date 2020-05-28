import { createSelector } from '@ngrx/store';

import { FileStatus } from '../../../../shared/file-upload/file-status.model';
import { getQuestionAnsweringState } from '../../reducers';
import { QuestionAnsweringState } from '../../reducers/question-answering/question-answering.reducer';

export const getSelectedTabIndexQuestionAnswering = createSelector(
  getQuestionAnsweringState,
  (state: QuestionAnsweringState) => state.selectedTabIndex
);

export const getTextInputQuestionAnswering = createSelector(
  getQuestionAnsweringState,
  (state: QuestionAnsweringState) => state.text.input
);

export const getFileInputQuestionAnswering = createSelector(
  getQuestionAnsweringState,
  (state: QuestionAnsweringState) => state.fileUpload.input
);

export const getFileStatusQuestionAnswering = createSelector(
  getQuestionAnsweringState,
  (state: QuestionAnsweringState) => {
    const returnValue = state.fileUpload.input?.file
      ? new FileStatus(
          state.fileUpload.input.file.name,
          state.fileUpload.input.file.type,
          state.fileUpload.success
        )
      : undefined;

    return returnValue;
  }
);

export const getQuestionAnsweringDataForText = createSelector(
  getQuestionAnsweringState,
  (state: QuestionAnsweringState) => state.text
);

export const getQuestionAnsweringDataForFile = createSelector(
  getQuestionAnsweringState,
  (state: QuestionAnsweringState) => state.fileUpload
);
