import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { translate } from '@jsverse/transloco';
import { CellClickedEvent, ColDef, ValueGetterParams } from 'ag-grid-community';

import { ExitEntryEmployeesResponse } from '../../../overview/models';
import { EmployeeListDialogComponent } from '../../../shared/dialogs/employee-list-dialog/employee-list-dialog.component';
import {
  EmployeeListDialogMeta,
  EmployeeListDialogMetaFilters,
  EmployeeListDialogMetaHeadings,
} from '../../../shared/dialogs/employee-list-dialog/models';
import { EmployeeWithAction, IdValue } from '../../../shared/models';
import { AmountCellRendererComponent } from '../../../shared/tables/employee-list-table/amount-cell-renderer/amount-cell-renderer.component';
import { LoadingDataTableComponent } from '../../../shared/tables/loading-data-table';
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
export class ReasonsForLeavingTableComponent
  extends LoadingDataTableComponent<ReasonForLeavingRank>
  implements OnInit
{
  private readonly answersColumnId = 'answers';
  private _data: ReasonForLeavingRank[];
  leavers: EmployeeWithAction[];
  components = {
    AmountCellRendererComponent,
  };

  @Input() filters: EmployeeListDialogMetaFilters;
  @Input() timeRange: IdValue;

  @Output() leaversRequested = new EventEmitter<{
    reasonId: number;
    detailedReasonId: number;
  }>();

  @Input() set data(data: ReasonForLeavingRank[]) {
    this._data = data;
    this.showOrHideAnswersColumn();
  }

  get data(): ReasonForLeavingRank[] {
    return this._data;
  }

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
    suppressHeaderMenuButton: true,
    headerClass: () => this.headerClass,
    flex: 1,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
      closeOnReset: true,
    },
  };

  columnDefs: ColDef[] = [];

  constructor(private readonly dialog: MatDialog) {
    super();
  }

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
        valueGetter: (params) => this.getReasonValueGetter(params),
      },
      {
        field: 'percentage',
        headerName: translate(
          'reasonsAndCounterMeasures.reasonsForLeaving.table.percentage'
        ),
        type: 'numericColumn',
        headerClass: [this.headerClass, 'ia-ag-header-align-right'],
        filter: 'agNumberColumnFilter',
        valueGetter: (params) => this.getPercentageValueGetter(params),
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
        onCellClicked: (params) =>
          params.data.detailedReasonId
            ? undefined
            : this.handleCellClick(params),
        valueGetter: (params) => this.getLeaversValueGetter(params),
        comparator: countComparator,
        minWidth: 100,
      },
      {
        colId: this.answersColumnId,
        field: 'leavers',
        headerName: translate(
          'reasonsAndCounterMeasures.reasonsForLeaving.table.answers'
        ),
        type: 'numericColumn',
        headerClass: [this.headerClass, 'ia-ag-header-align-right'],
        filter: 'agNumberColumnFilter',
        cellClass: 'amount-cell',
        cellRenderer: AmountCellRendererComponent,
        onCellClicked: (params) =>
          params.data.detailedReasonId
            ? this.handleCellClick(params)
            : undefined,
        valueGetter: (params) => this.getAnswersValueGetter(params),
        comparator: countComparator,
        initialHide: true,
        minWidth: 100,
      },
    ];
  }

  getAnswersValueGetter(
    params: ValueGetterParams<ReasonForLeavingRank, string>
  ): { count: number; restrictedAccess: boolean } {
    return params.data.detailedReasonId
      ? {
          count: params.data.leavers,
          restrictedAccess: false,
        }
      : undefined;
  }

  getLeaversValueGetter(
    params: ValueGetterParams<ReasonForLeavingRank, string>
  ): { count: number; restrictedAccess: boolean } {
    return params.data.detailedReasonId
      ? undefined
      : {
          count: params.data.leavers,
          restrictedAccess: false,
        };
  }

  getPercentageValueGetter(
    params: ValueGetterParams<ReasonForLeavingRank, string>
  ): string {
    return params.data.percentage.toFixed(1);
  }

  getReasonValueGetter(params: ValueGetterParams): string {
    return params.data.detailedReason ?? params.data.reason;
  }

  handleCellClick(params: CellClickedEvent): void {
    this.leaversRequested.emit({
      reasonId: params.data.reasonId,
      detailedReasonId: params.data.detailedReasonId,
    });
    const icon = 'person_add_disabled';
    const data: EmployeeListDialogMeta = this.dialogMeta;
    const timeframe = this.filters.timeRange;

    const title = `${translate(
      `reasonsAndCounterMeasures.reasonsForLeaving.table.popup.titleLeavers`
    )}`;
    const customExcelFileName = this.createExcelFileName(title, params.data);
    const filters = new EmployeeListDialogMetaFilters(
      this.filters.filterDimension,
      this.filters.value,
      timeframe,
      undefined,
      undefined,
      params.data.reason,
      params.data.detailedReason
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

  createExcelFileName(
    title: string,
    filters: EmployeeListDialogMetaFilters
  ): string {
    let name = `${title} ${this.filters.value} ${this.filters.timeRange} ${filters.reason}`;
    if (filters.detailedReason) {
      name += ` - ${filters.detailedReason}`;
    }

    return name;
  }

  showOrHideLoadingOverlay(): void {
    if (this.loading) {
      this.gridApi?.showLoadingOverlay();
    } else {
      this.gridApi?.hideOverlay();
    }
  }

  showOrHideAnswersColumn(): void {
    if (this.data.some((reason) => reason.detailedReasonId)) {
      this.gridApi?.setColumnsVisible([this.answersColumnId], true);
    } else {
      this.gridApi?.setColumnsVisible([this.answersColumnId], false);
    }
  }
}
