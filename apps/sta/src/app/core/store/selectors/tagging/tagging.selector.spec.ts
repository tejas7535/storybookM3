import { TestBed } from '@angular/core/testing';

import { select, Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';

import { TAGGING_STATE_MOCK } from '../../../../../testing/mocks/tagging/tagging-values.mock';
import { FileStatus } from '../../../../shared/file-upload/file-status.model';
import {
  loadTagsForFile,
  loadTagsForFileSuccess,
  loadTagsForText,
  loadTagsForTextSuccess,
  setShowMoreTagsFile,
  setShowMoreTagsText,
} from '../../actions/tagging/tagging.actions';
import * as fromRoot from '../../reducers';
import { tags14, tags15, tags20 } from './mock-tags';
import {
  getFileStatusTagging,
  getLoadingTagsForFile,
  getLoadingTagsForText,
  getSelectedTabIndexTagging,
  getShowMoreTagsForFile,
  getShowMoreTagsForText,
  getTagsForFile,
  getTagsForText,
  getTextInputTagging,
} from './tagging.selector';

describe('TaggingSelector', () => {
  let store: Store<fromRoot.AppState>;
  let sub: any;
  let result: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {
            ...fromRoot.reducers,
          },
          {
            runtimeChecks: {
              strictStateSerializability: true,
              strictActionSerializability: true,
            },
          }
        ),
      ],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
    result = undefined;
  });

  afterEach(() => {
    if (sub) {
      sub.unsubscribe();
      sub = undefined;
    }
  });

  describe('getTextInputTagging', () => {
    beforeEach(() => {
      store
        .pipe(select(getTextInputTagging))
        .subscribe((value) => (result = value));
    });

    test('should return undefined when state is not defined', () => {
      expect(result).toBeUndefined();
    });

    test('should return textInput', () => {
      const textInput = TAGGING_STATE_MOCK.textInput;
      store.dispatch(loadTagsForText({ text: textInput }));

      expect(result).toEqual(textInput);
    });
  });

  describe('getTagsForText', () => {
    beforeEach(() => {
      store.pipe(select(getTagsForText)).subscribe((value) => (result = value));
    });

    test('should return undefined tags when state is not defined', () => {
      expect(result.tags).toBeUndefined();
    });

    test('should return 15 tags when showMoreTags is false', () => {
      const expected = {
        loading: false,
        showMoreTags: false,
        tags: tags15,
      };
      store.dispatch(setShowMoreTagsText({ showMoreTags: false }));
      store.dispatch(loadTagsForTextSuccess({ tags: tags20 }));

      expect(result).toEqual(expected);
    });

    test('should return all tags when showMoreTags is true', () => {
      const expected = {
        loading: false,
        showMoreTags: true,
        tags: tags20,
      };
      store.dispatch(setShowMoreTagsText({ showMoreTags: true }));
      store.dispatch(loadTagsForTextSuccess({ tags: tags20 }));

      expect(result).toEqual(expected);
    });
  });

  describe('getTagsForFile', () => {
    beforeEach(() => {
      store.pipe(select(getTagsForFile)).subscribe((value) => (result = value));
    });

    test('should return undefined tags when state is not defined', () => {
      expect(result.tags).toBeUndefined();
    });

    test('should return 15 tags when showMoreTags is false', () => {
      const expected = {
        loading: false,
        showMoreTags: false,
        tags: tags15,
        success: true,
      };
      store.dispatch(setShowMoreTagsFile({ showMoreTags: false }));
      store.dispatch(loadTagsForFileSuccess({ tags: tags20 }));

      expect(result).toEqual(expected);
    });

    test('should return all tags when showMoreTags is true', () => {
      const expected = {
        loading: false,
        showMoreTags: true,
        tags: tags20,
        success: true,
      };
      store.dispatch(setShowMoreTagsFile({ showMoreTags: true }));
      store.dispatch(loadTagsForFileSuccess({ tags: tags20 }));

      expect(result).toEqual(expected);
    });
  });

  describe('getLoadingTagsForText', () => {
    test('should return false on initialState', () => {
      store
        .pipe(select(getLoadingTagsForText))
        .subscribe((value) => (result = value));
      expect(result).toBeFalsy();
    });
  });

  describe('getLoadingTagsForFile', () => {
    test('should return false on initialState', () => {
      store
        .pipe(select(getLoadingTagsForFile))
        .subscribe((value) => (result = value));
      expect(result).toBeFalsy();
    });
  });

  describe('getShowMoreTagsForText', () => {
    beforeEach(() => {
      store
        .pipe(select(getShowMoreTagsForText))
        .subscribe((value) => (result = value));
    });

    test('should return undefined on initialState (tags undefined)', () => {
      expect(result).toBeUndefined();
    });

    test('should return true when tags length < 15', () => {
      store.dispatch(loadTagsForTextSuccess({ tags: tags14 }));
      expect(result).toBeTruthy();
    });

    test('should return true when tags length === 15', () => {
      store.dispatch(loadTagsForTextSuccess({ tags: tags15 }));
      expect(result).toBeTruthy();
    });

    test('should return state.tagsForText.showMoreTags (false on initialState) when tags length > 15', () => {
      store.dispatch(loadTagsForTextSuccess({ tags: tags20 }));
      expect(result).toBeFalsy();
    });
  });

  describe('getShowMoreTagsForFile', () => {
    beforeEach(() => {
      store
        .pipe(select(getShowMoreTagsForFile))
        .subscribe((value) => (result = value));
    });

    test('should return undefined on initialState (tags undefined)', () => {
      expect(result).toBeUndefined();
    });

    test('should return true when tags length < 15', () => {
      store.dispatch(loadTagsForFileSuccess({ tags: tags14 }));
      expect(result).toBeTruthy();
    });

    test('should return true when tags length === 15', () => {
      store.dispatch(loadTagsForFileSuccess({ tags: tags15 }));
      expect(result).toBeTruthy();
    });

    test('should return state.tagsForFile.showMoreTags (false on initialState) when tags length > 15', () => {
      store.dispatch(loadTagsForFileSuccess({ tags: tags20 }));
      expect(result).toBeFalsy();
    });
  });

  describe('getSelectedTabIndexTagging', () => {
    test('should return 0 on initialState', () => {
      store
        .pipe(select(getSelectedTabIndexTagging))
        .subscribe((value) => (result = value));
      expect(result).toEqual(0);
    });
  });

  describe('getFileStatusTagging', () => {
    beforeEach(() => {
      store
        .pipe(select(getFileStatusTagging))
        .subscribe((value) => (result = value));
    });

    test('should return undefined when state is not defined', () => {
      expect(result).toBeUndefined();
    });

    test('should return fileStatus when loading (success = undefined)', () => {
      const fileInput = TAGGING_STATE_MOCK.fileInput;
      store.dispatch(loadTagsForFile({ file: fileInput }));

      const expected: FileStatus = {
        fileName: fileInput.name,
        fileType: fileInput.type,
        success: undefined,
      };
      expect(result).toEqual(expected);
    });

    test('should return fileStatus when loading successful (success = true)', () => {
      const fileInput = TAGGING_STATE_MOCK.fileInput;
      store.dispatch(loadTagsForFile({ file: fileInput }));
      const tags = ['1'];
      store.dispatch(loadTagsForFileSuccess({ tags }));

      const expected: FileStatus = {
        fileName: fileInput.name,
        fileType: fileInput.type,
        success: true,
      };
      expect(result).toEqual(expected);
    });
  });
});
