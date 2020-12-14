import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import * as processCaseDef from '../../../process-case-view/quotation-details-table/config/column-defs';

export const COLUMN_DEFS_SHORT: ColDef[] = [
  {
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    pinned: 'left',
    filter: false,
    resizable: false,
    suppressMenu: true,
    width: 30,
  },
  {
    headerName: translate('shared.offerTable.materialNumber'),
    field: 'materialNumber15',
  },
  {
    headerName: translate('shared.offerTable.price'),
    field: 'rsp',
  },
  {
    headerName: translate('shared.offerTable.netValue'),
    field: 'netValue',
  },
  {
    headerName: translate('shared.offerTable.quantity'),
    field: 'orderQuantity',
  },
];

export const CREATE_COLUMN_DEFS_FINISH_OFFER = (): ColDef[] => {
  return processCaseDef.COLUMN_DEFS.filter((el) => el.field !== 'info');
};
