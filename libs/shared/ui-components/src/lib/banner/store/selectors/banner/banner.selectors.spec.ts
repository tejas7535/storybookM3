import { TestBed } from '@angular/core/testing';

import { select, Store, StoreModule } from '@ngrx/store';

import { configureTestSuite } from 'ng-bullet';

import { initialState } from '../../reducers/banner/banner.reducer';
import {
  bannerReducer,
  BannerState
} from './../../reducers/banner/banner.reducer';

import * as fromSelectors from '../../selectors';

describe('BannerSelector', () => {
  let store: Store<AppState>;
  let sub;
  let result;

  interface AppState {
    banner: BannerState;
  }

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: true,
              strictActionImmutability: true,
              strictStateSerializability: true,
              strictActionSerializability: false
            }
          }
        ),
        StoreModule.forFeature('banner', bannerReducer)
      ]
    });
  });

  beforeEach(() => {
    store = TestBed.get(Store);
    jest.spyOn(store, 'dispatch');
    result = undefined;
  });

  afterEach(() => {
    if (sub) {
      sub.unsubscribe();
      sub = undefined;
    }
  });

  describe('#getBannerOpen', () => {
    beforeEach(() => {
      store
        .pipe(select(fromSelectors.getBannerOpen))
        .subscribe(value => (result = value));
    });

    it('should return false when state is not defined', () => {
      expect(result).toEqual(initialState.open);
    });

    it('should return type boolean', () => {
      expect(typeof result).toEqual(typeof initialState.open);
    });
  });

  describe('#getBannerText', () => {
    beforeEach(() => {
      store
        .pipe(select(fromSelectors.getBannerText))
        .subscribe(value => (result = value));
    });

    it('should return false when state is not defined', () => {
      expect(result).toEqual(initialState.text);
    });

    it('should return type string', () => {
      expect(typeof result).toEqual(typeof initialState.text);
    });
  });

  describe('#getBannerButtonText', () => {
    beforeEach(() => {
      store
        .pipe(select(fromSelectors.getBannerButtonText))
        .subscribe(value => (result = value));
    });

    it('should return false when state is not defined', () => {
      expect(result).toEqual(initialState.buttonText);
    });

    it('should return type string', () => {
      expect(typeof result).toEqual(typeof initialState.buttonText);
    });
  });

  describe('#getBannerTruncateSize', () => {
    beforeEach(() => {
      store
        .pipe(select(fromSelectors.getBannerTruncateSize))
        .subscribe(value => (result = value));
    });

    it('should return false when state is not defined', () => {
      expect(result).toEqual(initialState.truncateSize);
    });

    it('should return type number', () => {
      expect(typeof result).toEqual(typeof initialState.truncateSize);
    });
  });

  describe('#getBannerIsFullTextShown', () => {
    beforeEach(() => {
      store
        .pipe(select(fromSelectors.getBannerIsFullTextShown))
        .subscribe(value => (result = value));
    });

    it('should return false when state is not defined', () => {
      expect(result).toEqual(initialState.isFullTextShown);
    });

    it('should return type boolean', () => {
      expect(typeof result).toEqual(typeof initialState.isFullTextShown);
    });
  });

  describe('#getBannerUrl', () => {
    beforeEach(() => {
      store
        .pipe(select(fromSelectors.getBannerUrl))
        .subscribe(value => (result = value));
    });

    it('should return false when state is not defined', () => {
      expect(result).toEqual(initialState.url);
    });

    it('should return type string or undefined', () => {
      expect(typeof result).toEqual(typeof initialState.url);
    });
  });
});
