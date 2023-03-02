import { translate } from '@ngneat/transloco';
import { ValueGetterParams } from 'ag-grid-community';

import { getStatus } from '../../util';

export const STATUS_VALUE_GETTER = (valueGetterParams: ValueGetterParams) =>
  // value getter ignores lastModified, will not influence table row style (coloring)
  translate(
    `materialsSupplierDatabase.status.statusValues.${getStatus(
      valueGetterParams.data?.blocked,
      1
    )}`
  );
