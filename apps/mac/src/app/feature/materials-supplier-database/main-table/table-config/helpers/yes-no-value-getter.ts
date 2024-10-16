import { translate } from '@jsverse/transloco';
import { ValueGetterParams } from 'ag-grid-community';

export const YES_NO_VALUE_GETTER_FACTORY =
  (field: string) =>
  ({ data }: ValueGetterParams<{ [key: string]: any }>) =>
    data[field]
      ? translate('materialsSupplierDatabase.mainTable.yes')
      : translate('materialsSupplierDatabase.mainTable.no');
