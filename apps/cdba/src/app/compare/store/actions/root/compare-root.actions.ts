import { createAction, props, union } from '@ngrx/store';

import { ComparableItemIdentifier } from '@cdba/shared/models/comparison.model';

export const loadComparisonFeatureData = createAction(
  '[Compare] Load Comparison Feature Data',
  props<{
    items: ComparableItemIdentifier[];
  }>()
);

const all = union({
  loadComparisonFeatureData,
});

export type CompareRootActions = typeof all;
