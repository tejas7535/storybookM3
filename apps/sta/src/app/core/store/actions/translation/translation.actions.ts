import { createAction, props, union } from '@ngrx/store';

import { TextInput } from '../../../../shared/result/models/text-input.model';
import { TranslationFileInput } from '../../reducers/translation/models/translation-file-input.model';

export const loadTranslationForText = createAction(
  '[Translation] Load Translation for Text',
  props<{ textInput: TextInput }>()
);

export const loadTranslationForTextSuccess = createAction(
  '[Translation] Load Translation for Text Success',
  props<{ translation: string }>()
);

export const loadTranslationForTextFailure = createAction(
  '[Translation] Load Translation for Text Failure'
);

export const loadTranslationForFile = createAction(
  '[Translation] Load Translation for File',
  props<{ fileInput: TranslationFileInput }>()
);

export const loadTranslationForFileSuccess = createAction(
  '[Translation] Load Translation for File Success',
  props<{ translation: string }>()
);

export const loadTranslationForFileFailure = createAction(
  '[Translation] Load Translation for File Failure'
);

export const resetTranslation = createAction(
  '[Translation] Reset Translation State to initialState'
);

export const setSelectedTabIndexTranslation = createAction(
  '[Translation] Set SelectedTabIndex',
  props<{ selectedTabIndex: number }>()
);

const all = union({
  loadTranslationForText,
  loadTranslationForTextSuccess,
  loadTranslationForTextFailure,
  loadTranslationForFile,
  loadTranslationForFileSuccess,
  loadTranslationForFileFailure,
  resetTranslation,
  setSelectedTabIndexTranslation
});

export type TranslationActions = typeof all;
