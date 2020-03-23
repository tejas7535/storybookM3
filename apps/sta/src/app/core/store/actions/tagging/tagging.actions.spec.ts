import { FileReplacement } from '../../../../shared/result/models/file-replacement.model';

import * as fromTaggingActions from './tagging.actions';

describe('TaggingActions', () => {
  describe('Load Tags For Text Actions', () => {
    test('LoadTagsForText', () => {
      const text = 'test';
      const action = fromTaggingActions.loadTagsForText({ text });

      expect(action).toEqual({
        text,
        type: '[Tagging] Load Tags Text'
      });
    });

    test('LoadTagsForTextSuccess', () => {
      const tags = ['1', '2'];
      const action = fromTaggingActions.loadTagsForTextSuccess({ tags });

      expect(action).toEqual({
        tags,
        type: '[Tagging] Load Tags Text Success'
      });
    });

    test('LoadTagsForTextFailure', () => {
      const action = fromTaggingActions.loadTagsForTextFailure();

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
      const action = fromTaggingActions.loadTagsForFile({ file });

      expect(action).toEqual({
        file,
        type: '[Tagging] Load Tags File'
      });
    });

    test('LoadTagsForFileSuccess', () => {
      const tags = ['1', '2'];
      const action = fromTaggingActions.loadTagsForFileSuccess({ tags });

      expect(action).toEqual({
        tags,
        type: '[Tagging] Load Tags File Success'
      });
    });

    test('LoadTagsForFileFailure', () => {
      const action = fromTaggingActions.loadTagsForFileFailure();

      expect(action).toEqual({
        type: '[Tagging] Load Tags File Failure'
      });
    });
  });

  describe('Reset Tags Action', () => {
    test('ResetTags', () => {
      const action = fromTaggingActions.resetTags();

      expect(action).toEqual({
        type: '[Tagging] Reset Tagging State to initialState'
      });
    });
  });

  describe('Set Show More Tags Actions', () => {
    test('SetShowMoreTagsText', () => {
      const showMoreTags = true;

      const action = fromTaggingActions.setShowMoreTagsText({ showMoreTags });

      expect(action).toEqual({
        showMoreTags,
        type: '[Tagging] Set ShowMoreTags Text'
      });
    });

    test('SetShowMoreTagsFile', () => {
      const showMoreTags = true;

      const action = fromTaggingActions.setShowMoreTagsFile({ showMoreTags });

      expect(action).toEqual({
        showMoreTags,
        type: '[Tagging] Set ShowMoreTags File'
      });
    });
  });

  describe('Remove Tag Actions', () => {
    test('RemoveTagForText', () => {
      const tag = 'abc';

      const action = fromTaggingActions.removeTagForText({ tag });

      expect(action).toEqual({
        tag,
        type: '[Tagging] Remove Tag for Tags'
      });
    });

    test('RemoveTagForFile', () => {
      const tag = 'abc';

      const action = fromTaggingActions.removeTagForFile({ tag });

      expect(action).toEqual({
        tag,
        type: '[Tagging] Remove Tag for File'
      });
    });
  });

  describe('Add Tag Actions', () => {
    test('AddTagForText', () => {
      const tag = 'abc';

      const action = fromTaggingActions.addTagForText({ tag });

      expect(action).toEqual({
        tag,
        type: '[Tagging] Add Tag for Text'
      });
    });

    test('AddTagForFile', () => {
      const tag = 'abc';

      const action = fromTaggingActions.addTagForFile({ tag });

      expect(action).toEqual({
        tag,
        type: '[Tagging] Add Tag for File'
      });
    });
  });

  describe('Set Selected Tab Index Action', () => {
    test('SetSelectedTabIndex', () => {
      const selectedTabIndex = 0;

      const action = fromTaggingActions.setSelectedTabIndex({
        selectedTabIndex
      });

      expect(action).toEqual({
        selectedTabIndex,
        type: '[Tagging] Set SelectedTabIndex'
      });
    });
  });
});
