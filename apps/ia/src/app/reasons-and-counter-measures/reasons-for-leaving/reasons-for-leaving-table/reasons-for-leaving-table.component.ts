import { Component, Input, OnInit } from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
  RowDataChangedEvent,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { Filter, IdValue, TimePeriod } from '../../../shared/models';
import { getTimeRangeHint } from '../../../shared/utils/utilities';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';

@Component({
  selector: 'ia-reasons-for-leaving-table',
  templateUrl: './reasons-for-leaving-table.component.html',
})
export class ReasonsForLeavingTableComponent implements OnInit {
  private _selectedTimePeriod: TimePeriod;

  @Input() loading: boolean; // not used at the moment
  @Input() data: ReasonForLeavingStats[];
  @Input() disableFilters: boolean;

  @Input() orgUnits: Filter;
  @Input() selectedOrgUnit: string;
  @Input() timePeriods: IdValue[];
  @Input() set selectedTimePeriod(period: TimePeriod) {
    this._selectedTimePeriod = period;
    this.timeRangeHintValue = getTimeRangeHint(period);
  }

  get selectedTimePeriod(): TimePeriod {
    return this._selectedTimePeriod;
  }

  @Input() selectedTime: string;

  modules: any[] = [ClientSideRowModelModule];
  frameworkComponents = {};

  timeRangeHintValue = 'time range';

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressMenu: true,
    headerClass: () => 'bg-lightBg',
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
        headerClass: 'bg-lightBg',
      },
      {
        field: 'leavers',
        headerName: translate(
          'reasonsAndCounterMeasures.topFiveReasons.table.leavers'
        ),
        type: 'numericColumn',
        headerClass: 'bg-lightBg',
      },
    ];
  }

  onRowDataChanged(event: RowDataChangedEvent): void {
    // autosize reason column to show full content
    event.columnApi.autoSizeColumns(['detailedReason'], false);
  }
}
