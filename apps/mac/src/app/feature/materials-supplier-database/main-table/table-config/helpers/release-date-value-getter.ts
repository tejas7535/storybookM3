import { ValueGetterParams } from 'ag-grid-community';
import moment from 'moment';

import { DataResult } from '@mac/msd/models';

export const RELEASE_DATE_VALUE_GETTER = (
  params: ValueGetterParams<DataResult>
) => {
  if (!params.data.releaseDate) {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }

  return moment(params.data.releaseDate, 'YYYYMMDD').toDate();
};
