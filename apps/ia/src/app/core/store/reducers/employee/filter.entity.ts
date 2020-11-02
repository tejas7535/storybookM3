import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Filter } from '../../../../shared/models';

export interface FilterState extends EntityState<Filter> {}

export const selectFilterId = (f: Filter): string => {
  // the name of the filter is the unique identifier
  return f.name;
};

export const filterAdapter: EntityAdapter<Filter> = createEntityAdapter<Filter>(
  {
    selectId: selectFilterId,
  }
);
