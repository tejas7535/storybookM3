import { createAction, props, union } from '@ngrx/store';

import { FileReplacement } from '../../../../shared/result/models';

export const loadTagsForText = createAction(
  '[Tagging] Load Tags Text',
  props<{ text: string }>()
);

export const loadTagsForTextSuccess = createAction(
  '[Tagging] Load Tags Text Success',
  props<{ tags: string[] }>()
);

export const loadTagsForTextFailure = createAction(
  '[Tagging] Load Tags Text Failure'
);

export const loadTagsForFile = createAction(
  '[Tagging] Load Tags File',
  props<{ file: FileReplacement }>()
);

export const loadTagsForFileSuccess = createAction(
  '[Tagging] Load Tags File Success',
  props<{ tags: string[] }>()
);

export const loadTagsForFileFailure = createAction(
  '[Tagging] Load Tags File Failure'
);

export const resetTags = createAction(
  '[Tagging] Reset Tagging State to initialState'
);

export const setShowMoreTagsText = createAction(
  '[Tagging] Set ShowMoreTags Text',
  props<{ showMoreTags: boolean }>()
);

export const setShowMoreTagsFile = createAction(
  '[Tagging] Set ShowMoreTags File',
  props<{ showMoreTags: boolean }>()
);

export const removeTagForText = createAction(
  '[Tagging] Remove Tag for Tags',
  props<{ tag: string }>()
);

export const removeTagForFile = createAction(
  '[Tagging] Remove Tag for File',
  props<{ tag: string }>()
);

export const addTagForText = createAction(
  '[Tagging] Add Tag for Text',
  props<{ tag: string }>()
);

export const addTagForFile = createAction(
  '[Tagging] Add Tag for File',
  props<{ tag: string }>()
);

export const setSelectedTabIndexTagging = createAction(
  '[Tagging] Set SelectedTabIndex',
  props<{ selectedTabIndex: number }>()
);

const all = union({
  loadTagsForText,
  loadTagsForTextSuccess,
  loadTagsForTextFailure,
  loadTagsForFile,
  loadTagsForFileSuccess,
  loadTagsForFileFailure,
  resetTags,
  setShowMoreTagsText,
  setShowMoreTagsFile,
  removeTagForText,
  removeTagForFile,
  addTagForText,
  addTagForFile,
  setSelectedTabIndexTagging,
});

export type TaggingActions = typeof all;
