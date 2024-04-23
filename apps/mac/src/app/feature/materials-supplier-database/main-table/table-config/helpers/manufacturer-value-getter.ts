import { translate } from '@jsverse/transloco';
import { ValueGetterParams } from 'ag-grid-community';

import { DataResult } from '@mac/msd/models';

export const MANUFACTURER_VALUE_GETTER = ({
  data,
}: ValueGetterParams<DataResult>) =>
  data.manufacturer
    ? translate('materialsSupplierDatabase.mainTable.yes')
    : translate('materialsSupplierDatabase.mainTable.no');
