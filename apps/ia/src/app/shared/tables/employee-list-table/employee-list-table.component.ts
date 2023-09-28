import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { translate } from '@ngneat/transloco';
import { ColDef, StatusPanelDef, ValueGetterParams } from 'ag-grid-community';

import { ActionType, LeavingType } from '../../models';
import { dateFormatter } from '../../utils/utilities';
import { EmployeeListStatusBarComponent } from './employee-list-status-bar/employee-list-status-bar.component';
import { FluctuationTypeCellRendererComponent } from './fluctuation-type-cell-renderer/fluctuation-type-cell-renderer.component';
import { EmployeeTableEntry, FluctuationType } from './models';

@Component({
  selector: 'ia-employee-list-table',
  templateUrl: './employee-list-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListTableComponent implements OnInit {
  readonly REASON_FOR_LEAVING_MIN_WIDTH = 170;

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    filterParams: {
      buttons: ['reset'],
    },
    resizable: true,
    suppressMenu: true,
    lockPinned: true,
    flex: 1,
  };

  statusBar: { statusPanels: StatusPanelDef[] } = {
    statusPanels: [
      {
        statusPanel: EmployeeListStatusBarComponent,
        align: 'left',
      },
    ],
  };

  columnDefs: ColDef[];

  components = [FluctuationTypeCellRendererComponent];

  @Input()
  employees: EmployeeTableEntry[];

  @Input()
  type: 'workforce' | 'leavers' | 'newJoiners';

  @Input()
  excludedColumns: string[];

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
          valueFormatter: dateFormatter,
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
        }
      );
    } else if (this.type === 'newJoiners') {
      columns.push(
        {
          field: 'entryDate',
          headerName: translate('employeeListDialog.entryDate'),
          filter: 'agDateColumnFilter',
          sort: 'desc',
          valueFormatter: dateFormatter,
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
        }
      );
    }

    return this.filterExcludedColumns(columns);
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
      default:
        // eslint-disable-next-line unicorn/no-useless-undefined
        return undefined;
    }
  }
}
