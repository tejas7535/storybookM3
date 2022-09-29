import { ValueGetterParams } from 'ag-grid-community';

import { DataResult } from '@mac/msd/models';

export const RELEASE_DATE_VALUE_GETTER = ({
  data,
}: ValueGetterParams<DataResult>) => {
  if (!data.releaseDateMonth || !data.releaseDateYear) {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }

  const month = data.releaseDateMonth;
  const year = data.releaseDateYear;

  return new Date(year, month - 1);
};
