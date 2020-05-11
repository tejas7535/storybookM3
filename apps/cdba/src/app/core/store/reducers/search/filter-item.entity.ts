import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { FilterItem } from './models';

export interface FilterItemState extends EntityState<FilterItem> {}

export const selectFilterItemId = (f: FilterItem): string => {
  // the name of the filter is the unique identifier
  return f.name;
};

export const filterItemAdapter: EntityAdapter<FilterItem> = createEntityAdapter<
  FilterItem
>({
  selectId: selectFilterItemId,
});
