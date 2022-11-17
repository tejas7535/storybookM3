import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { translate } from '@ngneat/transloco';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import moment from 'moment';

import { ExitEntryEmployeesResponse } from '../../overview/models';
import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogMeta } from '../../shared/employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { JobProfile, WorkforceResponse } from '../models';
import { AmountCellRendererComponent } from './amount-cell-renderer/amount-cell-renderer.component';

type CellType = 'workforce' | 'leavers';

@Component({
  selector: 'ia-lost-job-profiles',
  templateUrl: './lost-job-profiles.component.html',
})
export class LostJobProfilesComponent implements OnChanges {
  @Input() loading: boolean; // not used at the moment
  @Input() data: JobProfile[];

  @Output() workforceRequested = new EventEmitter<string>();
  @Output() leaversRequested = new EventEmitter<string>();

  private _workforceLoading: boolean;

  @Input() set workforceLoading(workforceLoading: boolean) {
    this._workforceLoading = workforceLoading;
    this.workforceDialogData.employeesLoading = workforceLoading;
  }

  get workforceLoading(): boolean {
    return this._workforceLoading;
  }

  private _leaversLoading: boolean;

  @Input() set leaversLoading(leaversLoading: boolean) {
    this._leaversLoading = leaversLoading;
    this.leaversDialogData.employeesLoading = leaversLoading;
  }

  get leaversLoading() {
    return this._leaversLoading;
  }

  private _workforceData: WorkforceResponse;

  @Input() set workforceData(workforceData: WorkforceResponse) {
    this._workforceData = workforceData;
    if (workforceData) {
      this.workforceDialogData.employees = workforceData.employees;
      this.workforceDialogData.enoughRightsToShowAllEmployees =
        !workforceData.responseModified;
    }
  }

  get workforceData() {
    return this._workforceData;
  }

  private _leaversData: ExitEntryEmployeesResponse;

  @Input() set leaversData(leaversData: ExitEntryEmployeesResponse) {
    this._leaversData = leaversData;
    if (leaversData) {
      this.leaversDialogData.employees = leaversData.employees;
      this.leaversDialogData.enoughRightsToShowAllEmployees =
        !leaversData.responseModified;
    }
  }

  get leaversData() {
    return this._leaversData;
  }

  gridApi: GridApi;

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
    headerClass: () => 'bg-selected-overlay',
  };

  currentDate = moment.utc();

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
      valueGetter: (params) => ({
        count: params.data.employeesCount,
        restrictedAccess: false,
      }),
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
      valueGetter: (params) => ({
        count: params.data.leaversCount,
        restrictedAccess: false,
      }),
    },
    {
      field: 'openPositions',
      headerName: translate('lossOfSkill.lostJobProfiles.table.openPositions', {
        state: `${this.currentDate.format('MMM YYYY')}`,
      }),
      filter: 'agNumberColumnFilter',
      flex: 1,
    },
  ];

  workforceDialogData = new EmployeeListDialogMeta(
    {} as EmployeeListDialogMetaHeadings,
    [],
    this.workforceLoading,
    true
  );

  leaversDialogData = new EmployeeListDialogMeta(
    {} as EmployeeListDialogMetaHeadings,
    [],
    this.leaversLoading,
    true
  );

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

  handleCellClick(params: any, key: CellType): void {
    if (key === 'workforce' && params.data.employeesCount > 0) {
      this.workforceRequested.emit(params.data.positionDescription);
      this.openEmployeeListDialog(key);
    } else if (key === 'leavers' && params.data.leaversCount > 0) {
      this.leaversRequested.emit(params.data.positionDescription);
      this.openEmployeeListDialog(key);
    }
  }

  openEmployeeListDialog(key: CellType): void {
    const translationKey =
      key === 'workforce' ? 'titleWorkforce' : 'titleLeavers';
    const title = translate(
      `lossOfSkill.lostJobProfiles.popup.${translationKey}`
    );

    const headings = new EmployeeListDialogMetaHeadings(
      title,
      translate('lossOfSkill.employeeListDialog.contentTitle')
    );

    if (key === 'workforce') {
      this.workforceDialogData.headings = headings;
      this.dialog.open(EmployeeListDialogComponent, {
        data: this.workforceDialogData,
      });
    } else if (key === 'leavers') {
      this.leaversDialogData.headings = headings;
      this.dialog.open(EmployeeListDialogComponent, {
        data: this.leaversDialogData,
      });
    }
  }
}
