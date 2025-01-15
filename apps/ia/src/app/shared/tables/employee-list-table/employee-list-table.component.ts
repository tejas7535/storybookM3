import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { translate } from '@jsverse/transloco';
import {
  ColDef,
  ExcelExportParams,
  ProcessCellForExportParams,
  StatusPanelDef,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-community';

import { ActionType, LeavingType } from '../../models';
import { valueFormatterDate } from '../../utils/utilities';
import { ExcelExportStatusBarComponent } from './excel-export-status-bar/excel-export-status-bar.component';
import { FluctuationTypeCellRendererComponent } from './fluctuation-type-cell-renderer/fluctuation-type-cell-renderer.component';
import { EmployeeTableEntry, FluctuationType } from './models';
import { TotalStatusBarComponent } from './total-status-bar/total-status-bar.component';

@Component({
  selector: 'ia-employee-list-table',
  templateUrl: './employee-list-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListTableComponent implements OnInit {
  readonly REASON_FOR_LEAVING_MIN_WIDTH = 170;
  readonly APP_NAME = 'Insight Attrition';

  @Input()
  employees: EmployeeTableEntry[] = undefined;

  @Input()
  type: 'workforce' | 'leavers' | 'newJoiners';

  @Input()
  excludedColumns: string[];

  @Input()
  set excelName(excelName: string) {
    this.defaultExcelExportParams.fileName = excelName;
    this.defaultExcelExportParams.sheetName = 'Insight Attrition';
  }

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
      closeOnReset: true,
    },
    resizable: true,
    suppressHeaderMenuButton: true,
    lockPinned: true,
    flex: 1,
  };

  statusBar: { statusPanels: StatusPanelDef[] } = {
    statusPanels: [
      {
        statusPanel: TotalStatusBarComponent,
        align: 'left',
      },
      {
        statusPanel: ExcelExportStatusBarComponent,
        align: 'right',
      },
    ],
  };

  columnDefs: ColDef[];

  components = [FluctuationTypeCellRendererComponent];

  defaultExcelExportParams: ExcelExportParams = {
    fileName: this.excelName,
    sheetName: this.excelName,
    author: this.APP_NAME,
    allColumns: true,
    processCellCallback: (params: ProcessCellForExportParams) =>
      this.getFormattedValue(params),
  };

  ngOnInit(): void {
    this.columnDefs = this.createColDefs();
  }

  createColDefs() {
    const coreColumns: ColDef[] = this.createCoreColumns();

    const columns: ColDef[] = coreColumns;

    if (this.type === 'leavers') {
      columns.push(
        {
          field: 'exitDate',
          headerName: translate('employeeListDialog.exitDate'),
          filter: 'agDateColumnFilter',
          sort: 'desc',
          valueFormatter: (params) =>
            valueFormatterDate<EmployeeTableEntry>(params, 'exitDate'),
        },
        {
          field: 'reasonForLeaving',
          headerName: translate('employeeListDialog.reasonForLeaving'),
          tooltipField: 'reasonForLeaving',
          minWidth: this.REASON_FOR_LEAVING_MIN_WIDTH,
          suppressSizeToFit: true,
          valueGetter: (params: ValueGetterParams) =>
            params.data.actionType === ActionType.EXTERNAL
              ? this.mapLeavingTypeToFluctuationType(
                  params.data.reasonForLeaving
                )
              : this.mapLeavingTypeToFluctuationType(ActionType.INTERNAL),
          cellRenderer: FluctuationTypeCellRendererComponent,
        },
        {
          field: 'actionReason',
          headerName: translate('employeeListDialog.actionReason'),
          tooltipField: 'actionReason',
        },
        {
          field: 'from',
          headerName: translate('employeeListDialog.from'),
          hide: true,
          valueGetter: (params) => this.internalValueGetter(params, 'from'),
        },
        {
          field: 'to',
          headerName: translate('employeeListDialog.to'),
          hide: true,
          valueGetter: (params) => this.internalValueGetter(params, 'to'),
        }
      );
    } else if (this.type === 'newJoiners') {
      columns.push(
        {
          field: 'entryDate',
          headerName: translate('employeeListDialog.entryDate'),
          filter: 'agDateColumnFilter',
          sort: 'desc',
          valueFormatter: (params) =>
            valueFormatterDate<EmployeeTableEntry>(params, 'entryDate'),
        },
        {
          field: 'reasonForLeaving',
          headerName: translate('employeeListDialog.reasonForLeaving'),
          tooltipField: 'reasonForLeaving',
          minWidth: this.REASON_FOR_LEAVING_MIN_WIDTH,
          suppressSizeToFit: true,
          valueGetter: (params: ValueGetterParams) =>
            params.data.actionType === ActionType.INTERNAL
              ? FluctuationType.INTERNAL
              : undefined,
          cellRenderer: FluctuationTypeCellRendererComponent,
        },
        {
          field: 'from',
          headerName: translate('employeeListDialog.from'),
          hide: true,
          valueGetter: (params) => this.internalValueGetter(params, 'from'),
        },
        {
          field: 'to',
          headerName: translate('employeeListDialog.to'),
          hide: true,
          valueGetter: (params) => this.internalValueGetter(params, 'to'),
        }
      );
    }

    return this.filterExcludedColumns(columns);
  }

  internalValueGetter(params: ValueGetterParams, key: 'from' | 'to') {
    if (params.data.actionType !== ActionType.INTERNAL) {
      return;
    }
    if (key === 'from') {
      return params.data.exitDate
        ? params.data.currentDimensionValue
        : params.data.previousDimensionValue;
    } else {
      return params.data.exitDate
        ? params.data.nextDimensionValue
        : params.data.currentDimensionValue;
    }
  }

  filterExcludedColumns(columns: ColDef[]): ColDef[] {
    return this.excludedColumns
      ? columns.filter((column) => !this.excludedColumns.includes(column.field))
      : columns;
  }

  createCoreColumns(): ColDef[] {
    const coreColumns: ColDef[] = [
      {
        field: 'employeeName',
        headerName: translate('employeeListDialog.name'),
        tooltipField: 'employeeName',
        sort: this.type === 'workforce' ? 'asc' : undefined,
      },
      {
        field: 'userId',
        headerName: translate('employeeListDialog.userId'),
        tooltipField: 'userId',
      },
      {
        field: 'employeeKey',
        headerName: translate('employeeListDialog.employeeKey'),
        tooltipField: 'employeeKey',
      },
      {
        field: 'orgUnit',
        headerName: translate('employeeListDialog.orgUnit'),
        tooltipField: 'orgUnit',
      },
    ];

    coreColumns.push({
      field: 'positionDescription',
      headerName: translate('employeeListDialog.positionDescription'),
      tooltipField: 'positionDescription',
    });

    return coreColumns;
  }

  mapLeavingTypeToFluctuationType(reasonForLeaving: LeavingType | ActionType) {
    switch (reasonForLeaving) {
      case LeavingType.FORCED: {
        return FluctuationType.FORCED;
      }
      case LeavingType.UNFORCED: {
        return FluctuationType.UNFORCED;
      }
      case LeavingType.REMAINING: {
        return FluctuationType.REMAINING;
      }
      case ActionType.INTERNAL: {
        return FluctuationType.INTERNAL;
      }
      default: {
        // eslint-disable-next-line unicorn/no-useless-undefined
        return undefined;
      }
    }
  }

  getFormattedValue(params: ProcessCellForExportParams): string {
    const column = params.column.getColDef();

    if (column.valueFormatter) {
      const valueFormatterParams: ValueFormatterParams = {
        ...params,
        data: params.node.data,
        node: params.node,
        colDef: params.column.getColDef(),
      };

      return (
        params.column.getColDef().valueFormatter as (
          params: ValueFormatterParams
        ) => string
      )(valueFormatterParams);
    } else {
      return params.value;
    }
  }
}
