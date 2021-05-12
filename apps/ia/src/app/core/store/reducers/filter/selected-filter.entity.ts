import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { SelectedFilter } from '../../../../shared/models';

export interface SelectedFilterState extends EntityState<SelectedFilter> {}

export const selectFilterId = (f: SelectedFilter): string => {
  // the name of the filter is the unique identifier
  return f.name;
};

export const filterAdapter: EntityAdapter<SelectedFilter> =
  createEntityAdapter<SelectedFilter>({
    selectId: selectFilterId,
  });
