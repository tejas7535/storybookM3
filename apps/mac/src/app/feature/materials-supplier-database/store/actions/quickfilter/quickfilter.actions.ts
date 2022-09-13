import { createAction, props } from '@ngrx/store';

import { QuickFilter } from '@mac/feature/materials-supplier-database/models';

export const addCustomQuickfilter = createAction(
  '[MSD - Quickfilter] Add a custom Quickfilter',
  props<{ filter: QuickFilter }>()
);

export const setCustomQuickfilter = createAction(
  '[MSD - Quickfilter] Sets a custom Quickfilter',
  props<{ filters: QuickFilter[] }>()
);

export const removeCustomQuickfilter = createAction(
  '[MSD - Quickfilter] Remove a custom Quickfilter',
  props<{ filter: QuickFilter }>()
);

export const updateCustomQuickfilter = createAction(
  '[MSD - Quickfilter] Update a custom Quickfilter',
  props<{ oldFilter: QuickFilter; newFilter: QuickFilter }>()
);
