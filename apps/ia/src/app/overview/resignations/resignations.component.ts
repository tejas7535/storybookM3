import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { ColDef } from 'ag-grid-community';

import { LoadingDataTableComponent } from '../../shared/tables/loading-data-table';
import { valueFormatterDate } from '../../shared/utils/utilities';
import { ResignedEmployee } from '../models';

@Component({
  selector: 'ia-resignations',
  templateUrl: './resignations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResignationsComponent extends LoadingDataTableComponent<ResignedEmployee> {
  @Input() data: ResignedEmployee[];
  @Input() totalCount: number;
  @Input() syncOn: string;

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    suppressHeaderMenuButton: true,
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
      valueFormatter: (params) =>
        valueFormatterDate<ResignedEmployee>(params, 'exitDate'),
      suppressHeaderFilterButton: true,
    },
    {
      field: 'employeeName',
      headerName: translate('overview.resignationsReceived.table.name'),
      tooltipField: 'employeeName',
    },
  ];
}
