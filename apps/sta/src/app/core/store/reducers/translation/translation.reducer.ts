import { Action, createReducer, on } from '@ngrx/store';

import { Language } from '../../../../shared/result/models/language.enum';
import { TextInput } from '../../../../shared/result/models/text-input.model';
import { setSelectedTabIndexTranslation } from '../../actions';
import {
  loadTranslationForFile,
  loadTranslationForFileFailure,
  loadTranslationForFileSuccess,
  loadTranslationForText,
  loadTranslationForTextFailure,
  loadTranslationForTextSuccess,
  resetTranslation,
} from '../../actions/translation/translation.actions';
import { TranslationFileInput } from './models/translation-file-input.model';
import { TranslationForFileInput } from './models/translation-for-file-input.model';
import { TranslationForTextInput } from './models/translation-for-text-input.model';

export interface TranslationState {
  translationTextInput: TextInput;
  translationFileInput: TranslationFileInput;
  translationForText: TranslationForTextInput;
  translationForFile: TranslationForFileInput;
  selectedTabIndex: number;
}

export const initialState: TranslationState = {
  translationTextInput: undefined,
  translationFileInput: undefined,
  translationForText: {
    translation: undefined,
    loading: false,
  },
  translationForFile: {
    translation: undefined,
    loading: false,
    success: undefined,
  },
  selectedTabIndex: 0,
};

export const translationReducer = createReducer(
  initialState,
  on(loadTranslationForText, (state: TranslationState, { textInput }) => ({
    ...state,
    translationTextInput: {
      text: textInput.text,
      textLang: textInput.textLang ? textInput.textLang : Language.EN,
      targetLang: textInput.targetLang ? textInput.targetLang : Language.DE,
    },
    translationForText: {
      ...state.translationForText,
      loading: true,
    },
  })),
  on(loadTranslationForFile, (state: TranslationState, { fileInput }) => ({
    ...state,
    translationFileInput: {
      file: fileInput.file,
      textLang: fileInput.textLang ? fileInput.textLang : Language.EN,
      targetLang: fileInput.targetLang ? fileInput.targetLang : Language.DE,
    },
    translationForFile: {
      ...state.translationForFile,
      loading: true,
      success: undefined,
    },
  })),
  on(loadTranslationForTextFailure, (state: TranslationState) => ({
    ...state,
    translationForText: {
      ...state.translationForText,
      loading: false,
    },
  })),
  on(loadTranslationForFileFailure, (state: TranslationState) => ({
    ...state,
    translationForFile: {
      ...state.translationForFile,
      loading: false,
      success: false,
    },
  })),
  on(
    loadTranslationForTextSuccess,
    (state: TranslationState, { translation }) => ({
      ...state,
      translationForText: {
        ...state.translationForText,
        translation,
        loading: false,
      },
    })
  ),
  on(
    loadTranslationForFileSuccess,
    (state: TranslationState, { translation }) => ({
      ...state,
      translationForFile: {
        ...state.translationForFile,
        translation,
        loading: false,
        success: true,
      },
    })
  ),
  on(resetTranslation, (state: TranslationState) => ({
    ...initialState,
    selectedTabIndex: state.selectedTabIndex,
  })),
  on(
    setSelectedTabIndexTranslation,
    (state: TranslationState, { selectedTabIndex }) => ({
      ...state,
      selectedTabIndex,
    })
  )
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(
  state: TranslationState,
  action: Action
): TranslationState {
  return translationReducer(state, action);
}
