import {
  createEntityAdapter,
  EntityAdapter,
  EntityMap,
  EntityState,
} from '@ngrx/entity';

import { FILTER_NAME_LIMIT } from '@cdba/shared/constants/filter-names';
import { DEFAULT_RESULTS_THRESHOLD } from '@cdba/shared/constants/reference-type';

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
  } else if (
    filterItem.type === FilterItemType.RANGE &&
    filterItem.name === FILTER_NAME_LIMIT
  ) {
    return {
      ...filterItem,
      maxSelected: DEFAULT_RESULTS_THRESHOLD,
    };
  } else {
    // then it must be range
    return {
      ...filterItem,
      minSelected: (filterItem as FilterItemRange).min,
      maxSelected: (filterItem as FilterItemRange).max,
    };
  }
};

export const selectFilterItemId = (f: FilterItem): string =>
  // the name of the filter is the unique identifier
  f.name;

export const filterItemAdapter: EntityAdapter<FilterItem> =
  createEntityAdapter<FilterItem>({
    selectId: selectFilterItemId,
  });
