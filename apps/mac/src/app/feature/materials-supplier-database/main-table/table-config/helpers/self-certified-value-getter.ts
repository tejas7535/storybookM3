import { translate } from '@ngneat/transloco';
import { ValueGetterParams } from 'ag-grid-community';

import { DataResult } from '@mac/msd/models';

export const SELF_CERTIFIED_VALUE_GETTER = ({
  data,
}: ValueGetterParams<DataResult>) =>
  data.selfCertified
    ? translate('materialsSupplierDatabase.mainTable.yes')
    : translate('materialsSupplierDatabase.mainTable.no');
