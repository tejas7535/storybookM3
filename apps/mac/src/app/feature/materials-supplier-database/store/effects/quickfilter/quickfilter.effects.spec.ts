import { throwError } from 'rxjs';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles/jest';

import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import { MsdQuickFilterService } from '@mac/feature/materials-supplier-database/services';
import * as DataActions from '@mac/msd/store/actions/data/data.actions';
import * as QuickFilterActions from '@mac/msd/store/actions/quickfilter/quickfilter.actions';

import { QuickFilterEffects } from './quickfilter.effects';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

describe('QuickFilterEffects', () => {
  let action: any;
  let actions$: any;
  let effects: QuickFilterEffects;
  let spectator: SpectatorService<QuickFilterEffects>;
  let quickFilterService: MsdQuickFilterService;

  const createService = createServiceFactory({
    service: QuickFilterEffects,
    providers: [
      provideMockActions(() => actions$),
      mockProvider(MsdQuickFilterService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(QuickFilterEffects);
    quickFilterService = spectator.inject(MsdQuickFilterService);
  });

  describe('publishQuickFilter$', () => {
    it(
      'should dispatch publishQuickFilterSuccess',
      marbles((m) => {
        const quickFilter: QuickFilter = {
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
        };

        const publishedQuickFilter: QuickFilter = {
          ...quickFilter,
          id: 100,
          maintainerId: '00000000-0000-0000-0000-000000000000',
          maintainerName: 'tester',
          timestamp: 170_076_440_445,
        };

        action = QuickFilterActions.publishQuickFilter({ quickFilter });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: publishedQuickFilter });
        quickFilterService.createNewQuickFilter = jest.fn(() => response);

        const result = QuickFilterActions.publishQuickFilterSuccess({
          publishedQuickFilter,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.publishQuickFilter$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.createNewQuickFilter).toHaveBeenCalledWith(
          quickFilter
        );
      })
    );

    it(
      'should dispatch publishQuickFilterFailure and errorSnackBar',
      marbles((m) => {
        const quickFilter = {} as QuickFilter;

        action = QuickFilterActions.publishQuickFilter({ quickFilter });
        actions$ = m.hot('-a', { a: action });

        quickFilterService.createNewQuickFilter = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-(bc)', {
          b: DataActions.errorSnackBar({
            message: 'publish',
          }),
          c: QuickFilterActions.publishQuickFilterFailure(),
        });

        m.expect(effects.publishQuickFilter$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.createNewQuickFilter).toHaveBeenCalledWith(
          quickFilter
        );
      })
    );
  });

  describe('updateQuickFilter$', () => {
    it(
      'should dispatch updatePublicQuickFilterSuccess',
      marbles((m) => {
        const quickFilter: QuickFilter = {
          id: 100,
          materialClass: MaterialClass.STEEL,
          navigationLevel: NavigationLevel.MATERIAL,
          title: 'public updated',
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
        };

        const updatedQuickFilter: QuickFilter = {
          ...quickFilter,
          timestamp: 9999,
        };

        action = QuickFilterActions.updatePublicQuickFilter({ quickFilter });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: updatedQuickFilter });
        quickFilterService.updateQuickFilter = jest.fn(() => response);

        const result = QuickFilterActions.updatePublicQuickFilterSuccess({
          updatedQuickFilter,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.updatePublicQuickFilter$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.updateQuickFilter).toHaveBeenCalledWith(
          quickFilter
        );
      })
    );

    it(
      'should dispatch updatePublicQuickFilterFailure and errorSnackBar',
      marbles((m) => {
        const quickFilter = {} as QuickFilter;

        action = QuickFilterActions.updatePublicQuickFilter({ quickFilter });
        actions$ = m.hot('-a', { a: action });

        quickFilterService.updateQuickFilter = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-(bc)', {
          b: DataActions.errorSnackBar({
            message: 'update',
          }),
          c: QuickFilterActions.updatePublicQuickFilterFailure(),
        });

        m.expect(effects.updatePublicQuickFilter$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.updateQuickFilter).toHaveBeenCalledWith(
          quickFilter
        );
      })
    );
  });

  describe('fetchPublishedQuickFilters$', () => {
    it(
      'should dispatch fetchPublishedQuickFiltersSuccess',
      marbles((m) => {
        const publishedFilters = [{}, {}] as QuickFilter[];
        const materialClass = MaterialClass.STEEL;
        const navigationLevel = NavigationLevel.MATERIAL;

        action = QuickFilterActions.fetchPublishedQuickFilters({
          materialClass,
          navigationLevel,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: publishedFilters });
        quickFilterService.getPublishedQuickFilters = jest.fn(() => response);

        const result = QuickFilterActions.fetchPublishedQuickFiltersSuccess({
          publishedFilters,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchPublishedQuickFilters$).toBeObservable(expected);
        m.flush();
        expect(
          quickFilterService.getPublishedQuickFilters
        ).toHaveBeenCalledWith(materialClass, navigationLevel);
      })
    );

    it(
      'should dispatch fetchPublishedQuickFiltersFailure',
      marbles((m) => {
        const materialClass = MaterialClass.STEEL;
        const navigationLevel = NavigationLevel.MATERIAL;

        action = QuickFilterActions.fetchPublishedQuickFilters({
          materialClass,
          navigationLevel,
        });
        actions$ = m.hot('-a', { a: action });

        quickFilterService.getPublishedQuickFilters = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-b', {
          b: QuickFilterActions.fetchPublishedQuickFiltersFailure(),
        });

        m.expect(effects.fetchPublishedQuickFilters$).toBeObservable(expected);
        m.flush();
        expect(
          quickFilterService.getPublishedQuickFilters
        ).toHaveBeenCalledWith(materialClass, navigationLevel);
      })
    );
  });

  describe('fetchSubscribedQuickFilters$', () => {
    it(
      'should dispatch fetchSubscribedQuickFiltersSuccess',
      marbles((m) => {
        const subscribedFilters = [{}, {}] as QuickFilter[];
        const materialClass = MaterialClass.STEEL;
        const navigationLevel = NavigationLevel.MATERIAL;

        action = QuickFilterActions.fetchSubscribedQuickFilters({
          materialClass,
          navigationLevel,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: subscribedFilters });
        quickFilterService.getSubscribedQuickFilters = jest.fn(() => response);

        const result = QuickFilterActions.fetchSubscribedQuickFiltersSuccess({
          subscribedFilters,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchSubscribedQuickFilters$).toBeObservable(expected);
        m.flush();
        expect(
          quickFilterService.getSubscribedQuickFilters
        ).toHaveBeenCalledWith(materialClass, navigationLevel);
      })
    );

    it(
      'should dispatch fetchSubscribedQuickFiltersFailure',
      marbles((m) => {
        const materialClass = MaterialClass.STEEL;
        const navigationLevel = NavigationLevel.MATERIAL;

        action = QuickFilterActions.fetchSubscribedQuickFilters({
          materialClass,
          navigationLevel,
        });
        actions$ = m.hot('-a', { a: action });

        quickFilterService.getSubscribedQuickFilters = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-b', {
          b: QuickFilterActions.fetchSubscribedQuickFiltersFailure(),
        });

        m.expect(effects.fetchSubscribedQuickFilters$).toBeObservable(expected);
        m.flush();
        expect(
          quickFilterService.getSubscribedQuickFilters
        ).toHaveBeenCalledWith(materialClass, navigationLevel);
      })
    );
  });

  describe('deletePublishedQuickFilter$', () => {
    it(
      'should dispatch deletePublishedQuickFilterSuccess',
      marbles((m) => {
        const quickFilterId = 999;

        action = QuickFilterActions.deletePublishedQuickFilter({
          quickFilterId,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|');
        quickFilterService.deleteQuickFilter = jest.fn(() => response);

        const result = QuickFilterActions.deletePublishedQuickFilterSuccess({
          quickFilterId,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.deletePublishedQuickFilter$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.deleteQuickFilter).toHaveBeenCalledWith(
          quickFilterId
        );
      })
    );

    it(
      'should dispatch deletePublishedQuickFilterFailure and errorSnackBar',
      marbles((m) => {
        const quickFilterId = 999;

        action = QuickFilterActions.deletePublishedQuickFilter({
          quickFilterId,
        });
        actions$ = m.hot('-a', { a: action });

        quickFilterService.deleteQuickFilter = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-(bc)', {
          b: DataActions.errorSnackBar({
            message: 'delete',
          }),
          c: QuickFilterActions.deletePublishedQuickFilterFailure(),
        });

        m.expect(effects.deletePublishedQuickFilter$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.deleteQuickFilter).toHaveBeenCalledWith(
          quickFilterId
        );
      })
    );
  });

  describe('subscribeQuickFilter$', () => {
    it(
      'should dispatch subscribeQuickFilterSuccess',
      marbles((m) => {
        const quickFilter = {
          id: 100,
        } as QuickFilter;

        action = QuickFilterActions.subscribeQuickFilter({ quickFilter });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|');
        quickFilterService.subscribeQuickFilter = jest.fn(() => response);

        const result = QuickFilterActions.subscribeQuickFilterSuccess({
          subscribedQuickFilter: quickFilter,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.subscribeQuickFilter$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.subscribeQuickFilter).toHaveBeenCalledWith(
          quickFilter.id
        );
      })
    );

    it(
      'should dispatch subscribeQuickFilterFailure and errorSnackBar',
      marbles((m) => {
        const quickFilter = { id: 555 } as QuickFilter;

        action = QuickFilterActions.subscribeQuickFilter({ quickFilter });
        actions$ = m.hot('-a', { a: action });

        quickFilterService.subscribeQuickFilter = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-(bc)', {
          b: DataActions.errorSnackBar({
            message: 'subscribe',
          }),
          c: QuickFilterActions.subscribeQuickFilterFailure(),
        });

        m.expect(effects.subscribeQuickFilter$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.subscribeQuickFilter).toHaveBeenCalledWith(
          quickFilter.id
        );
      })
    );
  });

  describe('unsubscribeQuickFilter$', () => {
    it(
      'should dispatch unsubscribeQuickFilterSuccess',
      marbles((m) => {
        const quickFilterId = 999;

        action = QuickFilterActions.unsubscribeQuickFilter({
          quickFilterId,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|');
        quickFilterService.unsubscribeQuickFilter = jest.fn(() => response);

        const result = QuickFilterActions.unsubscribeQuickFilterSuccess({
          quickFilterId,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.unsubscribeQuickFilter$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.unsubscribeQuickFilter).toHaveBeenCalledWith(
          quickFilterId
        );
      })
    );

    it(
      'should dispatch unsubscribeQuickFilterFailure and errorSnackBar',
      marbles((m) => {
        const quickFilterId = 999;

        action = QuickFilterActions.unsubscribeQuickFilter({
          quickFilterId,
        });
        actions$ = m.hot('-a', { a: action });

        quickFilterService.unsubscribeQuickFilter = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-(bc)', {
          b: DataActions.errorSnackBar({
            message: 'unsubscribe',
          }),
          c: QuickFilterActions.unsubscribeQuickFilterFailure(),
        });

        m.expect(effects.unsubscribeQuickFilter$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.unsubscribeQuickFilter).toHaveBeenCalledWith(
          quickFilterId
        );
      })
    );
  });

  describe('enableQuickFilterNotification$', () => {
    it(
      'should dispatch enableQuickFilterNotificationSuccess',
      marbles((m) => {
        const quickFilterId = 100;
        const isSubscribedQuickFilter = false;

        action = QuickFilterActions.enableQuickFilterNotification({
          quickFilterId,
          isSubscribedQuickFilter,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|');
        quickFilterService.enableQuickFilterNotification = jest.fn(
          () => response
        );

        const result = QuickFilterActions.enableQuickFilterNotificationSuccess({
          quickFilterId,
          isSubscribedQuickFilter,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.enableQuickFilterNotification$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          quickFilterService.enableQuickFilterNotification
        ).toHaveBeenCalledWith(quickFilterId);
      })
    );

    it(
      'should dispatch enableQuickFilterNotificationFailure and errorSnackBar',
      marbles((m) => {
        const quickFilterId = 55;

        action = QuickFilterActions.enableQuickFilterNotification({
          quickFilterId,
          isSubscribedQuickFilter: false,
        });
        actions$ = m.hot('-a', { a: action });

        quickFilterService.enableQuickFilterNotification = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-(bc)', {
          b: DataActions.errorSnackBar({
            message: 'enableNotification',
          }),
          c: QuickFilterActions.enableQuickFilterNotificationFailure(),
        });

        m.expect(effects.enableQuickFilterNotification$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          quickFilterService.enableQuickFilterNotification
        ).toHaveBeenCalledWith(quickFilterId);
      })
    );
  });

  describe('disableQuickFilterNotification$', () => {
    it(
      'should dispatch disableQuickFilterNotificationSuccess',
      marbles((m) => {
        const quickFilterId = 100;
        const isSubscribedQuickFilter = false;

        action = QuickFilterActions.disableQuickFilterNotification({
          quickFilterId,
          isSubscribedQuickFilter,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|');
        quickFilterService.disableQuickFilterNotification = jest.fn(
          () => response
        );

        const result = QuickFilterActions.disableQuickFilterNotificationSuccess(
          {
            quickFilterId,
            isSubscribedQuickFilter,
          }
        );
        const expected = m.cold('--b', { b: result });

        m.expect(effects.disableQuickFilterNotification$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          quickFilterService.disableQuickFilterNotification
        ).toHaveBeenCalledWith(quickFilterId);
      })
    );

    it(
      'should dispatch disableQuickFilterNotificationFailure and errorSnackBar',
      marbles((m) => {
        const quickFilterId = 55;

        action = QuickFilterActions.disableQuickFilterNotification({
          quickFilterId,
          isSubscribedQuickFilter: false,
        });
        actions$ = m.hot('-a', { a: action });

        quickFilterService.disableQuickFilterNotification = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-(bc)', {
          b: DataActions.errorSnackBar({
            message: 'disableNotification',
          }),
          c: QuickFilterActions.disableQuickFilterNotificationFailure(),
        });

        m.expect(effects.disableQuickFilterNotification$).toBeObservable(
          expected
        );
        m.flush();
        expect(
          quickFilterService.disableQuickFilterNotification
        ).toHaveBeenCalledWith(quickFilterId);
      })
    );
  });

  describe('queryQuickFilters$', () => {
    it(
      'should dispatch queryQuickFiltersSuccess',
      marbles((m) => {
        const materialClass = MaterialClass.CERAMIC;
        const navigationLevel = NavigationLevel.MATERIAL;
        const searchExpression = 'test';
        const queriedFilters = [{}, {}] as QuickFilter[];

        action = QuickFilterActions.queryQuickFilters({
          materialClass,
          navigationLevel,
          searchExpression,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: queriedFilters });
        quickFilterService.queryQuickFilters = jest.fn(() => response);

        const result = QuickFilterActions.queryQuickFiltersSuccess({
          queriedFilters,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.queryQuickFilters$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.queryQuickFilters).toHaveBeenCalledWith(
          materialClass,
          navigationLevel,
          10,
          searchExpression
        );
      })
    );

    it(
      'should dispatch queryQuickFiltersFailure',
      marbles((m) => {
        const materialClass = MaterialClass.CERAMIC;
        const navigationLevel = NavigationLevel.MATERIAL;
        const searchExpression = 'test';

        action = QuickFilterActions.queryQuickFilters({
          materialClass,
          navigationLevel,
          searchExpression,
        });
        actions$ = m.hot('-a', { a: action });

        quickFilterService.queryQuickFilters = jest
          .fn()
          .mockReturnValue(throwError(() => 'error'));

        const expected = m.cold('-b', {
          b: QuickFilterActions.queryQuickFiltersFailure(),
        });

        m.expect(effects.queryQuickFilters$).toBeObservable(expected);
        m.flush();
        expect(quickFilterService.queryQuickFilters).toHaveBeenCalledWith(
          materialClass,
          navigationLevel,
          10,
          searchExpression
        );
      })
    );
  });
});
