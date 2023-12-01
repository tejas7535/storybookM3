import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import * as QuickfilterActions from '@mac/msd/store/actions/quickfilter';

import {
  initialState,
  quickFilterReducer,
  QuickFilterState,
} from './quickfilter.reducer';

describe('quickfilterReducer', () => {
  const quickfilter: QuickFilter = {
    title: 'title',
    columns: ['1', '2'],
    filter: {},
  };
  const second: QuickFilter = {
    title: 'second',
    columns: [],
    filter: {},
  };
  describe('reducer', () => {
    let state: QuickFilterState;

    beforeEach(() => {
      state = initialState;
    });

    it('should return initial state', () => {
      const action: any = {};
      const newState = quickFilterReducer(undefined, action);

      expect(newState).toEqual(initialState);
    });

    it('should add a local quickfilter', () => {
      const action = QuickfilterActions.addLocalQuickFilter({
        localFilter: quickfilter,
      });
      const newState = quickFilterReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        localFilters: [quickfilter],
      });
    });

    it('should set initial list of local quickfilters', () => {
      const action = QuickfilterActions.setLocalQuickFilters({
        localFilters: [quickfilter],
      });
      const newState = quickFilterReducer(state, action);

      expect(newState).toEqual({
        ...initialState,
        localFilters: [quickfilter],
      });
    });

    it('should remove a local quickfilter', () => {
      const action = QuickfilterActions.removeLocalQuickFilter({
        localFilter: quickfilter,
      });
      const newState = quickFilterReducer(
        {
          ...state,
          localFilters: [quickfilter, second],
        },
        action
      );

      expect(newState).toEqual({
        ...initialState,
        localFilters: [second],
      });
    });

    it('should update a local quickfilter', () => {
      const action = QuickfilterActions.updateLocalQuickFilter({
        oldFilter: second,
        newFilter: quickfilter,
      });
      const newState = quickFilterReducer(
        {
          ...state,
          localFilters: [second],
        },
        action
      );

      expect(newState).toEqual({
        ...initialState,
        localFilters: [quickfilter],
      });
    });

    describe('publishQuickFilter', () => {
      it('should set isLoading to true on publishQuickFilter', () => {
        const action = QuickfilterActions.publishQuickFilter({
          quickFilter: quickfilter,
        });
        const newState = quickFilterReducer(
          {
            ...state,
            isLoading: false,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          isLoading: true,
        });
      });

      it('should set published filter on publishQuickFilterSuccess', () => {
        const action = QuickfilterActions.publishQuickFilterSuccess({
          publishedQuickFilter: second,
        });
        const newState = quickFilterReducer(
          {
            ...state,
            publishedFilters: [quickfilter],
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          publishedFilters: [quickfilter, second],
          isLoading: false,
        });
      });

      it('should set isLoading to false on publishQuickFilterFailure', () => {
        const action = QuickfilterActions.publishQuickFilterFailure();
        const newState = quickFilterReducer(
          {
            ...state,
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          isLoading: false,
        });
      });
    });

    describe('updatePublicQuickFilter', () => {
      it('should set isLoading to true on updatePublicQuickFilter', () => {
        const action = QuickfilterActions.updatePublicQuickFilter({
          quickFilter: quickfilter,
        });
        const newState = quickFilterReducer(
          {
            ...state,
            isLoading: false,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          isLoading: true,
        });
      });

      it('should replace quickfilter on updatePublicQuickFilterSuccess', () => {
        const publishedFilters = [
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
          {
            id: 200,
            materialClass: MaterialClass.STEEL,
            navigationLevel: NavigationLevel.MATERIAL,
            title: 'public 3',
            description: 'test public filter 2',
            filter: {
              co2PerTon: {
                filterType: 'number',
                type: 'greaterThan',
                filter: 2,
              },
            },
            columns: ['action', 'history'],
            maintainerId: '00000000-0000-0000-0000-000000000000',
            maintainerName: 'tester',
            timestamp: 333_076_440_445,
          },
        ];

        const updatedQuickFilter = {
          ...publishedFilters[0],
          description: 'public filter updated',
        };

        const action = QuickfilterActions.updatePublicQuickFilterSuccess({
          updatedQuickFilter,
        });
        const newState = quickFilterReducer(
          {
            ...state,
            publishedFilters,
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          publishedFilters: [updatedQuickFilter, publishedFilters[1]],
          isLoading: false,
        });
      });

      it('should set isLoading to false on updatePublicQuickFilterFailure', () => {
        const action = QuickfilterActions.updatePublicQuickFilterFailure();
        const newState = quickFilterReducer(
          {
            ...state,
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          isLoading: false,
        });
      });
    });

    describe('fetchPublishedQuickFilters', () => {
      it('should set arePublishedFiltersLoading to true and reset publishedFilters on fetchPublishedQuickFilters', () => {
        const action = QuickfilterActions.fetchPublishedQuickFilters({
          materialClass: MaterialClass.STEEL,
          navigationLevel: NavigationLevel.MATERIAL,
        });
        const newState = quickFilterReducer(
          {
            ...state,
            publishedFilters: [quickfilter, second],
            arePublishedFiltersLoading: false,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          publishedFilters: [],
          arePublishedFiltersLoading: true,
        });
      });

      it('should set published filters on fetchPublishedQuickFiltersSuccess', () => {
        const action = QuickfilterActions.fetchPublishedQuickFiltersSuccess({
          publishedFilters: [second, quickfilter],
        });
        const newState = quickFilterReducer(
          {
            ...state,
            publishedFilters: [],
            arePublishedFiltersLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          publishedFilters: [second, quickfilter],
          arePublishedFiltersLoading: false,
        });
      });

      it('should set arePublishedFiltersLoading to false on fetchPublishedQuickFiltersFailure', () => {
        const action = QuickfilterActions.fetchPublishedQuickFiltersFailure();
        const newState = quickFilterReducer(
          {
            ...state,
            arePublishedFiltersLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          arePublishedFiltersLoading: false,
        });
      });
    });

    describe('fetchSubscribedQuickFilters', () => {
      it('should set areSubscribedFiltersLoading to true and reset subscribedFilters on fetchSubscribedQuickFilters', () => {
        const action = QuickfilterActions.fetchSubscribedQuickFilters({
          materialClass: MaterialClass.STEEL,
          navigationLevel: NavigationLevel.MATERIAL,
        });
        const newState = quickFilterReducer(
          {
            ...state,
            subscribedFilters: [quickfilter, second],
            areSubscribedFiltersLoading: false,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          subscribedFilters: [],
          areSubscribedFiltersLoading: true,
        });
      });

      it('should set subscribed filters on fetchSubscribedQuickFiltersSuccess', () => {
        const action = QuickfilterActions.fetchSubscribedQuickFiltersSuccess({
          subscribedFilters: [second, quickfilter],
        });
        const newState = quickFilterReducer(
          {
            ...state,
            subscribedFilters: [],
            areSubscribedFiltersLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          subscribedFilters: [second, quickfilter],
          areSubscribedFiltersLoading: false,
        });
      });

      it('should set arePublishedFiltersLoading to false on fetchSubscribedQuickFiltersFailure', () => {
        const action = QuickfilterActions.fetchSubscribedQuickFiltersFailure();
        const newState = quickFilterReducer(
          {
            ...state,
            areSubscribedFiltersLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          areSubscribedFiltersLoading: false,
        });
      });
    });

    describe('deletePublishedQuickFilter', () => {
      it('should set isLoading to true on deletePublishedQuickFilter', () => {
        const action = QuickfilterActions.deletePublishedQuickFilter({
          quickFilterId: 999,
        });
        const newState = quickFilterReducer(
          {
            ...state,
            isLoading: false,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          isLoading: true,
        });
      });

      it('should set isLoading to false and remove deleted filter on deletePublishedQuickFilterSuccess', () => {
        const publishedFilters = [
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
          {
            id: 200,
            materialClass: MaterialClass.STEEL,
            navigationLevel: NavigationLevel.MATERIAL,
            title: 'public 3',
            description: 'test public filter 2',
            filter: {
              co2PerTon: {
                filterType: 'number',
                type: 'greaterThan',
                filter: 2,
              },
            },
            columns: ['action', 'history'],
            maintainerId: '00000000-0000-0000-0000-000000000000',
            maintainerName: 'tester',
            timestamp: 333_076_440_445,
          },
        ];
        const action = QuickfilterActions.deletePublishedQuickFilterSuccess({
          quickFilterId: 100,
        });
        const newState = quickFilterReducer(
          {
            ...state,
            publishedFilters,
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          publishedFilters: [publishedFilters[1]],
          isLoading: false,
        });
      });

      it('should set isLoading to false on deletePublishedQuickFilterFailure', () => {
        const action = QuickfilterActions.deletePublishedQuickFilterFailure();
        const newState = quickFilterReducer(
          {
            ...state,
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          isLoading: false,
        });
      });
    });

    describe('subscribeQuickFilter', () => {
      it('should set isLoading to true on subscribeQuickFilter', () => {
        const action = QuickfilterActions.subscribeQuickFilter({
          quickFilter: quickfilter,
        });
        const newState = quickFilterReducer(
          {
            ...state,
            isLoading: false,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          isLoading: true,
        });
      });

      it('should set subscribed filter and remove it from queries filters list on subscribeQuickFilterSuccess', () => {
        const subscribedFilters = [
          {
            id: 100,
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
            maintainerId: '00000000-0000-0000-0000-000000000000',
            maintainerName: 'tester',
            timestamp: 1,
          },
          {
            id: 200,
            materialClass: MaterialClass.STEEL,
            navigationLevel: NavigationLevel.MATERIAL,
            title: 'subscribed 2',
            description: 'test public filter 2',
            filter: {
              co2PerTon: {
                filterType: 'number',
                type: 'greaterThan',
                filter: 2,
              },
            },
            columns: ['action', 'history'],
            maintainerId: '00000000-0000-0000-0000-000000000000',
            maintainerName: 'tester',
            timestamp: 10,
          },
        ];

        const queriedFilters = [
          {
            id: 300,
            materialClass: MaterialClass.STEEL,
            navigationLevel: NavigationLevel.MATERIAL,
            title: 'subscribed 2',
            description: 'test public filter 2',
            filter: {
              co2PerTon: {
                filterType: 'number',
                type: 'greaterThan',
                filter: 2,
              },
            },
            columns: ['action', 'history'],
            maintainerId: '00000000-0000-0000-0000-000000000000',
            maintainerName: 'tester',
            timestamp: 5,
          },
        ];

        const action = QuickfilterActions.subscribeQuickFilterSuccess({
          subscribedQuickFilter: queriedFilters[0],
        });
        const newState = quickFilterReducer(
          {
            ...state,
            subscribedFilters,
            queriedFilters,
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          subscribedFilters: [
            subscribedFilters[0],
            queriedFilters[0],
            subscribedFilters[1],
          ],
          queriedFilters: [],
          isLoading: false,
        });
      });

      it('should set isLoading to false on subscribeQuickFilterFailure', () => {
        const action = QuickfilterActions.subscribeQuickFilterFailure();
        const newState = quickFilterReducer(
          {
            ...state,
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          isLoading: false,
        });
      });
    });

    describe('unsubscribeQuickFilter', () => {
      it('should set isLoading to true on unsubscribeQuickFilter', () => {
        const action = QuickfilterActions.unsubscribeQuickFilter({
          quickFilterId: 100,
        });
        const newState = quickFilterReducer(
          {
            ...state,
            isLoading: false,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          isLoading: true,
        });
      });

      it('should remove unsubscribed filter on unsubscribeQuickFilterSuccess', () => {
        const subscribedFilters = [
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
          {
            id: 200,
            materialClass: MaterialClass.STEEL,
            navigationLevel: NavigationLevel.MATERIAL,
            title: 'public 3',
            description: 'test public filter 2',
            filter: {
              co2PerTon: {
                filterType: 'number',
                type: 'greaterThan',
                filter: 2,
              },
            },
            columns: ['action', 'history'],
            maintainerId: '00000000-0000-0000-0000-000000000000',
            maintainerName: 'tester',
            timestamp: 333_076_440_445,
          },
        ];
        const action = QuickfilterActions.unsubscribeQuickFilterSuccess({
          quickFilterId: subscribedFilters[0].id,
        });
        const newState = quickFilterReducer(
          {
            ...state,
            subscribedFilters,
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          subscribedFilters: [subscribedFilters[1]],
          isLoading: false,
        });
      });

      it('should set isLoading to false on unsubscribeQuickFilterFailure', () => {
        const action = QuickfilterActions.unsubscribeQuickFilterFailure();
        const newState = quickFilterReducer(
          {
            ...state,
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          isLoading: false,
        });
      });
    });

    describe('queryQuickFilters', () => {
      it('should set isLoading to true and reset queried filters on queryQuickFilters', () => {
        const action = QuickfilterActions.queryQuickFilters({
          materialClass: MaterialClass.STEEL,
          navigationLevel: NavigationLevel.MATERIAL,
          searchExpression: 'test',
        });
        const newState = quickFilterReducer(
          {
            ...state,
            queriedFilters: [quickfilter],
            isLoading: false,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          queriedFilters: [],
          isLoading: true,
        });
      });

      it('should ser queried filters on queryQuickFiltersSuccess', () => {
        const action = QuickfilterActions.queryQuickFiltersSuccess({
          queriedFilters: [quickfilter, second],
        });
        const newState = quickFilterReducer(
          {
            ...state,
            queriedFilters: [],
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          queriedFilters: [quickfilter, second],
          isLoading: false,
        });
      });

      it('should set isLoading to false on queryQuickFiltersFailure', () => {
        const action = QuickfilterActions.queryQuickFiltersFailure();
        const newState = quickFilterReducer(
          {
            ...state,
            isLoading: true,
          },
          action
        );

        expect(newState).toEqual({
          ...initialState,
          isLoading: false,
        });
      });
    });

    it('should reset queried filters on resetQueriedQuickFilters', () => {
      const action = QuickfilterActions.resetQueriedQuickFilters();
      const newState = quickFilterReducer(
        {
          ...state,
          queriedFilters: [quickfilter],
        },
        action
      );

      expect(newState).toEqual({
        ...initialState,
        queriedFilters: [],
      });
    });
  });
});
