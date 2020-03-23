import { createSelector } from '@ngrx/store';

import { FileStatus } from '../../../../shared/file-upload/file-status.model';
import { getTaggingState } from '../../reducers';
import { TaggingState } from '../../reducers/tagging/tagging.reducer';

const MIN_TAGS = 15;

export const getTextInput = createSelector(
  getTaggingState,
  (state: TaggingState) => {
    return state.textInput;
  }
);

export const getFileInput = createSelector(
  getTaggingState,
  (state: TaggingState) => {
    return state.fileInput;
  }
);

export const getTagsForText = createSelector(
  getTaggingState,
  (state: TaggingState) => {
    return {
      ...state.tagsForText,
      tags: state.tagsForText.showMoreTags
        ? state.tagsForText.tags
        : state.tagsForText.tags?.slice(0, MIN_TAGS)
    };
  }
);

export const getTagsForFile = createSelector(
  getTaggingState,
  (state: TaggingState) => {
    return {
      ...state.tagsForFile,
      tags: state.tagsForFile.showMoreTags
        ? state.tagsForFile.tags
        : state.tagsForFile.tags?.slice(0, MIN_TAGS)
    };
  }
);

export const getLoadingTagsForText = createSelector(
  getTaggingState,
  (state: TaggingState) => state.tagsForText.loading
);

export const getLoadingTagsForFile = createSelector(
  getTaggingState,
  (state: TaggingState) => state.tagsForFile.loading
);

export const getShowMoreTagsForText = createSelector(
  getTaggingState,
  (state: TaggingState) => {
    if (state.tagsForText.tags) {
      return state.tagsForText.tags.length <= MIN_TAGS
        ? true
        : state.tagsForText.showMoreTags;
    }

    return undefined;
  }
);

export const getShowMoreTagsForFile = createSelector(
  getTaggingState,
  (state: TaggingState) => {
    if (state.tagsForFile.tags) {
      return state.tagsForFile.tags.length <= MIN_TAGS
        ? true
        : state.tagsForFile.showMoreTags;
    }

    return undefined;
  }
);

export const getSelectedTabIndexTagging = createSelector(
  getTaggingState,
  (state: TaggingState) => state.selectedTabIndex
);

export const getFileStatus = createSelector(
  getTaggingState,
  (state: TaggingState) =>
    state.fileInput
      ? new FileStatus(
          state.fileInput.name,
          state.fileInput.type,
          state.tagsForFile.success
        )
      : undefined
);
