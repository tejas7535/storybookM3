import { TestBed } from '@angular/core/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import { APP_STATE_MOCK } from '../../../../../testing/mocks/shared/app-state.mock';
import { Language, TextInput } from '../../../../shared/result/models';
import { DataService } from '../../../../shared/result/services/data.service';
import {
  loadClassificationForText,
  loadClassificationForTextFailure,
  loadClassificationForTextSuccess,
  resetAll,
  resetClassifications,
} from '../../actions';
import { initialState } from '../../reducers/drei-d-master/drei-d-master.reducer';
import { ClassificationEffects } from './drei-d-master.effects';

describe('ClassificationEffects', () => {
  let action: any;
  let actions$: any;
  let store: any;
  let effects: ClassificationEffects;
  let dataService: DataService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ClassificationEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: DataService,
          useValue: {
            postTaggingText: jest.fn(),
            postTaggingFile: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(Store);
    effects = TestBed.inject(ClassificationEffects);
    dataService = TestBed.inject(DataService);
  });

  describe('loadClassificationText', () => {
    const textInput: TextInput = {
      text: 'abcd',
      textLang: Language.EN,
      targetLang: Language.DE,
    };
    beforeEach(() => {
      action = loadClassificationForText({ textInput });
    });
    test('should return loadClassifictionForTextSuccess', () => {
      const result = loadClassificationForTextSuccess({
        classification: APP_STATE_MOCK.dreiDMaster.classificationForText,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: APP_STATE_MOCK.dreiDMaster.classificationForText,
      });

      const expected = cold('--b', { b: result });

      dataService.postClassificationText = jest.fn(() => response);

      expect(effects.loadClassificationText$).toBeObservable(expected);
      expect(dataService.postClassificationText).toHaveBeenCalledTimes(1);
      expect(dataService.postClassificationText).toHaveBeenCalledWith(
        textInput
      );
    });

    test('should return loadClassificationForTextFailure', () => {
      const error = new Error('shit happened');
      const result = loadClassificationForTextFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      dataService.postClassificationText = jest.fn(() => response);

      expect(effects.loadClassificationText$).toBeObservable(expected);
      expect(dataService.postClassificationText).toHaveBeenCalledTimes(1);
      expect(dataService.postClassificationText).toHaveBeenCalledWith(
        textInput
      );
    });

    describe('resetAll', () => {
      test('should dispatch another action', () => {
        store.dispatch = jest.fn();
        actions$ = hot('-a', { a: resetAll() });
        effects.resetTags$.subscribe(() => {
          expect(store.dispatch).toHaveBeenCalledTimes(1);
          expect(store.dispatch).toHaveBeenCalledWith(resetClassifications());
        });
      });
    });
  });
});
