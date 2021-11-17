import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  GridReadyEvent,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { EmployeeListDialogMeta } from '../../shared/employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { Employee } from '../../shared/models/employee.model';
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
    width: 100,
    flex: 1,
    headerClass: () => 'bg-lightBg',
  };

  columnDefs: ColDef[] = [
    {
      field: 'job',
      headerName: translate('lossOfSkill.lostJobProfiles.table.job'),
      flex: 2,
    },
    {
      field: 'amountOfEmployees',
      headerName: translate('lossOfSkill.lostJobProfiles.table.workforce'),
      filter: 'agNumberColumnFilter',
      flex: 1,
      cellClass: 'amount-cell',
      cellRenderer: 'amountCellRenderer',
      onCellClicked: (params) => this.handleCellClick(params, 'workforce'),
    },
    {
      field: 'amountOfLeavers',
      headerName: translate('lossOfSkill.lostJobProfiles.table.leavers'),
      filter: 'agNumberColumnFilter',
      sort: 'desc',
      flex: 1,
      cellRenderer: 'amountCellRenderer',
      cellClass: 'amount-cell',
      onCellClicked: (params) => this.handleCellClick(params, 'leavers'),
    },
    {
      field: 'openPositions',
      headerName: translate('lossOfSkill.lostJobProfiles.table.openPositions'),
      filter: 'agNumberColumnFilter',
      flex: 1,
    },
  ];

  constructor(private readonly dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.loading.currentValue && this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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
