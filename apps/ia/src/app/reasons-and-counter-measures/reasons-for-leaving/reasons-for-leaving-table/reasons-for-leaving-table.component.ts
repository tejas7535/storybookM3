import { Component, Input, OnInit } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { ColDef } from 'ag-grid-community';

import { ReasonForLeavingRank } from '../../models';

@Component({
  selector: 'ia-reasons-for-leaving-table',
  templateUrl: './reasons-for-leaving-table.component.html',
  styles: [
    `
      ::ng-deep .ia-ag-header-align-right {
        .ag-header-cell-label {
          justify-content: flex-end;
        }
      }
    `,
  ],
})
export class ReasonsForLeavingTableComponent implements OnInit {
  @Input() loading: boolean; // not used at the moment
  @Input() data: ReasonForLeavingRank[];

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
        field: 'rank',
        headerName: translate(
          'reasonsAndCounterMeasures.reasonsForLeaving.table.position'
        ),
        sort: 'asc',
        floatingFilter: false,
        minWidth: 86,
      },
      {
        field: 'reason',
        headerName: translate(
          'reasonsAndCounterMeasures.reasonsForLeaving.table.actionReason'
        ),
        flex: 5,
      },
      {
        field: 'percentage',
        headerName: translate(
          'reasonsAndCounterMeasures.reasonsForLeaving.table.percentage'
        ),
        type: 'numericColumn',
        headerClass: [this.headerClass, 'ia-ag-header-align-right'],
        filter: 'agNumberColumnFilter',
        valueGetter: (params) => params.data.percentage.toFixed(1),
        minWidth: 82,
      },
      {
        field: 'leavers',
        headerName: translate(
          'reasonsAndCounterMeasures.reasonsForLeaving.table.leavers'
        ),
        type: 'numericColumn',
        headerClass: [this.headerClass, 'ia-ag-header-align-right'],
        filter: 'agNumberColumnFilter',
        minWidth: 130,
      },
    ];
  }
}
