import { createSelector } from '@ngrx/store';

import { FileStatus } from '../../../../shared/file-upload/file-status.model';
import { getTranslationState } from '../../reducers';
import { TranslationState } from '../../reducers/translation/translation.reducer';

export const getTextInputTranslation = createSelector(
  getTranslationState,
  (state: TranslationState) => state.translationTextInput
);

export const getTranslationForText = createSelector(
  getTranslationState,
  (state: TranslationState) => state.translationForText.translation
);

export const getTranslationForFile = createSelector(
  getTranslationState,
  (state: TranslationState) => state.translationForFile.translation
);

export const getLoadingTranslationForText = createSelector(
  getTranslationState,
  (state: TranslationState) => state.translationForText.loading
);

export const getLoadingTranslationForFile = createSelector(
  getTranslationState,
  (state: TranslationState) => state.translationForFile.loading
);

export const getSelectedTabIndexTranslation = createSelector(
  getTranslationState,
  (state: TranslationState) => state.selectedTabIndex
);

export const getFileStatusTranslation = createSelector(
  getTranslationState,
  (state: TranslationState) =>
    state.translationFileInput
      ? new FileStatus(
          state.translationFileInput.file.name,
          state.translationFileInput.file.type,
          state.translationForFile.success
        )
      : undefined
);
