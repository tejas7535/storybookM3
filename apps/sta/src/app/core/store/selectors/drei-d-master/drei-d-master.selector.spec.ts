import { TestBed } from '@angular/core/testing';

import { select, Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';

import {
  loadClassificationForText,
  loadClassificationForTextSuccess,
} from '../..';
import { DREI_D_MASTER_STATE_MOCK } from '../../../../../testing/mocks/drei-d-master/drei-d-master-values.mock';
import * as fromRoot from '../../reducers';
import {
  getClassificationForText,
  getClassificationTextInput,
} from './drei-d-master.selector';

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

  describe('getClassificationTextInput', () => {
    beforeEach(() => {
      store
        .pipe(select(getClassificationTextInput))
        .subscribe((value) => (result = value));
    });

    test('should return undefined when state is not defined', () => {
      expect(result).toBeUndefined();
    });

    test('should return classificationTextInput', () => {
      const textInput = DREI_D_MASTER_STATE_MOCK.classificationTextInput;
      store.dispatch(loadClassificationForText({ textInput }));

      expect(result).toEqual(textInput);
    });
  });

  describe('getClassificationForText', () => {
    beforeEach(() => {
      store
        .pipe(select(getClassificationForText))
        .subscribe((value) => (result = value));
    });

    test('should return undefined when state is not defined', () => {
      expect(result).toBeUndefined();
    });

    test('should return classificationForText', () => {
      const classification = DREI_D_MASTER_STATE_MOCK.classificationForText;
      store.dispatch(loadClassificationForTextSuccess({ classification }));

      expect(result).toEqual(classification);
    });
  });
});
