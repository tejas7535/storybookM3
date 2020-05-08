import { TestBed } from '@angular/core/testing';

import { Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { SidebarMode } from '../../models';
import { initialState, SidebarState } from '../reducers';
import { getSidebarMode } from './sidebar.selectors';

describe('SidebarSelector', () => {
  let store: MockStore<SidebarState>;
  let sub: Subscription;
  let result: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { sidebar: initialState } }),
      ],
    });
  });

  beforeEach(() => {
    store = TestBed.inject(Store) as MockStore<SidebarState>;
    jest.spyOn(store, 'dispatch');
    result = undefined;
  });

  afterEach(() => {
    if (sub) {
      sub.unsubscribe();
      sub = undefined;
    }
  });

  describe('#getSidebarMode', () => {
    beforeEach(() => {
      store.pipe(select(getSidebarMode)).subscribe((value) => (result = value));
    });

    it('should return sidebar mode of initial state', () => {
      expect(result).toEqual(SidebarMode.Open);
    });
  });
});
