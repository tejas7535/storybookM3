import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import {
  initialState,
  QuickFilterState,
} from '@mac/msd/store/reducers/quickfilter/quickfilter.reducer';

import { MSDState } from '../../reducers';
import * as QuickFilterSelectors from './quickfilter.selectors';

describe('QuickfilterSelectors', () => {
  it('should get state', () => {
    expect(
      QuickFilterSelectors.getQuickFilterState.projector({
        quickfilter: initialState,
      } as MSDState)
    ).toEqual(initialState);
  });

  it('should get local filters', () => {
    const localFilters = [
      {
        title: 'test updated',
        filter: {
          co2PerTon: {
            filterType: 'number',
            type: 'greaterThan',
            filter: 5,
          },
        },
        columns: ['action', 'history'],
      },
    ];
    expect(
      QuickFilterSelectors.getLocalQuickFilters.projector({
        localFilters,
      } as unknown as QuickFilterState)
    ).toEqual(localFilters);
  });

  it('should get own filters', () => {
    const localFilters = [
      {
        title: 'test updated',
        filter: {
          co2PerTon: {
            filterType: 'number',
            type: 'greaterThan',
            filter: 5,
          },
        },
        columns: ['action', 'history'],
      },
    ];

    const publishedFilters = [
      {
        id: 100,
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
        title: 'public 1',
        description: 'test public filter 1',
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

    expect(
      QuickFilterSelectors.getOwnQuickFilters.projector({
        localFilters,
        publishedFilters,
      } as unknown as QuickFilterState)
    ).toEqual([...localFilters, ...publishedFilters]);
  });

  it('should get published filters', () => {
    const publishedFilters = [
      {
        id: 100,
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
        title: 'public 1',
        description: 'test public filter 1',
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

    expect(
      QuickFilterSelectors.getPublishedQuickFilters.projector({
        publishedFilters,
      } as unknown as QuickFilterState)
    ).toEqual(publishedFilters);
  });

  it('should get subscribed filters', () => {
    const subscribedFilters = [
      {
        id: 100,
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
        title: 'public 1',
        description: 'test public filter 1',
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

    expect(
      QuickFilterSelectors.getSubscribedQuickFilters.projector({
        subscribedFilters,
      } as unknown as QuickFilterState)
    ).toEqual(subscribedFilters);
  });

  it('should get queried filters', () => {
    const queriedFilters = [
      {
        id: 100,
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
        title: 'public 1',
        description: 'test public filter 1',
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

    expect(
      QuickFilterSelectors.getQueriedQuickFilters.projector({
        queriedFilters,
      } as unknown as QuickFilterState)
    ).toEqual(queriedFilters);
  });

  describe('isLoading', () => {
    it('should be true if published filters are loading', () => {
      expect(
        QuickFilterSelectors.isLoading.projector({
          arePublishedFiltersLoading: true,
          areSubscribedFiltersLoading: false,
          isLoading: false,
        } as unknown as QuickFilterState)
      ).toBe(true);
    });

    it('should be true if subscribed filters are loading', () => {
      expect(
        QuickFilterSelectors.isLoading.projector({
          arePublishedFiltersLoading: false,
          areSubscribedFiltersLoading: true,
          isLoading: false,
        } as unknown as QuickFilterState)
      ).toBe(true);
    });

    it('should be true if some server-side filter process is being executed', () => {
      expect(
        QuickFilterSelectors.isLoading.projector({
          arePublishedFiltersLoading: false,
          areSubscribedFiltersLoading: false,
          isLoading: true,
        } as unknown as QuickFilterState)
      ).toBe(true);
    });

    it('should be false', () => {
      expect(
        QuickFilterSelectors.isLoading.projector({
          arePublishedFiltersLoading: false,
          areSubscribedFiltersLoading: false,
          isLoading: false,
        } as unknown as QuickFilterState)
      ).toBe(false);
    });
  });
});
