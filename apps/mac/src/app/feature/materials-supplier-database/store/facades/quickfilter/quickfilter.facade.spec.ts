import { SpectatorService } from '@ngneat/spectator';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { QuickFilter } from '@mac/msd/models';
import { initialState } from '@mac/msd/store/reducers/quickfilter/quickfilter.reducer';

import { QuickFilterFacade } from './quickfilter.facade';

describe('QuickfilterFacade', () => {
  let spectator: SpectatorService<QuickFilterFacade>;
  let facade: QuickFilterFacade;
  let store: MockStore;

  const filter: QuickFilter[] = [
    { title: 'test', custom: true, columns: ['1'], filter: {} },
  ];

  const createService = createServiceFactory({
    service: QuickFilterFacade,
    providers: [
      provideMockStore({
        initialState: {
          msd: {
            quickfilter: {
              ...initialState,
              customFilters: filter,
            },
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(facade).toBeDefined();
  });

  describe('materialClassOptions$', () => {
    it(
      'should provide material class options',
      marbles((m) => {
        const expected = m.cold('a', {
          a: filter,
        });

        m.expect(facade.quickFilter$).toBeObservable(expected);
      })
    );
  });
  describe('dispatch', () => {
    it('should dispatch each action', () => {
      store.dispatch = jest.fn();
      facade.dispatch({ type: 'mock action' });

      expect(store.dispatch).toHaveBeenCalledWith({ type: 'mock action' });
    });
  });
});
