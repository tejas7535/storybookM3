import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import { QuickFilter } from '@mac/msd/models';
import * as QuickFilterActions from '@mac/msd/store/actions/quickfilter';
import { initialState } from '@mac/msd/store/reducers/quickfilter/quickfilter.reducer';

import { QuickFilterFacade } from './quickfilter.facade';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

describe('QuickfilterFacade', () => {
  let spectator: SpectatorService<QuickFilterFacade>;
  let facade: QuickFilterFacade;
  let store: MockStore;
  let actions$: Actions;

  const localFilters: QuickFilter[] = [
    { title: 'test', columns: ['1'], filter: {} },
  ];
  const publishedFilters: QuickFilter[] = [
    {
      id: 100,
      materialClass: MaterialClass.STEEL,
      navigationLevel: NavigationLevel.MATERIAL,
      title: 'public 1',
      description: 'test public filter',
      filter: {
        co2PerTon: {
          filterType: 'number',
          type: 'greaterThan',
          filter: 5,
        },
      },
      columns: ['action', 'history'],
      maintainerId: '00000000-0000-0000-0000-000000000000',
      maintainerName: 'tester',
      timestamp: 170_076_440_445,
    },
  ];

  const subscribedFilters: QuickFilter[] = [
    {
      id: 333,
      materialClass: MaterialClass.STEEL,
      navigationLevel: NavigationLevel.MATERIAL,
      title: 'subscribed 1',
      description: 'test public filter',
      filter: {
        co2PerTon: {
          filterType: 'number',
          type: 'greaterThan',
          filter: 5,
        },
      },
      columns: ['action', 'history'],
      maintainerId: '00000000-0000-0000-2222-000000000000',
      maintainerName: 'another tester',
      timestamp: 2555,
    },
  ];

  const queriedFilters: QuickFilter[] = [
    {
      id: 666,
      materialClass: MaterialClass.SAP_MATERIAL,
      navigationLevel: NavigationLevel.MATERIAL,
      title: 'queried 1',
      description: 'test public filter',
      filter: {
        co2PerTon: {
          filterType: 'number',
          type: 'greaterThan',
          filter: 5,
        },
      },
      columns: ['action', 'history'],
      maintainerId: '00000000-0000-1111-2222-000000000000',
      maintainerName: 'another tester 2',
      timestamp: 2222,
    },
  ];

  const createService = createServiceFactory({
    service: QuickFilterFacade,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          msd: {
            quickfilter: {
              ...initialState,
              localFilters,
              publishedFilters,
              subscribedFilters,
              queriedFilters,
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
    actions$ = spectator.inject(Actions);

    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(facade).toBeDefined();
  });

  it(
    'should provide local quick filters',
    marbles((m) => {
      const expected = m.cold('a', {
        a: localFilters,
      });

      m.expect(facade.localQuickFilters$).toBeObservable(expected);
    })
  );

  it(
    'should provide published quick filters',
    marbles((m) => {
      const expected = m.cold('a', {
        a: publishedFilters,
      });

      m.expect(facade.publishedQuickFilters$).toBeObservable(expected);
    })
  );

  it(
    'should provide own quick filters',
    marbles((m) => {
      const expected = m.cold('a', {
        a: [...localFilters, ...publishedFilters],
      });

      m.expect(facade.ownQuickFilters$).toBeObservable(expected);
    })
  );

  it(
    'should provide subscribed quick filters',
    marbles((m) => {
      const expected = m.cold('a', {
        a: subscribedFilters,
      });

      m.expect(facade.subscribedQuickFilters$).toBeObservable(expected);
    })
  );

  it(
    'should provide queried quick filters',
    marbles((m) => {
      const expected = m.cold('a', {
        a: queriedFilters,
      });

      m.expect(facade.queriedQuickFilters$).toBeObservable(expected);
    })
  );

  it(
    'should provide isLoading',
    marbles((m) => {
      const expected = m.cold('a', {
        a: false,
      });

      m.expect(facade.isLoading$).toBeObservable(expected);
    })
  );

  it(
    'publish quick filter should succeed',
    marbles((m) => {
      const action = QuickFilterActions.publishQuickFilterSuccess({
        publishedQuickFilter: queriedFilters[0],
      });

      const expected = m.cold('b', {
        b: action,
      });

      actions$ = m.hot('a', { a: action });

      m.expect(facade.publishQuickFilterSucceeded$).toBeObservable(expected);
    })
  );

  it(
    'update quick filter should succeed',
    marbles((m) => {
      const action = QuickFilterActions.updatePublicQuickFilterSuccess({
        updatedQuickFilter: queriedFilters[0],
      });

      const expected = m.cold('b', {
        b: action,
      });

      actions$ = m.hot('a', { a: action });

      m.expect(facade.updatePublicQuickFilterSucceeded$).toBeObservable(
        expected
      );
    })
  );

  it(
    'should activate quick filter',
    marbles((m) => {
      const action = QuickFilterActions.activateQuickFilter({
        quickFilter: queriedFilters[0],
      });

      const expected = m.cold('b', {
        b: action,
      });

      actions$ = m.hot('a', { a: action });

      m.expect(facade.quickFilterActivated$).toBeObservable(expected);
    })
  );

  it('should setLocalQuickFilters', () => {
    facade.setLocalQuickFilters(localFilters);

    expect(store.dispatch).toHaveBeenCalledWith(
      QuickFilterActions.setLocalQuickFilters({ localFilters })
    );
  });

  describe('createQuickFilter', () => {
    it('should create a local quick filter', () => {
      facade.createQuickFilter(localFilters[0]);

      expect(store.dispatch).toHaveBeenCalledWith(
        QuickFilterActions.addLocalQuickFilter({ localFilter: localFilters[0] })
      );
    });

    it('should create a public quick filter', () => {
      facade.createQuickFilter(publishedFilters[0]);

      expect(store.dispatch).toHaveBeenCalledWith(
        QuickFilterActions.publishQuickFilter({
          quickFilter: publishedFilters[0],
        })
      );
    });
  });

  it('should update a local quick filter', () => {
    const oldFilter = localFilters[0];
    const newFilter = { ...localFilters[0], columns: ['a', 'b', 'z'] };

    facade.updateLocalQuickFilter(oldFilter, newFilter);

    expect(store.dispatch).toHaveBeenCalledWith(
      QuickFilterActions.updateLocalQuickFilter({ oldFilter, newFilter })
    );
  });

  describe('updatePublicQuickFilter', () => {
    it('should update a public quick filter', () => {
      const newFilter = { ...publishedFilters[0], columns: ['a', 'b', 'z'] };

      facade.updatePublicQuickFilter(newFilter, of(true));

      expect(store.dispatch).toHaveBeenCalledWith(
        QuickFilterActions.updatePublicQuickFilter({
          quickFilter: newFilter,
        })
      );
    });

    it('should not update a public quick filter if user does not have the EDITOR role', () => {
      const newFilter = { ...publishedFilters[0], columns: ['a', 'b', 'z'] };

      facade.updatePublicQuickFilter(newFilter, of(false));

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('updateQuickFilter', () => {
    beforeEach(() => jest.resetAllMocks());

    it('should update a public quick filter', () => {
      const oldFilter = publishedFilters[0];
      const newFilter = { ...publishedFilters[0], columns: ['a', 'b', 'z'] };
      const hasEditorRole$ = of(true);

      facade.updatePublicQuickFilter = jest.fn();
      facade.updateLocalQuickFilter = jest.fn();

      facade.updateQuickFilter(oldFilter, newFilter, hasEditorRole$);

      expect(facade.updatePublicQuickFilter).toHaveBeenCalledWith(
        newFilter,
        hasEditorRole$
      );
      expect(facade.updateLocalQuickFilter).not.toHaveBeenCalled();
    });

    it('should update a local quick filter', () => {
      const oldFilter = localFilters[0];
      const newFilter = { ...localFilters[0], columns: ['a', 'b', 'z'] };
      const hasEditorRole$ = of(true);

      facade.updatePublicQuickFilter = jest.fn();
      facade.updateLocalQuickFilter = jest.fn();

      facade.updateQuickFilter(oldFilter, newFilter, hasEditorRole$);

      expect(facade.updateLocalQuickFilter).toHaveBeenCalledWith(
        oldFilter,
        newFilter
      );
      expect(facade.updatePublicQuickFilter).not.toHaveBeenCalled();
    });
  });

  describe('deleteQuickFilter', () => {
    it('should delete a local filter', () => {
      facade.deleteQuickFilter(localFilters[0]);

      expect(store.dispatch).toHaveBeenCalledWith(
        QuickFilterActions.removeLocalQuickFilter({
          localFilter: localFilters[0],
        })
      );
    });

    it('should delete a public filter', () => {
      facade.deleteQuickFilter(publishedFilters[0]);

      expect(store.dispatch).toHaveBeenCalledWith(
        QuickFilterActions.deletePublishedQuickFilter({
          quickFilterId: publishedFilters[0].id,
        })
      );
    });
  });

  it('should fetchPublishedQuickFilters', () => {
    const materialClass = MaterialClass.CERAMIC;
    const navigationLevel = NavigationLevel.STANDARD;

    facade.fetchPublishedQuickFilters(materialClass, navigationLevel);

    expect(store.dispatch).toHaveBeenCalledWith(
      QuickFilterActions.fetchPublishedQuickFilters({
        materialClass,
        navigationLevel,
      })
    );
  });

  it('should fetchSubscribedQuickFilters', () => {
    const materialClass = MaterialClass.SAP_MATERIAL;
    const navigationLevel = NavigationLevel.MATERIAL;

    facade.fetchSubscribedQuickFilters(materialClass, navigationLevel);

    expect(store.dispatch).toHaveBeenCalledWith(
      QuickFilterActions.fetchSubscribedQuickFilters({
        materialClass,
        navigationLevel,
      })
    );
  });

  it('should subscribeQuickFilter', () => {
    facade.subscribeQuickFilter(queriedFilters[0]);

    expect(store.dispatch).toHaveBeenCalledWith(
      QuickFilterActions.subscribeQuickFilter({
        quickFilter: queriedFilters[0],
      })
    );
  });

  it('should unsubscribeQuickFilter', () => {
    const quickFilterId = 555;

    facade.unsubscribeQuickFilter(quickFilterId);

    expect(store.dispatch).toHaveBeenCalledWith(
      QuickFilterActions.unsubscribeQuickFilter({ quickFilterId })
    );
  });

  it('should enableQuickFilterNotification', () => {
    facade.enableQuickFilterNotification(queriedFilters[0].id, false);

    expect(store.dispatch).toHaveBeenCalledWith(
      QuickFilterActions.enableQuickFilterNotification({
        quickFilterId: queriedFilters[0].id,
        isSubscribedQuickFilter: false,
      })
    );
  });

  it('should disableQuickFilterNotification', () => {
    facade.disableQuickFilterNotification(queriedFilters[0].id, true);

    expect(store.dispatch).toHaveBeenCalledWith(
      QuickFilterActions.disableQuickFilterNotification({
        quickFilterId: queriedFilters[0].id,
        isSubscribedQuickFilter: true,
      })
    );
  });

  it('should queryQuickFilters', () => {
    const materialClass = MaterialClass.COPPER;
    const navigationLevel = NavigationLevel.SUPPLIER;
    const searchExpression = 'test';

    facade.queryQuickFilters(materialClass, navigationLevel, searchExpression);

    expect(store.dispatch).toHaveBeenCalledWith(
      QuickFilterActions.queryQuickFilters({
        materialClass,
        navigationLevel,
        searchExpression,
      })
    );
  });

  it('should resetQueriedQuickFilters', () => {
    facade.resetQueriedQuickFilters();

    expect(store.dispatch).toHaveBeenCalledWith(
      QuickFilterActions.resetQueriedQuickFilters()
    );
  });

  it('should activateQuickFilter', () => {
    facade.activateQuickFilter(publishedFilters[0]);

    expect(store.dispatch).toHaveBeenCalledWith(
      QuickFilterActions.activateQuickFilter({
        quickFilter: publishedFilters[0],
      })
    );
  });
});
