import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import * as processCaseDef from '../../../process-case-view/quotation-details-table/config/column-defs';
import { NumberFormatPipe } from '../../pipes/number-format.pipe';

export const numberFormatter = (data: any) => {
  const pipe = new NumberFormatPipe();

  return pipe.transform(data.value, data.column.colId);
};

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
    headerName: translate('shared.offerTable.materialDescription'),
    field: 'materialDesignation',
  },
  {
    headerName: translate('shared.offerTable.price'),
    field: 'rsp',
    valueFormatter: numberFormatter,
  },
  {
    headerName: translate('shared.offerTable.netValue'),
    field: 'netValue',
    valueFormatter: numberFormatter,
  },
  {
    headerName: translate('shared.offerTable.quantity'),
    field: 'orderQuantity',
    valueFormatter: numberFormatter,
  },
];

export const CREATE_COLUMN_DEFS_FINISH_OFFER = (): ColDef[] => {
  return processCaseDef.COLUMN_DEFS.filter((el) => el.field !== 'addedToOffer');
};
