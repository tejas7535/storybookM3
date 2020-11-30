import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import * as processCaseDef from '../../../process-case-view/quotation-details-table/config/column-defs';

export const COLUMN_DEFS_SHORT: ColDef[] = [
  {
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
    field: 'price',
  },
  {
    headerName: translate('shared.offerTable.quantity'),
    field: 'orderQuantity',
  },
];

export const CREATE_COLUMN_DEFS_FINISH_OFFER = (): ColDef[] => {
  const columns = processCaseDef.COLUMN_DEFS;
  columns[0] = {
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    pinned: 'left',
    initialWidth: 30,
    resizable: false,
    suppressMenu: true,
    filter: false,
  };

  return columns;
};
