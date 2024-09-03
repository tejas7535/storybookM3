import { Component, Input, OnInit } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { ColDef, RowDataUpdatedEvent } from 'ag-grid-community';

import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';

@Component({
  selector: 'ia-reasons-for-leaving-table',
  templateUrl: './reasons-for-leaving-table.component.html',
})
export class ReasonsForLeavingTableComponent implements OnInit {
  @Input() loading: boolean; // not used at the moment
  @Input() data: ReasonForLeavingStats[];

  components = {};

  readonly timeRangeHintValue = 'time range';
  readonly headerClass = 'bg-selected-overlay';

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressMenu: true,
    headerClass: () => this.headerClass,
    flex: 1,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
      closeOnReset: true,
    },
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
        field: 'actionReason',
        headerName: translate(
          'reasonsAndCounterMeasures.topFiveReasons.table.actionReason'
        ),
      },
      {
        field: 'percentage',
        headerName: translate(
          'reasonsAndCounterMeasures.topFiveReasons.table.percentage'
        ),
        type: 'numericColumn',
        headerClass: this.headerClass,
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'leavers',
        headerName: translate(
          'reasonsAndCounterMeasures.topFiveReasons.table.leavers'
        ),
        type: 'numericColumn',
        headerClass: this.headerClass,
        filter: 'agNumberColumnFilter',
      },
    ];
    if (!this.data) {
      this.data = [];
    }
  }

  onRowDataUpdated(event: RowDataUpdatedEvent): void {
    // autosize reason column to show full content
    event.columnApi.autoSizeColumns(['detailedReason'], false);
  }
}
