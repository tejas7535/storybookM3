import { TestBed } from '@angular/core/testing';

import { select, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';
import { Subscription } from 'rxjs';

import { BannerState, initialState } from './../reducers/banner.reducer';

import * as fromSelectors from './banner.selectors';

describe('BannerSelector', () => {
  let store: MockStore<AppState>;
  let sub: Subscription;
  let result: any;

  interface AppState {
    banner: BannerState;
  }

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: { banner: initialState } })]
    });
  });

  beforeEach(() => {
    store = TestBed.inject(Store) as MockStore<AppState>;
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
      expect(result).toEqual(initialState.showFullText);
    });

    it('should return type boolean', () => {
      expect(typeof result).toEqual(typeof initialState.showFullText);
    });
  });
});
