import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { translate } from '@jsverse/transloco';
import { CellClickedEvent, ColDef } from 'ag-grid-community';

import { ExitEntryEmployeesResponse } from '../../../overview/models';
import { EmployeeListDialogComponent } from '../../../shared/dialogs/employee-list-dialog/employee-list-dialog.component';
import {
  EmployeeListDialogMeta,
  EmployeeListDialogMetaFilters,
  EmployeeListDialogMetaHeadings,
} from '../../../shared/dialogs/employee-list-dialog/models';
import { EmployeeWithAction, IdValue } from '../../../shared/models';
import { AmountCellRendererComponent } from '../../../shared/tables/employee-list-table/amount-cell-renderer/amount-cell-renderer.component';
import { countComparator } from '../../../shared/utils/comparators';
import { ReasonForLeavingRank } from '../../models';

@Component({
  selector: 'ia-reasons-for-leaving-table',
  templateUrl: './reasons-for-leaving-table.component.html',
  styles: [
    `
      ::ng-deep {
        .ia-ag-header-align-right .ag-header-cell-label,
        .ag-cell-value ia-amount-cell-renderer .flex {
          justify-content: flex-end;
        }
      }
    `,
  ],
})
export class ReasonsForLeavingTableComponent implements OnInit {
  leavers: EmployeeWithAction[];

  @Input() loading: boolean; // not used at the moment
  @Input() data: ReasonForLeavingRank[];
  @Input() filters: EmployeeListDialogMetaFilters;
  @Input() timeRange: IdValue;

  @Output() leaversRequested = new EventEmitter<number>();

  components = {
    AmountCellRendererComponent,
  };

  @Input() set leaversLoading(leaversLoading: boolean) {
    this.dialogMeta.employeesLoading = leaversLoading;
    this.dialogMeta.employees = leaversLoading ? undefined : this.leavers;
  }

  @Input() set leaversData(leaversData: ExitEntryEmployeesResponse) {
    if (leaversData) {
      this.leavers = leaversData.employees;
      this.dialogMeta.employees = this.dialogMeta.employeesLoading
        ? undefined
        : leaversData.employees;
      this.dialogMeta.enoughRightsToShowAllEmployees =
        !leaversData.responseModified;
    }
  }

  readonly timeRangeHintValue = 'time range';
  readonly headerClass = 'bg-selected-overlay';

  dialogMeta = new EmployeeListDialogMeta(
    {} as EmployeeListDialogMetaHeadings,
    undefined,
    this.leaversLoading,
    true,
    'leavers',
    ['actionReason', 'reasonForLeaving']
  );

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

  constructor(private readonly dialog: MatDialog) {}

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
        cellClass: 'amount-cell',
        cellRenderer: AmountCellRendererComponent,
        onCellClicked: (params) => this.handleCellClick(params),
        valueGetter: (params) => ({
          count: params.data.leavers,
          restrictedAccess: false,
        }),
        comparator: countComparator,
        minWidth: 130,
      },
    ];
  }

  handleCellClick(params: CellClickedEvent): void {
    this.leaversRequested.emit(params.data.reasonId);
    const icon = 'person_add_disabled';
    const data: EmployeeListDialogMeta = this.dialogMeta;
    const timeframe = this.filters.timeRange;
    const timeframeExcelName = this.timeRange.value;

    const title = `${translate(
      `reasonsAndCounterMeasures.reasonsForLeaving.table.popup.titleLeavers`
    )}`;
    const customExcelFileName = `${title} ${this.filters.value} ${timeframeExcelName}`;
    const filters = new EmployeeListDialogMetaFilters(
      this.filters.filterDimension,
      this.filters.value,
      timeframe
    );
    const headings = new EmployeeListDialogMetaHeadings(
      title,
      icon,
      false,
      filters
    );
    data.headings = headings;
    data.customExcelFileName = customExcelFileName;

    this.dialog.open(EmployeeListDialogComponent, {
      data,
    });
  }
}
