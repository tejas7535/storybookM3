import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  GridReadyEvent,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogMeta } from '../../shared/employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { Employee } from '../../shared/models';
import { LostJobProfile } from '../models';
import { AmountCellRendererComponent } from './amount-cell-renderer/amount-cell-renderer.component';

type CellType = 'workforce' | 'leavers';

@Component({
  selector: 'ia-lost-job-profiles',
  templateUrl: './lost-job-profiles.component.html',
})
export class LostJobProfilesComponent implements OnChanges {
  @Input() loading: boolean; // not used at the moment
  @Input() data: LostJobProfile[];

  gridApi: GridApi;

  modules: any[] = [ClientSideRowModelModule];

  frameworkComponents = {
    amountCellRenderer: AmountCellRendererComponent,
  };

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressMenu: true,
    flex: 1,
    headerClass: () => 'bg-lightBg',
  };

  currentDate = new Date();

  columnDefs: ColDef[] = [
    {
      field: 'positionDescription',
      headerName: translate('lossOfSkill.lostJobProfiles.table.job'),
      flex: 2,
    },
    {
      field: 'employees',
      headerName: translate('lossOfSkill.lostJobProfiles.table.workforce'),
      filter: 'agNumberColumnFilter',
      flex: 1,
      cellClass: 'amount-cell',
      cellRenderer: 'amountCellRenderer',
      onCellClicked: (params) => this.handleCellClick(params, 'workforce'),
      valueGetter: (params) => params.data.employees?.length,
    },
    {
      field: 'leavers',
      headerName: translate('lossOfSkill.lostJobProfiles.table.leavers'),
      filter: 'agNumberColumnFilter',
      sort: 'desc',
      flex: 1,
      cellRenderer: 'amountCellRenderer',
      cellClass: 'amount-cell',
      onCellClicked: (params) => this.handleCellClick(params, 'leavers'),
      valueGetter: (params) => params.data.leavers?.length,
    },
    {
      field: 'openPositions',
      headerName: translate('lossOfSkill.lostJobProfiles.table.openPositions', {
        state: `${this.currentDate.toLocaleString('default', {
          month: 'short',
        })} ${this.currentDate.getFullYear()}`,
      }),
      filter: 'agNumberColumnFilter',
      flex: 1,
    },
  ];

  constructor(private readonly dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.loading?.currentValue) {
      this.gridApi?.showLoadingOverlay();
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.columnApi.autoSizeColumn('openPositions');
  }

  getRowClass = () => 'border-2 border-veryLight';

  handleCellClick(params: any, key: CellType): void {
    const translationKey =
      key === 'workforce' ? 'titleWorkforce' : 'titleLeavers';
    const title = translate<string>(
      `lossOfSkill.lostJobProfiles.popup.${translationKey}`
    );

    const employees: string[] =
      key === 'workforce' ? params.data.employees : params.data.leavers;

    this.openEmployeeListDialog(title, employees);
  }

  openEmployeeListDialog(title: string, employees: string[]): void {
    // TODO: extend REST API to get full employee not just the name? may be useful later anyway
    const convertedEmployees = employees.map(
      (employee) => ({ employeeName: employee } as unknown as Employee)
    );

    const data = new EmployeeListDialogMeta(
      new EmployeeListDialogMetaHeadings(
        title,
        translate('lossOfSkill.employeeListDialog.contentTitle')
      ),
      convertedEmployees
    );

    this.dialog.open(EmployeeListDialogComponent, {
      data,
    });
  }
}
