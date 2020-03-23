import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { DataService } from '../../../../shared/result/services/data.service';

import { APP_STATE_MOCK } from '../../../../../testing/mocks/shared/app-state.mock';
import {
  loadTagsForFile,
  loadTagsForFileFailure,
  loadTagsForFileSuccess,
  loadTagsForText,
  loadTagsForTextFailure,
  loadTagsForTextSuccess,
  resetAll,
  resetTags
} from '../../actions';
import { initialState } from '../../reducers/tagging/tagging.reducer';
import { TaggingEffects } from './tagging.effects';

describe('TaggingEffects', () => {
  let action: any;
  let actions$: any;
  let store: any;
  let effects: TaggingEffects;
  let dataService: DataService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        TaggingEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: DataService,
          useValue: {
            postTaggingText: jest.fn(),
            postTaggingFile: jest.fn()
          }
        }
      ]
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(Store);
    effects = TestBed.inject(TaggingEffects);
    dataService = TestBed.inject(DataService);
  });

  describe('loadTagsText', () => {
    beforeEach(() => {
      action = loadTagsForText({ text: APP_STATE_MOCK.tagging.textInput });
    });

    test('should return loadTagsForTextSuccess action with tags', () => {
      const result = loadTagsForTextSuccess({
        tags: APP_STATE_MOCK.tagging.tagsForText.tags
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: APP_STATE_MOCK.tagging.tagsForText.tags
      });
      const expected = cold('--b', { b: result });

      dataService.postTaggingText = jest.fn(() => response);

      expect(effects.loadTagsText$).toBeObservable(expected);
      expect(dataService.postTaggingText).toHaveBeenCalledTimes(1);
      expect(dataService.postTaggingText).toHaveBeenCalledWith(
        APP_STATE_MOCK.tagging.textInput
      );
    });

    test('should return loadTagsForTextFailure', () => {
      const error = new Error('shit happened');
      const result = loadTagsForTextFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      dataService.postTaggingText = jest.fn(() => response);

      expect(effects.loadTagsText$).toBeObservable(expected);
      expect(dataService.postTaggingText).toHaveBeenCalledTimes(1);
      expect(dataService.postTaggingText).toHaveBeenCalledWith(
        APP_STATE_MOCK.tagging.textInput
      );
    });
  });

  describe('loadTagsFile', () => {
    beforeEach(() => {
      action = loadTagsForFile({ file: APP_STATE_MOCK.tagging.fileInput });
    });

    test('should return loadTagsForFileSuccess action with tags', () => {
      const result = loadTagsForFileSuccess({
        tags: APP_STATE_MOCK.tagging.tagsForFile.tags
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: APP_STATE_MOCK.tagging.tagsForFile.tags
      });
      const expected = cold('--b', { b: result });

      dataService.postTaggingFile = jest.fn(() => response);

      expect(effects.loadTagsFile$).toBeObservable(expected);
      expect(dataService.postTaggingFile).toHaveBeenCalledTimes(1);
      expect(dataService.postTaggingFile).toHaveBeenCalledWith(
        APP_STATE_MOCK.tagging.fileInput
      );
    });

    test('should return loadTagsForFileFailure', () => {
      const error = new Error('shit happened');
      const result = loadTagsForFileFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      dataService.postTaggingFile = jest.fn(() => response);

      expect(effects.loadTagsFile$).toBeObservable(expected);
      expect(dataService.postTaggingFile).toHaveBeenCalledTimes(1);
      expect(dataService.postTaggingFile).toHaveBeenCalledWith(
        APP_STATE_MOCK.tagging.fileInput
      );
    });
  });

  describe('resetAll', () => {
    test('should dispatch another action', () => {
      store.dispatch = jest.fn();
      actions$ = hot('-a', { a: resetAll() });
      effects.resetTags$.subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(resetTags());
      });
    });
  });
});
