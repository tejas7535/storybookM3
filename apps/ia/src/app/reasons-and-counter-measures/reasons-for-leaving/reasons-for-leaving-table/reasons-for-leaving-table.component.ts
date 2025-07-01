import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { translate } from '@jsverse/transloco';
import {
  CellClickedEvent,
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  IsFullWidthRowParams,
  ValueGetterParams,
} from 'ag-grid-community';

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
import { AnalysisData, ReasonForLeavingRank } from '../../models';
import { ReasonAnalysisRendererComponent } from './reason-analysis-renderer/reason-analysis-renderer.component';

@Component({
  selector: 'ia-reasons-for-leaving-table',
  templateUrl: './reasons-for-leaving-table.component.html',
  styles: [
    `
      ::ng-deep {
        .ag-row:not(.ag-full-width-row) {
          cursor: pointer;
        }
      }
    `,
  ],
  standalone: false,
})
export class ReasonsForLeavingTableComponent
  extends LoadingDataTableComponent<ReasonForLeavingRank | AnalysisData>
  implements OnInit
{
  private readonly answersColumnId = 'answers';
  private readonly leaversColumnId = 'leavers';
  private _data: (ReasonForLeavingRank | AnalysisData)[];
  leavers: EmployeeWithAction[];
  reasonAnalysisRendererComponent = ReasonAnalysisRendererComponent;
  components = {
    AmountCellRendererComponent,
    ReasonAnalysisRendererComponent,
  };

  @Input() filters: EmployeeListDialogMetaFilters;
  @Input() timeRange: IdValue;

  @Output() leaversRequested = new EventEmitter<{
    reasonId: number;
    detailedReasonId: number;
  }>();

  @Output() toggleReasonAnalysis = new EventEmitter<number>();

  @Input() set data(data: (ReasonForLeavingRank | AnalysisData)[]) {
    this._data = data;
    this.showOrHideAnswersColumn();
  }

  get data(): (ReasonForLeavingRank | AnalysisData)[] {
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
    sortable: false,
    filter: false,
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
        valueGetter: (params) => this.getPercentageValueGetter(params),
        minWidth: 82,
      },
      {
        field: this.leaversColumnId,
        headerName: translate(
          'reasonsAndCounterMeasures.reasonsForLeaving.table.leavers'
        ),
        type: 'numericColumn',
        headerClass: [this.headerClass, 'ia-ag-header-align-right'],
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

  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    const sufix = params.data.detailedReasonId
      ? `${params.data.reasonId}-${params.data.detailedReasonId}`
      : `${params.data.reasonId}`;

    return String(
      params.data.fullWidth ? `analysis-${sufix}` : `reason-${sufix}`
    );
  };

  getAnswersValueGetter(
    params: ValueGetterParams<ReasonForLeavingRank | AnalysisData, string>
  ): { count: number; restrictedAccess: boolean } | undefined {
    const data = params.data as ReasonForLeavingRank;

    return data?.detailedReasonId
      ? {
          count: data.leavers,
          restrictedAccess: false,
        }
      : undefined;
  }

  getLeaversValueGetter(
    params: ValueGetterParams<ReasonForLeavingRank | AnalysisData, string>
  ): { count?: number; restrictedAccess: boolean } | undefined {
    const data = params.data as ReasonForLeavingRank;

    return data?.detailedReasonId
      ? undefined
      : {
          count: data?.leavers,
          restrictedAccess: false,
        };
  }

  getPercentageValueGetter(
    params: ValueGetterParams<ReasonForLeavingRank | AnalysisData, string>
  ): string | undefined {
    return (params.data as ReasonForLeavingRank)?.percentage?.toFixed(1);
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
    this.gridApi?.updateGridOptions({
      loading: this.loading,
    });
  }

  showOrHideAnswersColumn(): void {
    if (
      this.data.some(
        (reason) => (reason as ReasonForLeavingRank).detailedReasonId
      )
    ) {
      this.gridApi?.setColumnsVisible([this.answersColumnId], true);
    } else {
      this.gridApi?.setColumnsVisible([this.answersColumnId], false);
    }
  }

  isFullWidthRowRenderer(
    params: IsFullWidthRowParams<ReasonForLeavingRank | AnalysisData>
  ): boolean | undefined {
    return (params.rowNode.data as AnalysisData)?.fullWidth;
  }

  onCellClicked(
    event: CellClickedEvent<ReasonForLeavingRank | AnalysisData>
  ): void {
    const columnId = event.column.getColId();
    if (
      (event.data as AnalysisData)?.fullWidth ||
      columnId === this.leaversColumnId
    ) {
      return;
    }
    this.toggleReasonAnalysis.emit(event.data?.reasonId);
    this.gridApi.updateGridOptions({
      rowData: this.data,
    });
  }
}
