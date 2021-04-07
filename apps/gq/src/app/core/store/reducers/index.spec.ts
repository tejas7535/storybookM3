import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot } from '@angular/router';

import * as fromRoot from '.';

describe('NGRX Store Reducer Index', () => {
  test('should define the reducers object', () => {
    expect(fromRoot.reducers).toBeDefined();
    expect(fromRoot.reducers.router).toBeDefined();
  });

  test('should define feature selectors', () => {
    expect(fromRoot.getRouterState).toBeDefined();
  });

  describe('CustomSerializer', () => {
    describe('serialize', () => {
      let state: RouterStateSnapshot;
      const firstChildParams = { params: ['id', 'name', 'sortBy'] };
      beforeEach(() =>
        TestBed.configureTestingModule({
          providers: [
            {
              provide: RouterStateSnapshot,
              useValue: {
                url: 'nirvana',
                root: {
                  queryParams: '',
                  firstChild: firstChildParams,
                },
              },
            },
          ],
        })
      );

      beforeEach(() => {
        state = TestBed.inject(RouterStateSnapshot);
      });

      test('should return object with certain attributes', () => {
        const serializer = new fromRoot.CustomSerializer();
        const routerStateUrl = serializer.serialize(state);

        expect('url' in routerStateUrl).toBeTruthy();
        expect('queryParams' in routerStateUrl).toBeTruthy();
        expect('params' in routerStateUrl).toBeTruthy();
      });

      test('should return firstChild as current state', () => {
        const serializer = new fromRoot.CustomSerializer();
        const routerStateUrl = serializer.serialize(state);

        expect(routerStateUrl.params).toEqual(firstChildParams.params);
      });
    });
  });
});
