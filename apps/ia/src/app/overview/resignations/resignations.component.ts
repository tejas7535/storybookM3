import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-community';

import { valueGetterDate } from '../../shared/utils/utilities';
import { ResignedEmployee } from '../models';

@Component({
  selector: 'ia-resignations',
  templateUrl: './resignations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResignationsComponent {
  @Input() loading: boolean; // not used at the moment
  @Input() data: ResignedEmployee[];
  @Input() totalCount: number;
  @Input() syncOn: string;

  frameworkComponents = {};

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    suppressMenu: true,
    lockPinned: true,
    suppressMovable: true,
    headerClass: () => 'bg-selected-overlay',
    flex: 1,
  };

  columnDefs: ColDef[] = [
    {
      field: 'exitDate',
      headerName: translate('overview.resignationsReceived.table.date'),
      filter: 'agDateColumnFilter',
      sort: 'desc',
      valueGetter: (params) =>
        valueGetterDate<ResignedEmployee>(params, 'exitDate'),
    },
    {
      field: 'employeeName',
      headerName: translate('overview.resignationsReceived.table.name'),
      tooltipField: 'employeeName',
    },
  ];
}
