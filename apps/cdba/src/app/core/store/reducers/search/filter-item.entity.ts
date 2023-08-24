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
} from './models';

export type FilterItemState = EntityState<FilterItem>;

export const resetFilterItems: EntityMap<FilterItem> = (
  filterItem: FilterItem
) => {
  if (filterItem.type === FilterItemType.ID_VALUE) {
    return {
      ...filterItem,
      items: [],
      selectedItems: [],
    } as FilterItemIdValue;
  }

  // then it must be range
  return {
    ...filterItem,
    minSelected: (filterItem as FilterItemRange).min,
    maxSelected: (filterItem as FilterItemRange).max,
  };
};

export const selectFilterItemId = (f: FilterItem): string =>
  // the name of the filter is the unique identifier
  f.name;

export const filterItemAdapter: EntityAdapter<FilterItem> =
  createEntityAdapter<FilterItem>({
    selectId: selectFilterItemId,
  });
