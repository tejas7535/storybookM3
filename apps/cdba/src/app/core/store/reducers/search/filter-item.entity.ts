import {
  createEntityAdapter,
  EntityAdapter,
  EntityMap,
  EntityState,
} from '@ngrx/entity';

import {
  FilterItem,
  FilterItemIdValue,
  FilterItemRange,
  FilterItemType,
  IdValue,
} from './models';

export type FilterItemState = EntityState<FilterItem>;

export const resetFilterItems: EntityMap<FilterItem> = (item: FilterItem) => {
  if (item.type === FilterItemType.ID_VALUE) {
    return {
      ...item,
      items: (item as FilterItemIdValue).items.map((idValue: IdValue) => ({
        ...idValue,
        selected: false,
      })),
    };
  }

  // then it must be range
  return {
    ...item,
    minSelected: (item as FilterItemRange).min,
    maxSelected: (item as FilterItemRange).max,
  };
};

export const selectFilterItemId = (f: FilterItem): string =>
  // the name of the filter is the unique identifier
  f.name;

export const filterItemAdapter: EntityAdapter<FilterItem> =
  createEntityAdapter<FilterItem>({
    selectId: selectFilterItemId,
  });
