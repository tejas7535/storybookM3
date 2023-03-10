import { ValueGetterParams } from 'ag-grid-community';

import { DataResult } from '@mac/msd/models';

// cell value getter
export const RECYCLING_RATE_VALUE_GETTER = ({
  data,
}: ValueGetterParams<DataResult>) => {
  if (!data.minRecyclingRate || !data.maxRecyclingRate) {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }
  const min = data.minRecyclingRate;
  const max = data.maxRecyclingRate;

  return min === max ? `${min} %` : `${min}-${max} %`;
};

// value getter for filter, returns only min value
export const RECYCLING_RATE_FILTER_VALUE_GETTER = ({
  data,
}: ValueGetterParams<DataResult>) => data.minRecyclingRate;
