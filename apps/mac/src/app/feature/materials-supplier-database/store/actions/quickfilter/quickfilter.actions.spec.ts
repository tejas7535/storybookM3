import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import { QuickFilter } from '@mac/msd/models';

import {
  activateQuickFilter,
  addLocalQuickFilter,
  deletePublishedQuickFilter,
  deletePublishedQuickFilterSuccess,
  fetchPublishedQuickFilters,
  fetchSubscribedQuickFilters,
  fetchSubscribedQuickFiltersSuccess,
  publishQuickFilter,
  publishQuickFilterSuccess,
  queryQuickFilters,
  queryQuickFiltersSuccess,
  removeLocalQuickFilter,
  setLocalQuickFilters,
  subscribeQuickFilter,
  subscribeQuickFilterSuccess,
  unsubscribeQuickFilter,
  unsubscribeQuickFilterSuccess,
  updateLocalQuickFilter,
  updatePublicQuickFilter,
  updatePublicQuickFilterSuccess,
} from './quickfilter.actions';

describe('Quickfilter Actions', () => {
  const quickFilter: QuickFilter = {
    columns: ['1'],
    filter: {},
    title: 'name',
  };

  it('addLocalQuickFilter should include a filter', () => {
    expect(addLocalQuickFilter({ localFilter: quickFilter }).localFilter).toBe(
      quickFilter
    );
  });

  it('setLocalQuickFilters should include a filter', () => {
    expect(
      setLocalQuickFilters({ localFilters: [quickFilter] }).localFilters[0]
    ).toBe(quickFilter);
  });

  it('removeLocalQuickFilter should include a filter', () => {
    expect(
      removeLocalQuickFilter({ localFilter: quickFilter }).localFilter
    ).toBe(quickFilter);
  });

  it('updateLocalQuickFilter should include a filter', () => {
    const obj = {} as QuickFilter;
    const action = updateLocalQuickFilter({
      oldFilter: obj,
      newFilter: quickFilter,
    });
    expect(action.newFilter).toBe(quickFilter);
    expect(action.oldFilter).toBe(obj);
  });

  it('publishQuickFilter should include a filter', () => {
    expect(publishQuickFilter({ quickFilter }).quickFilter).toBe(quickFilter);
  });

  it('publishQuickFilterSuccess should include a filter', () => {
    expect(
      publishQuickFilterSuccess({ publishedQuickFilter: quickFilter })
        .publishedQuickFilter
    ).toBe(quickFilter);
  });

  it('updatePublicQuickFilter should include a filter', () => {
    expect(updatePublicQuickFilter({ quickFilter }).quickFilter).toBe(
      quickFilter
    );
  });

  it('updatePublicQuickFilterSuccess should include a filter', () => {
    expect(
      updatePublicQuickFilterSuccess({ updatedQuickFilter: quickFilter })
        .updatedQuickFilter
    ).toBe(quickFilter);
  });

  it('fetchPublishedQuickFilters should include material class and navigation level', () => {
    const action = fetchPublishedQuickFilters({
      materialClass: MaterialClass.STEEL,
      navigationLevel: NavigationLevel.MATERIAL,
    });
    expect(action.materialClass).toBe(MaterialClass.STEEL);
    expect(action.navigationLevel).toBe(NavigationLevel.MATERIAL);
  });

  it('fetchSubscribedQuickFilters should include material class and navigation level', () => {
    const action = fetchSubscribedQuickFilters({
      materialClass: MaterialClass.STEEL,
      navigationLevel: NavigationLevel.MATERIAL,
    });
    expect(action.materialClass).toBe(MaterialClass.STEEL);
    expect(action.navigationLevel).toBe(NavigationLevel.MATERIAL);
  });

  it('fetchSubscribedQuickFiltersSuccess should include filters', () => {
    expect(
      fetchSubscribedQuickFiltersSuccess({ subscribedFilters: [quickFilter] })
        .subscribedFilters
    ).toStrictEqual([quickFilter]);
  });

  it('deletePublishedQuickFilter should include a quick filter ID', () => {
    const quickFilterId = 222;
    expect(deletePublishedQuickFilter({ quickFilterId }).quickFilterId).toBe(
      quickFilterId
    );
  });

  it('deletePublishedQuickFilterSuccess should include a quick filter ID', () => {
    const quickFilterId = 222;
    expect(
      deletePublishedQuickFilterSuccess({ quickFilterId }).quickFilterId
    ).toBe(quickFilterId);
  });

  it('subscribeQuickFilter should include a filter', () => {
    expect(subscribeQuickFilter({ quickFilter }).quickFilter).toBe(quickFilter);
  });

  it('subscribeQuickFilterSuccess should include a filter', () => {
    expect(
      subscribeQuickFilterSuccess({ subscribedQuickFilter: quickFilter })
        .subscribedQuickFilter
    ).toBe(quickFilter);
  });

  it('unsubscribeQuickFilter should include a quick filter ID', () => {
    const quickFilterId = 222;
    expect(unsubscribeQuickFilter({ quickFilterId }).quickFilterId).toBe(
      quickFilterId
    );
  });

  it('unsubscribeQuickFilterSuccess should include a quick filter ID', () => {
    const quickFilterId = 222;
    expect(unsubscribeQuickFilterSuccess({ quickFilterId }).quickFilterId).toBe(
      quickFilterId
    );
  });

  it('queryQuickFilters should include material class, navigation level and search expression', () => {
    const materialClass = MaterialClass.STEEL;
    const navigationLevel = NavigationLevel.MATERIAL;
    const searchExpression = 'test';

    const action = queryQuickFilters({
      materialClass,
      navigationLevel,
      searchExpression,
    });

    expect(action.materialClass).toBe(materialClass);
    expect(action.navigationLevel).toBe(navigationLevel);
    expect(action.searchExpression).toBe(searchExpression);
  });

  it('queryQuickFiltersSuccess should include quick filters', () => {
    expect(
      queryQuickFiltersSuccess({ queriedFilters: [quickFilter] }).queriedFilters
    ).toStrictEqual([quickFilter]);
  });

  it('activateQuickFilter should include a filter', () => {
    expect(activateQuickFilter({ quickFilter }).quickFilter).toBe(quickFilter);
  });
});
