import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { translate } from '@jsverse/transloco';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  ITooltipParams,
} from 'ag-grid-community';
import moment from 'moment';

import { ExitEntryEmployeesResponse } from '../../overview/models';
import { DATE_FORMAT_BEAUTY } from '../../shared/constants';
import { EmployeeListDialogComponent } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.component';
import {
  EmployeeListDialogMeta,
  EmployeeListDialogMetaFilters,
} from '../../shared/dialogs/employee-list-dialog/models';
import { EmployeeListDialogMetaHeadings } from '../../shared/dialogs/employee-list-dialog/models/employee-list-dialog-meta-headings.model';
import { EmployeeWithAction, IdValue } from '../../shared/models';
import { AmountCellRendererComponent } from '../../shared/tables/employee-list-table/amount-cell-renderer/amount-cell-renderer.component';
import { countComparator } from '../../shared/utils/comparators';
import { JobProfile, Workforce, WorkforceResponse } from '../models';
import { OpenPositionsCellRendererComponent } from './open-positions-cell-renderer/open-positions-cell-renderer.component';

type CellType = 'workforce' | 'leavers';

@Component({
  selector: 'ia-lost-job-profiles',
  templateUrl: './lost-job-profiles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LostJobProfilesComponent {
  workforce: Workforce[];
  leavers: EmployeeWithAction[];

  @Input() filters: EmployeeListDialogMetaFilters;

  @Input() timeRange: IdValue;

  private _loading: boolean;

  @Input() set loading(loading: boolean) {
    this._loading = loading;

    this.displayOrHideLoadingOverlay(loading);
  }

  get loading() {
    return this._loading;
  }

  @Input() data: JobProfile[];
  @Input() openPositionsAvailable: boolean;

  @Output() workforceRequested = new EventEmitter<string>();
  @Output() leaversRequested = new EventEmitter<string>();

  private _workforceLoading: boolean;

  @Input() set workforceLoading(workforceLoading: boolean) {
    this._workforceLoading = workforceLoading;
    this.workforceDialogData.employeesLoading = workforceLoading;
    this.workforceDialogData.employees = workforceLoading
      ? undefined
      : this.workforce;
  }

  get workforceLoading(): boolean {
    return this._workforceLoading;
  }

  private _leaversLoading: boolean;

  @Input() set leaversLoading(leaversLoading: boolean) {
    this._leaversLoading = leaversLoading;
    this.leaversDialogData.employeesLoading = leaversLoading;
    this.leaversDialogData.employees = leaversLoading
      ? undefined
      : this.workforce;
  }

  get leaversLoading() {
    return this._leaversLoading;
  }

  private _workforceData: WorkforceResponse;

  @Input() set workforceData(workforceData: WorkforceResponse) {
    this._workforceData = workforceData;
    this.workforce = workforceData?.employees;
    this.workforceDialogData.employees = this.workforceDialogData
      .employeesLoading
      ? undefined
      : workforceData?.employees;
    this.workforceDialogData.enoughRightsToShowAllEmployees =
      !workforceData?.responseModified;
  }

  get workforceData() {
    return this._workforceData;
  }

  private _leaversData: ExitEntryEmployeesResponse;

  @Input() set leaversData(leaversData: ExitEntryEmployeesResponse) {
    this._leaversData = leaversData;
    this.leavers = leaversData?.employees;
    this.leaversDialogData.employees = this.leaversDialogData.employeesLoading
      ? undefined
      : leaversData?.employees;
    this.leaversDialogData.enoughRightsToShowAllEmployees =
      !leaversData?.responseModified;
  }

  get leaversData() {
    return this._leaversData;
  }

  gridApi: GridApi;

  components = [
    AmountCellRendererComponent,
    OpenPositionsCellRendererComponent,
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressHeaderMenuButton: true,
    flex: 1,
    headerClass: () => 'bg-selected-overlay',
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
      closeOnReset: true,
    },
  };

  currentDate = moment.utc();

  columnDefs: ColDef[] = [
    {
      field: 'positionDescription',
      headerName: translate('lossOfSkill.lostJobProfiles.table.job'),
      flex: 2,
      tooltipValueGetter: (params: ITooltipParams) =>
        `${params.data.positionDescription} (${params.data.jobKey})`,
    },
    {
      field: 'employees',
      headerName: translate('lossOfSkill.lostJobProfiles.table.workforce'),
      filter: 'agNumberColumnFilter',
      flex: 1,
      cellClass: 'amount-cell',
      cellRenderer: AmountCellRendererComponent,
      onCellClicked: (params) => this.handleCellClick(params, 'workforce'),
      valueGetter: (params) => ({
        count: params.data.employeesCount,
        restrictedAccess: false,
      }),
      comparator: countComparator,
    },
    {
      field: 'leavers',
      headerName: translate('lossOfSkill.lostJobProfiles.table.leavers'),
      filter: 'agNumberColumnFilter',
      sort: 'desc',
      flex: 1,
      cellRenderer: AmountCellRendererComponent,
      cellClass: 'amount-cell',
      onCellClicked: (params) => this.handleCellClick(params, 'leavers'),
      valueGetter: (params) => ({
        count: params.data.leaversCount,
        restrictedAccess: false,
      }),
      comparator: countComparator,
    },
    {
      field: 'openPositions',
      headerName: translate('lossOfSkill.lostJobProfiles.table.openPositions', {
        state: `${this.currentDate.format(DATE_FORMAT_BEAUTY)}`,
      }),
      filter: 'agNumberColumnFilter',
      flex: 1,
      cellRenderer: OpenPositionsCellRendererComponent,
      valueGetter: (params) => ({
        count: params.data.openPositionsCount,
        available: this.openPositionsAvailable,
      }),
    },
  ];

  workforceDialogData = new EmployeeListDialogMeta(
    {} as EmployeeListDialogMetaHeadings,
    undefined,
    this.workforceLoading,
    true,
    'workforce',
    ['positionDescription']
  );

  leaversDialogData = new EmployeeListDialogMeta(
    {} as EmployeeListDialogMetaHeadings,
    undefined,
    this.leaversLoading,
    true,
    'leavers',
    ['positionDescription', 'from', 'to']
  );

  constructor(private readonly dialog: MatDialog) {}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.autoSizeColumns(['openPositions']);
  }

  displayOrHideLoadingOverlay(loading: boolean) {
    if (loading) {
      this.gridApi?.showLoadingOverlay();
    } else {
      this.gridApi?.hideOverlay();
    }
  }

  handleCellClick(params: CellClickedEvent, key: CellType): void {
    if (key === 'workforce' && params.data.employeesCount > 0) {
      this.workforceRequested.emit(params.data.jobKey);
      this.openEmployeeListDialog(key, params.data.positionDescription);
    } else if (key === 'leavers' && params.data.leaversCount > 0) {
      this.leaversRequested.emit(params.data.jobKey);
      this.openEmployeeListDialog(key, params.data.positionDescription);
    }
  }

  openEmployeeListDialog(key: CellType, positionDescription: string): void {
    let translationKey: string;
    let icon: string;
    let data: EmployeeListDialogMeta;
    let timeframe: string;
    let timeframeExcelName: string;

    if (key === 'workforce') {
      translationKey = 'titleWorkforce';
      icon = 'people';
      data = this.workforceDialogData;
      timeframe = moment
        .unix(+this.timeRange.id.split('|')[1])
        .utc()
        .format(DATE_FORMAT_BEAUTY);
      timeframeExcelName = timeframe;
    } else {
      translationKey = 'titleLeavers';
      icon = 'person_add_disabled';
      data = this.leaversDialogData;
      timeframe = this.filters.timeRange;
      timeframeExcelName = this.timeRange.value;
    }

    const title = `${translate(
      `lossOfSkill.lostJobProfiles.popup.${translationKey}`
    )}`;
    const customExcelFileName = `${title} ${this.filters.value} ${timeframeExcelName} ${positionDescription}`;
    const filters = new EmployeeListDialogMetaFilters(
      this.filters.filterDimension,
      this.filters.value,
      timeframe,
      undefined,
      positionDescription
    );
    filters.job = positionDescription;
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
