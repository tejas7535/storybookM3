import { Component, Input, OnInit } from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
  RowDataChangedEvent,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';

@Component({
  selector: 'ia-reasons-for-leaving-table',
  templateUrl: './reasons-for-leaving-table.component.html',
})
export class ReasonsForLeavingTableComponent implements OnInit {
  @Input() loading: boolean; // not used at the moment
  @Input() data: ReasonForLeavingStats[];

  modules: any[] = [ClientSideRowModelModule];
  frameworkComponents = {};

  timeRangeHintValue = 'time range';

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressMenu: true,
    headerClass: () => 'bg-selected-overlay',
    flex: 1,
  };

  columnDefs: ColDef[] = [];

  ngOnInit(): void {
    this.columnDefs = [
      {
        field: 'position',
        headerName: translate(
          'reasonsAndCounterMeasures.topFiveReasons.table.position'
        ),
        sort: 'asc',
        floatingFilter: false,
      },
      {
        field: 'detailedReason',
        headerName: translate(
          'reasonsAndCounterMeasures.topFiveReasons.table.detailedReason'
        ),
      },
      {
        field: 'percentage',
        headerName: translate(
          'reasonsAndCounterMeasures.topFiveReasons.table.percentage'
        ),
        type: 'numericColumn',
        headerClass: 'border-border',
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'leavers',
        headerName: translate(
          'reasonsAndCounterMeasures.topFiveReasons.table.leavers'
        ),
        type: 'numericColumn',
        headerClass: 'border-border',
        filter: 'agNumberColumnFilter',
      },
    ];
    if (!this.data) {
      this.data = [];
    }
  }

  onRowDataChanged(event: RowDataChangedEvent): void {
    // autosize reason column to show full content
    event.columnApi.autoSizeColumns(['detailedReason'], false);
  }
}
