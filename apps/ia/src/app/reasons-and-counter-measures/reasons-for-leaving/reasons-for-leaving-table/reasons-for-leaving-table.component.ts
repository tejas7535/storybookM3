import { Component, Input } from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { Filter, IdValue, TimePeriod } from '../../../shared/models';
import { getTimeRangeHint } from '../../../shared/utils/utilities';

@Component({
  selector: 'ia-reasons-for-leaving-table',
  templateUrl: './reasons-for-leaving-table.component.html',
})
export class ReasonsForLeavingTableComponent {
  private _selectedTimePeriod: TimePeriod;

  @Input() loading: boolean; // not used at the moment
  @Input() data: any[];
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
    resizable: true,
    suppressMenu: true,
    lockPinned: true,
    suppressMovable: true,
    headerClass: () => 'bg-lightBg',
    flex: 1,
  };

  columnDefs: ColDef[] = [
    {
      field: 'position',
      headerName: translate(
        'reasonsAndCounterMeasures.topFiveReasons.table.position'
      ),
      sort: 'asc',
    },
    {
      field: 'job',
      headerName: translate(
        'reasonsAndCounterMeasures.topFiveReasons.table.job'
      ),
    },
    {
      field: 'percentage',
      headerName: translate(
        'reasonsAndCounterMeasures.topFiveReasons.table.percentage'
      ),
    },
    {
      field: 'leavers',
      headerName: translate(
        'reasonsAndCounterMeasures.topFiveReasons.table.leavers'
      ),
    },
  ];
}
