import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

@Component({
  selector: 'ia-resignations',
  templateUrl: './resignations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResignationsComponent {
  @Input() loading: boolean; // not used at the moment
  @Input() data: any[];

  modules: any[] = [ClientSideRowModelModule];

  frameworkComponents = {};

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    suppressMenu: true,
    width: 100,
    flex: 1,
    headerClass: () => 'bg-lightBg',
  };

  columnDefs: ColDef[] = [
    {
      field: 'date',
      headerName: translate('overview.resignationsReceived.table.date'),
    },
    {
      field: 'name',
      headerName: translate('overview.resignationsReceived.table.name'),
    },
  ];

  getRowClass = () => 'border-2 border-veryLight';
}
