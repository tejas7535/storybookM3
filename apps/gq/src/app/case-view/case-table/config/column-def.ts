import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { GqQuotationPipe } from '../../../shared/pipes/gq-quotation.pipe';

export const dateFormatter = (data: any): string => {
  return data.value ? new Date(data.value).toLocaleDateString() : '';
};

export const filterParams = {
  comparator: (compareDate: Date, cellDate: string) => {
    const newCellDate = new Date(cellDate);
    newCellDate.setHours(0, 0, 0, 0);

    const parsedCompareDate = compareDate.getTime();
    const parsedCellDate = newCellDate.getTime();

    if (parsedCompareDate === parsedCellDate) {
      return 0;
    }

    if (parsedCompareDate < parsedCellDate) {
      return 1;
    }
    if (parsedCompareDate > parsedCellDate) {
      return -1;
    }

    // this is just a default that never happens
    return 0;
  },
  buttons: ['reset'],
};
export const idFormatter = (data: any): string => {
  const pipe = new GqQuotationPipe();

  return pipe.transform(data.value);
};

export const COLUMN_DEFS: ColDef[] = [
  {
    checkboxSelection: true,
    pinned: 'left',
    minWidth: 60,
    width: 30,
    filter: false,
    resizable: false,
    suppressMenu: true,
  },
  {
    headerName: translate('caseView.caseTable.gqId'),
    field: 'gqId',
    valueFormatter: idFormatter,
  },
  {
    filterParams,
    headerName: translate('caseView.caseTable.creationDate'),
    field: 'gqCreated',
    filter: 'agDateColumnFilter',
    valueFormatter: dateFormatter,
  },
  {
    headerName: translate('caseView.caseTable.sapId'),
    field: 'sapId',
  },
  {
    headerName: translate('caseView.caseTable.createdBy'),
    field: 'sapCreatedByUser.name',
  },
  {
    headerName: translate('caseView.caseTable.customerNumber'),
    field: 'customer.id',
  },
  {
    headerName: translate('caseView.caseTable.customerName'),
    field: 'customer.name',
  },

  {
    headerName: translate('caseView.caseTable.status'),
    field: 'status',
  },
  {
    headerName: translate('caseView.caseTable.synchronized'),
    field: 'synchronized',
  },
];
