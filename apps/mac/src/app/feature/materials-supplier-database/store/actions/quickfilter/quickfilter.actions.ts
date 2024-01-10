import { createAction, props } from '@ngrx/store';

import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import { QuickFilter } from '@mac/feature/materials-supplier-database/models';

export const addLocalQuickFilter = createAction(
  '[MSD - QuickFilter] Add a local quick filter',
  props<{ localFilter: QuickFilter }>()
);

export const setLocalQuickFilters = createAction(
  '[MSD - QuickFilter] Sets local quick filters',
  props<{ localFilters: QuickFilter[] }>()
);

export const removeLocalQuickFilter = createAction(
  '[MSD - QuickFilter] Remove a local quick filter',
  props<{ localFilter: QuickFilter }>()
);

export const updateLocalQuickFilter = createAction(
  '[MSD - QuickFilter] Update a local quick filter',
  props<{ oldFilter: QuickFilter; newFilter: QuickFilter }>()
);

export const publishQuickFilter = createAction(
  '[MSD - QuickFilter] Publish quick filter',
  props<{ quickFilter: QuickFilter }>()
);

export const publishQuickFilterSuccess = createAction(
  '[MSD - QuickFilter] Publish quick filter success',
  props<{ publishedQuickFilter: QuickFilter }>()
);

export const publishQuickFilterFailure = createAction(
  '[MSD - QuickFilter] Publish quick filter failure'
);

export const updatePublicQuickFilter = createAction(
  '[MSD - QuickFilter] Update public quick filter',
  props<{ quickFilter: QuickFilter }>()
);

export const updatePublicQuickFilterSuccess = createAction(
  '[MSD - QuickFilter] Update public quick filter success',
  props<{ updatedQuickFilter: QuickFilter }>()
);

export const updatePublicQuickFilterFailure = createAction(
  '[MSD - QuickFilter] Update public quick filter failure'
);

export const fetchPublishedQuickFilters = createAction(
  '[MSD - QuickFilter] Fetch published quick filters',
  props<{ materialClass: MaterialClass; navigationLevel: NavigationLevel }>()
);

export const fetchPublishedQuickFiltersSuccess = createAction(
  '[MSD - QuickFilter] Fetch published quick filters success',
  props<{ publishedFilters: QuickFilter[] }>()
);

export const fetchPublishedQuickFiltersFailure = createAction(
  '[MSD - QuickFilter] Fetch published quick filters failure'
);

export const fetchSubscribedQuickFilters = createAction(
  '[MSD - QuickFilter] Fetch subscribed quick filters',
  props<{ materialClass: MaterialClass; navigationLevel: NavigationLevel }>()
);

export const fetchSubscribedQuickFiltersSuccess = createAction(
  '[MSD - QuickFilter] Fetch subscribed quick filters success',
  props<{ subscribedFilters: QuickFilter[] }>()
);

export const fetchSubscribedQuickFiltersFailure = createAction(
  '[MSD - QuickFilter] Fetch subscribed quick filters failure'
);

export const deletePublishedQuickFilter = createAction(
  '[MSD - QuickFilter] Delete published quick filter',
  props<{ quickFilterId: number }>()
);

export const deletePublishedQuickFilterSuccess = createAction(
  '[MSD - QuickFilter] Delete published quick filter success',
  props<{ quickFilterId: number }>()
);

export const deletePublishedQuickFilterFailure = createAction(
  '[MSD - QuickFilter] Delete published quick filter failure'
);

export const subscribeQuickFilter = createAction(
  '[MSD - QuickFilter] Subscribe quick filter',
  props<{ quickFilter: QuickFilter }>()
);

export const subscribeQuickFilterSuccess = createAction(
  '[MSD - QuickFilter] Subscribe quick filter success',
  props<{ subscribedQuickFilter: QuickFilter }>()
);

export const subscribeQuickFilterFailure = createAction(
  '[MSD - QuickFilter] Subscribe quick filter failure'
);

export const unsubscribeQuickFilter = createAction(
  '[MSD - QuickFilter] Unsubscribe quick filter',
  props<{ quickFilterId: number }>()
);

export const unsubscribeQuickFilterSuccess = createAction(
  '[MSD - QuickFilter] Unsubscribe quick filter success',
  props<{ quickFilterId: number }>()
);

export const unsubscribeQuickFilterFailure = createAction(
  '[MSD - QuickFilter] Unsubscribe quick filter failure'
);

export const enableQuickFilterNotification = createAction(
  '[MSD - QuickFilter] Enable quick filter notification',
  props<{ quickFilterId: number; isSubscribedQuickFilter: boolean }>()
);

export const enableQuickFilterNotificationSuccess = createAction(
  '[MSD - QuickFilter] Enable quick filter notification success',
  props<{ quickFilterId: number; isSubscribedQuickFilter: boolean }>()
);

export const enableQuickFilterNotificationFailure = createAction(
  '[MSD - QuickFilter] Enable quick filter notification failure'
);

export const disableQuickFilterNotification = createAction(
  '[MSD - QuickFilter] Disable quick filter notification',
  props<{ quickFilterId: number; isSubscribedQuickFilter: boolean }>()
);

export const disableQuickFilterNotificationSuccess = createAction(
  '[MSD - QuickFilter] Disable quick filter notification success',
  props<{ quickFilterId: number; isSubscribedQuickFilter: boolean }>()
);

export const disableQuickFilterNotificationFailure = createAction(
  '[MSD - QuickFilter] Disable quick filter notification failure'
);

export const queryQuickFilters = createAction(
  '[MSD - QuickFilter] Query quick filters',
  props<{
    materialClass: MaterialClass;
    navigationLevel: NavigationLevel;
    searchExpression: string;
  }>()
);

export const queryQuickFiltersSuccess = createAction(
  '[MSD - QuickFilter] Query quick filters success',
  props<{ queriedFilters: QuickFilter[] }>()
);

export const queryQuickFiltersFailure = createAction(
  '[MSD - QuickFilter] Query quick filters failure'
);

export const resetQueriedQuickFilters = createAction(
  '[MSD - QuickFilter] Reset queried quick filters'
);

export const activateQuickFilter = createAction(
  '[MSD - QuickFilter] Activate quick filter',
  props<{ quickFilter: QuickFilter }>()
);
