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
  setSelectedTabIndexTagging,
  setShowMoreTagsFile,
  setShowMoreTagsText
} from '..';
import { FileReplacement } from '../../../../shared/result/models/file-replacement.model';

describe('TaggingActions', () => {
  describe('Load Tags For Text Actions', () => {
    test('LoadTagsForText', () => {
      const text = 'test';
      const action = loadTagsForText({ text });

      expect(action).toEqual({
        text,
        type: '[Tagging] Load Tags Text'
      });
    });

    test('LoadTagsForTextSuccess', () => {
      const tags = ['1', '2'];
      const action = loadTagsForTextSuccess({ tags });

      expect(action).toEqual({
        tags,
        type: '[Tagging] Load Tags Text Success'
      });
    });

    test('LoadTagsForTextFailure', () => {
      const action = loadTagsForTextFailure();

      expect(action).toEqual({
        type: '[Tagging] Load Tags Text Failure'
      });
    });
  });

  describe('Load Tags For File Actions', () => {
    test('LoadTagsForFile', () => {
      const file: FileReplacement = {
        name: 'abc',
        type: 'xyz',
        content: [12, 13, 14, 15]
      };
      const action = loadTagsForFile({ file });

      expect(action).toEqual({
        file,
        type: '[Tagging] Load Tags File'
      });
    });

    test('LoadTagsForFileSuccess', () => {
      const tags = ['1', '2'];
      const action = loadTagsForFileSuccess({ tags });

      expect(action).toEqual({
        tags,
        type: '[Tagging] Load Tags File Success'
      });
    });

    test('LoadTagsForFileFailure', () => {
      const action = loadTagsForFileFailure();

      expect(action).toEqual({
        type: '[Tagging] Load Tags File Failure'
      });
    });
  });

  describe('Reset Tags Action', () => {
    test('ResetTags', () => {
      const action = resetTags();

      expect(action).toEqual({
        type: '[Tagging] Reset Tagging State to initialState'
      });
    });
  });

  describe('Set Show More Tags Actions', () => {
    test('SetShowMoreTagsText', () => {
      const showMoreTags = true;

      const action = setShowMoreTagsText({ showMoreTags });

      expect(action).toEqual({
        showMoreTags,
        type: '[Tagging] Set ShowMoreTags Text'
      });
    });

    test('SetShowMoreTagsFile', () => {
      const showMoreTags = true;

      const action = setShowMoreTagsFile({ showMoreTags });

      expect(action).toEqual({
        showMoreTags,
        type: '[Tagging] Set ShowMoreTags File'
      });
    });
  });

  describe('Remove Tag Actions', () => {
    test('RemoveTagForText', () => {
      const tag = 'abc';

      const action = removeTagForText({ tag });

      expect(action).toEqual({
        tag,
        type: '[Tagging] Remove Tag for Tags'
      });
    });

    test('RemoveTagForFile', () => {
      const tag = 'abc';

      const action = removeTagForFile({ tag });

      expect(action).toEqual({
        tag,
        type: '[Tagging] Remove Tag for File'
      });
    });
  });

  describe('Add Tag Actions', () => {
    test('AddTagForText', () => {
      const tag = 'abc';

      const action = addTagForText({ tag });

      expect(action).toEqual({
        tag,
        type: '[Tagging] Add Tag for Text'
      });
    });

    test('AddTagForFile', () => {
      const tag = 'abc';

      const action = addTagForFile({ tag });

      expect(action).toEqual({
        tag,
        type: '[Tagging] Add Tag for File'
      });
    });
  });

  describe('Set Selected Tab Index Action', () => {
    test('SetSelectedTabIndexTagging', () => {
      const selectedTabIndex = 0;

      const action = setSelectedTabIndexTagging({
        selectedTabIndex
      });

      expect(action).toEqual({
        selectedTabIndex,
        type: '[Tagging] Set SelectedTabIndex'
      });
    });
  });
});
