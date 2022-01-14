import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { ResignedEmployee } from '../models';

@Component({
  selector: 'ia-resignations',
  templateUrl: './resignations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResignationsComponent {
  @Input() loading: boolean; // not used at the moment
  @Input() data: ResignedEmployee[];

  modules: any[] = [ClientSideRowModelModule];

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
      valueFormatter: (data) =>
        data.value ? new Date(+data.value).toLocaleDateString() : '',
    },
    {
      field: 'employeeName',
      headerName: translate('overview.resignationsReceived.table.name'),
      tooltipField: 'employeeName',
    },
  ];
}
