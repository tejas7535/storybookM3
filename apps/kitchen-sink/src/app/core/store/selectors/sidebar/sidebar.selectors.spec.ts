import { TestBed } from '@angular/core/testing';

import { Subscription } from 'rxjs';

import { select, Store, StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';

import * as fromRoot from '../../reducers';
import { initialState } from '../../reducers/sidebar/sidebar.reducer';
import * as fromSelectors from '../../selectors';

describe('SidebarSelector', () => {
  let store: Store<fromRoot.AppState>;
  let sub: Subscription;
  let result: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {
            ...fromRoot.reducers
          },
          {
            runtimeChecks: {
              strictStateSerializability: true,
              strictActionSerializability: true
            }
          }
        )
      ]
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

  describe('#getSidebarMode', () => {
    beforeEach(() => {
      store
        .pipe(select(fromSelectors.getSidebarMode))
        .subscribe(value => (result = value));
    });

    it('should return undefined when state is not defined', () => {
      expect(result).toEqual(initialState.mode);
    });

    it('should return type string', () => {
      expect(typeof result).toEqual(typeof initialState.mode);
    });

    it('should return the compound username fetchUserSuccess Action', () => {
      expect(result).toEqual(initialState.mode);
    });
  });
});
