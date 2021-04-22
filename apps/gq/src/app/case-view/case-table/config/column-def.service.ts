import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { ColumnUtilityService } from '../../../shared/services/column-utility-service/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  filterParams = {
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

  COLUMN_DEFS: ColDef[] = [
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
      valueFormatter: ColumnUtilityService.idFormatter,
    },
    {
      headerName: translate('caseView.caseTable.creationDate'),
      field: 'gqCreated',
      filter: 'agDateColumnFilter',
      valueFormatter: ColumnUtilityService.dateFormatter,
      filterParams: this.filterParams,
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
      field: 'customer.identifier.customerId',
    },
    {
      headerName: translate('caseView.caseTable.customerName'),
      field: 'customer.name',
    },
  ];
}
