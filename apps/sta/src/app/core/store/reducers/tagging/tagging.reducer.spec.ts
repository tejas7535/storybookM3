import { TAGGING_STATE_MOCK } from '../../../../../testing/mocks/tagging/tagging-values.mock';
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
import { initialState, reducer, taggingReducer } from './tagging.reducer';

describe('Tagging Reducer', () => {
  describe('LoadTagsForText', () => {
    test('should set the text, showMoreTags and loading', () => {
      const action = loadTagsForText({ text: TAGGING_STATE_MOCK.textInput });
      const state = taggingReducer(initialState, action);

      expect(state.textInput).toEqual(TAGGING_STATE_MOCK.textInput);
    });
  });

  describe('LoadTagsForFile', () => {
    test('should set the text, showMoreTags and loading', () => {
      const action = loadTagsForFile({ file: TAGGING_STATE_MOCK.fileInput });
      const state = taggingReducer(initialState, action);

      expect(state.fileInput).toEqual(TAGGING_STATE_MOCK.fileInput);
    });
  });

  describe('LoadTagsForTextFailure', () => {
    test('should set loading', () => {
      const action = loadTagsForTextFailure();
      const state = taggingReducer(initialState, action);

      expect(state.tagsForText.loading).toBeFalsy();
    });
  });

  describe('LoadTagsForFileFailure', () => {
    test('should set loading and success', () => {
      const action = loadTagsForFileFailure();
      const state = taggingReducer(initialState, action);

      expect(state.tagsForFile.loading).toBeFalsy();
      expect(state.tagsForFile.success).toBeFalsy();
    });
  });

  describe('LoadTagsForTextSucces', () => {
    test('should set tags and loading', () => {
      const action = loadTagsForTextSuccess({
        tags: TAGGING_STATE_MOCK.tagsForText.tags
      });
      const state = taggingReducer(initialState, action);

      expect(state.tagsForText.tags).toEqual(
        TAGGING_STATE_MOCK.tagsForText.tags
      );
      expect(state.tagsForText.loading).toBeFalsy();
    });
  });

  describe('LoadTagsForFileSucces', () => {
    test('should set tags, loading and success', () => {
      const action = loadTagsForFileSuccess({
        tags: TAGGING_STATE_MOCK.tagsForFile.tags
      });
      const state = taggingReducer(initialState, action);

      expect(state.tagsForFile.tags).toEqual(
        TAGGING_STATE_MOCK.tagsForFile.tags
      );
      expect(state.tagsForFile.loading).toBeFalsy();
      expect(state.tagsForFile.success).toBeTruthy();
    });
  });

  describe('ResetTags', () => {
    test('should reset state to initialstate except selectedTabIndex', () => {
      const action = resetTags();
      const state = taggingReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('SetSelectedTabIndex', () => {
    test('should set selectedTabIndex', () => {
      const action = setSelectedTabIndex({
        selectedTabIndex: TAGGING_STATE_MOCK.selectedTabIndex
      });
      const state = taggingReducer(initialState, action);

      expect(state.selectedTabIndex).toEqual(
        TAGGING_STATE_MOCK.selectedTabIndex
      );
    });
  });

  describe('SetShowMoreTagsText', () => {
    test('should set showMoreTags', () => {
      const action = setShowMoreTagsText({ showMoreTags: true });
      const state = taggingReducer(initialState, action);

      expect(state.tagsForText.showMoreTags).toBeTruthy();
    });
  });

  describe('SetShowMoreTagsFile', () => {
    test('should set showMoreTags', () => {
      const action = setShowMoreTagsFile({ showMoreTags: true });
      const state = taggingReducer(initialState, action);

      expect(state.tagsForFile.showMoreTags).toBeTruthy();
    });
  });

  describe('RemoveTagForText', () => {
    test('should remove given tag', () => {
      const initTags = ['1', '2'];
      const removeTag = '2';
      const expectedTags = ['1'];
      let state = taggingReducer(
        initialState,
        loadTagsForTextSuccess({ tags: initTags })
      );

      const action = removeTagForText({ tag: removeTag });
      state = taggingReducer(state, action);

      expect(state.tagsForText.tags).toEqual(expectedTags);
    });
  });

  describe('RemoveTagForFile', () => {
    test('should remove given tag', () => {
      const initTags = ['1', '2'];
      const removeTag = '2';
      const expectedTags = ['1'];
      let state = taggingReducer(
        initialState,
        loadTagsForFileSuccess({ tags: initTags })
      );

      const action = removeTagForFile({ tag: removeTag });
      state = taggingReducer(state, action);

      expect(state.tagsForFile.tags).toEqual(expectedTags);
    });
  });

  describe('AddTagForText', () => {
    test('should add tag', () => {
      const initTags = ['1'];
      const addTag = '2';
      const expectedTags = ['1', '2'];
      let state = taggingReducer(
        initialState,
        loadTagsForTextSuccess({ tags: initTags })
      );

      const action = addTagForText({ tag: addTag });
      state = taggingReducer(state, action);

      expect(state.tagsForText.tags).toEqual(expectedTags);
    });
  });

  describe('AddTagForFile', () => {
    test('should add tag', () => {
      const initTags = ['1'];
      const addTag = '2';
      const expectedTags = ['1', '2'];
      let state = taggingReducer(
        initialState,
        loadTagsForFileSuccess({ tags: initTags })
      );

      const action = addTagForFile({ tag: addTag });
      state = taggingReducer(state, action);

      expect(state.tagsForFile.tags).toEqual(expectedTags);
    });
  });

  describe('Reducer function', () => {
    test('should return taggingReducer', () => {
      const action = loadTagsForText({ text: TAGGING_STATE_MOCK.textInput });
      expect(reducer(initialState, action)).toEqual(
        taggingReducer(initialState, action)
      );
    });
  });
});
