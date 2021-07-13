import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
  ClientSideRowModelModule,
  ColDef,
} from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { LostJobProfile } from '../models';
import { AmountCellRendererComponent } from './amount-cell-renderer/amount-cell-renderer.component';

type CellType = 'workforce' | 'leavers';

@Component({
  selector: 'ia-lost-job-profiles',
  templateUrl: './lost-job-profiles.component.html',
})
export class LostJobProfilesComponent {
  @Input() loading: boolean; // not used at the moment
  @Input() data: LostJobProfile[];

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

  getRowClass = () => 'border-2 border-veryLight';

  private handleCellClick(params: any, key: CellType): void {
    const translationKey =
      key === 'workforce' ? 'titleWorkforce' : 'titleLeavers';
    const title = translate(
      `lossOfSkill.lostJobProfiles.popup.${translationKey}`
    );
    const total = params.value;
    const employees: string[] =
      key === 'workforce' ? params.data.employees : params.data.leavers;

    this.openEmployeeListDialog(title, total, employees);
  }

  private openEmployeeListDialog(
    title: string,
    total: number,
    employees: string[]
  ): void {
    this.dialog.open(EmployeeListDialogComponent, {
      data: {
        title,
        total,
        employees,
      },
      width: '700px',
      height: '400px',
    });
  }
}
