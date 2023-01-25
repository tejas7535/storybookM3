import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { translate } from '@ngneat/transloco';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import moment from 'moment';

import { ExitEntryEmployeesResponse } from '../../overview/models';
import { EXTENDED_LIST_ITEM_HEIGHT } from '../../shared/constants';
import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogMeta } from '../../shared/employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { JobProfile, WorkforceResponse } from '../models';
import { AmountCellRendererComponent } from './amount-cell-renderer/amount-cell-renderer.component';

type CellType = 'workforce' | 'leavers';

@Component({
  selector: 'ia-lost-job-profiles',
  templateUrl: './lost-job-profiles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LostJobProfilesComponent {
  private _loading: boolean;

  @Input() set loading(loading: boolean) {
    this._loading = loading;

    this.displayOrHideLoadingOverlay(loading);
  }

  get loading() {
    return this._loading;
  }

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
      comparator: this.countComparator,
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
      comparator: this.countComparator,
    },
    {
      field: 'openPositions',
      headerName: translate('lossOfSkill.lostJobProfiles.table.openPositions', {
        state: `${this.currentDate.format('MMM YYYY')}`,
      }),
      filter: 'agNumberColumnFilter',
      flex: 1,
      valueGetter: (params) => params.data.openPositionsCount,
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
    true,
    false,
    EXTENDED_LIST_ITEM_HEIGHT
  );

  constructor(private readonly dialog: MatDialog) {}

  countComparator(a: { count: number }, b: { count: number }): number {
    if (a.count === b.count) {
      return 0;
    }

    return a.count > b.count ? 1 : -1;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.columnApi.autoSizeColumn('openPositions');
  }

  displayOrHideLoadingOverlay(loading: boolean) {
    if (loading) {
      this.gridApi?.showLoadingOverlay();
    } else {
      this.gridApi?.hideOverlay();
    }
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
