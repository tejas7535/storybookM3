import { Action, createReducer, on } from '@ngrx/store';

import { TagsForFileInput } from './models/tags-for-file-input.model';
import { TagsForTextInput } from './models/tags-for-text-input.model';

import { FileReplacement } from '../../../../shared/result/models';
import {
  addTagForFile,
  addTagForText,
  loadTagsForFile,
  loadTagsForFileFailure,
  loadTagsForFileSuccess,
  loadTagsForText,
  loadTagsForTextFailure,
  loadTagsForTextSuccess,
  removeTagForFile,
  removeTagForText,
  resetTags,
  setSelectedTabIndex,
  setShowMoreTagsFile,
  setShowMoreTagsText
} from '../../actions/tagging/tagging.actions';

export interface TaggingState {
  textInput: string;
  fileInput: FileReplacement;
  tagsForText: TagsForTextInput;
  tagsForFile: TagsForFileInput;
  selectedTabIndex: number;
}

export const initialState: TaggingState = {
  textInput: undefined,
  fileInput: undefined,
  tagsForText: {
    tags: undefined,
    showMoreTags: false,
    loading: false
  },
  tagsForFile: {
    tags: undefined,
    showMoreTags: false,
    loading: false,
    success: undefined
  },
  selectedTabIndex: 0
};

export const taggingReducer = createReducer(
  initialState,
  on(loadTagsForText, (state: TaggingState, { text }) => ({
    ...state,
    textInput: text,
    tagsForText: {
      ...state.tagsForText,
      showMoreTags: false,
      loading: true
    }
  })),
  on(loadTagsForFile, (state: TaggingState, { file }) => ({
    ...state,
    fileInput: {
      name: file.name,
      type: file.type,
      content: file.content
    },
    tagsForFile: {
      ...state.tagsForFile,
      showMoreTags: false,
      loading: true,
      success: undefined
    }
  })),
  on(loadTagsForTextFailure, (state: TaggingState) => ({
    ...state,
    tagsForText: {
      ...state.tagsForText,
      loading: false
    }
  })),
  on(loadTagsForFileFailure, (state: TaggingState) => ({
    ...state,
    tagsForFile: {
      ...state.tagsForFile,
      loading: false,
      success: false
    }
  })),
  on(loadTagsForTextSuccess, (state: TaggingState, { tags }) => ({
    ...state,
    tagsForText: {
      ...state.tagsForText,
      tags,
      loading: false
    }
  })),
  on(loadTagsForFileSuccess, (state: TaggingState, { tags }) => ({
    ...state,
    tagsForFile: {
      ...state.tagsForFile,
      tags,
      loading: false,
      success: true
    }
  })),
  on(resetTags, (state: TaggingState) => ({
    ...initialState,
    selectedTabIndex: state.selectedTabIndex
  })),
  on(setSelectedTabIndex, (state: TaggingState, { selectedTabIndex }) => ({
    ...state,
    selectedTabIndex
  })),
  on(setShowMoreTagsText, (state: TaggingState, { showMoreTags }) => ({
    ...state,
    tagsForText: {
      ...state.tagsForText,
      showMoreTags
    }
  })),
  on(setShowMoreTagsFile, (state: TaggingState, { showMoreTags }) => ({
    ...state,
    tagsForFile: {
      ...state.tagsForFile,
      showMoreTags
    }
  })),
  on(removeTagForText, (state: TaggingState, { tag }) => ({
    ...state,
    tagsForText: {
      ...state.tagsForText,
      tags: state.tagsForText.tags.filter(el => el !== tag)
    }
  })),
  on(removeTagForFile, (state: TaggingState, { tag }) => ({
    ...state,
    tagsForFile: {
      ...state.tagsForFile,
      tags: state.tagsForFile.tags.filter(el => el !== tag)
    }
  })),
  on(addTagForText, (state: TaggingState, { tag }) => ({
    ...state,
    tagsForText: {
      ...state.tagsForText,
      tags: [...state.tagsForText.tags, tag]
    }
  })),
  on(addTagForFile, (state: TaggingState, { tag }) => ({
    ...state,
    tagsForFile: {
      ...state.tagsForFile,
      tags: [...state.tagsForFile.tags, tag]
    }
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: TaggingState, action: Action): TaggingState {
  return taggingReducer(state, action);
}
