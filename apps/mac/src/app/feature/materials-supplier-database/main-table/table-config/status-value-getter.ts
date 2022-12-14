import { translate } from '@ngneat/transloco';
import { ValueGetterParams } from 'ag-grid-community';
import { getStatus } from '../util';

export const STATUS_VALUE_GETTER = (valueGetterParams: ValueGetterParams) =>
  translate(
    `materialsSupplierDatabase.status.statusValues.${getStatus(
      valueGetterParams.data?.blocked,
      valueGetterParams.data?.lastModified
    )}`
  );
