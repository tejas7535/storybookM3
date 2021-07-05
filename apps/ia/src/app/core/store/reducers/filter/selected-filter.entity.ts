import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { SelectedFilter } from '../../../../shared/models';

export const selectFilterId = (f: SelectedFilter): string =>
  // the name of the filter is the unique identifier
  f.name;

export const filterAdapter: EntityAdapter<SelectedFilter> =
  createEntityAdapter<SelectedFilter>({
    selectId: selectFilterId,
  });
