import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { translate } from '@jsverse/transloco';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  IRowNode,
  RowDataUpdatedEvent,
  ValueGetterParams,
} from 'ag-grid-community';

import { FluctuationTypeCellRendererComponent } from '../../shared/tables/employee-list-table/fluctuation-type-cell-renderer/fluctuation-type-cell-renderer.component';
import { PmgmAssessment, PmgmData } from '../models';
import { PmgmArrowComponent } from './pmgm-arrow/pmgm-arrow.component';
import { PmgmAssessmentComponent } from './pmgm-assessment/pmgm-assessment.component';
import { PmgmAssessmentHeaderComponent } from './pmgm-assessment-header/pmgm-assessment-header.component';
import { PmgmPerformanceRatingComponent } from './pmgm-performance-rating/pmgm-performance-rating.component';
import { PmgmPositionComponent } from './pmgm-position/pmgm-position.component';

@Component({
  selector: 'ia-pmgm',
  templateUrl: './pmgm.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PmgmComponent {
  gridApi: GridApi<PmgmData>;
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    suppressMenu: true,
    flex: 1,
    headerClass: () => 'bg-selected-overlay',
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
      closeOnReset: true,
    },
  };

  components = [
    PmgmAssessmentComponent,
    PmgmPositionComponent,
    PmgmPerformanceRatingComponent,
    FluctuationTypeCellRendererComponent,
    PmgmAssessmentHeaderComponent,
    PmgmArrowComponent,
  ];

  columnDefs: ColDef[] = [
    {
      field: 'employee',
      headerName: translate('lossOfSkill.pmgm.table.employee'),
      tooltipField: 'employee',
      sort: 'asc',
      sortIndex: 2,
      flex: 2,
    },
    {
      field: 'position',
      headerName: translate('lossOfSkill.pmgm.table.position'),
      cellRenderer: PmgmPositionComponent,
      valueGetter: (params: ValueGetterParams) =>
        this.positionValueGetter(params),
      minWidth: 70,
    },
    {
      field: 'managerChange',
      headerName: translate('lossOfSkill.pmgm.table.previousYear'),
      cellRenderer: PmgmArrowComponent,
    },
    {
      field: 'fluctuationType',
      headerName: translate('lossOfSkill.pmgm.table.fluctuationType'),
      cellRenderer: FluctuationTypeCellRendererComponent,
      cellRendererParams: (params: ICellRendererParams) =>
        params.data.fluctuationType,
      sort: 'desc',
      sortIndex: 1,
      minWidth: 107,
    },
    {
      field: 'overallPerformanceRating',
      headerName: translate('lossOfSkill.pmgm.table.overallPerformanceRating'),
      cellRenderer: PmgmPerformanceRatingComponent,
      minWidth: 117,
    },
    {
      field: 'overallPerformanceRatingChange',
      headerName: translate(`lossOfSkill.pmgm.table.previousYear`),
      cellRenderer: PmgmArrowComponent,
    },
    {
      field: 'highImpactOfLoss',
      headerName: translate('lossOfSkill.pmgm.table.highImpactOfLoss'),
      valueGetter: (params: ValueGetterParams) =>
        this.yesNoBooleanConverter(params.data.highImpactOfLoss),
    },
    {
      field: 'highImpactOfLossChange',
      headerName: translate('lossOfSkill.pmgm.table.previousYear'),
      cellRenderer: PmgmArrowComponent,
      hide: true,
    },
    {
      field: 'highRiskOfLoss',
      headerName: translate('lossOfSkill.pmgm.table.highRiskOfLoss'),
      valueGetter: (params: ValueGetterParams) =>
        this.yesNoBooleanConverter(params.data.highRiskOfLoss),
    },
    {
      field: 'highRiskOfLossChange',
      headerName: translate(`lossOfSkill.pmgm.table.previousYear`),
      cellRenderer: PmgmArrowComponent,
      hide: true,
    },
    {
      field: 'assessment',
      headerName: translate('lossOfSkill.pmgm.table.assessment'),
      cellRenderer: PmgmAssessmentComponent,
      headerComponent: PmgmAssessmentHeaderComponent,
      comparator: this.pmgmAssesmentSortComparator,
      sort: 'asc',
      sortIndex: 0,
      minWidth: 153,
    },
  ];

  @Input() enoughRightsToShowAllEmployees = false;

  private _data: PmgmData[] = [];

  @Input() set data(data: PmgmData[]) {
    this._data = data;
    this.gridApi?.setRowData(data);
    if (data) {
      this.gridApi?.hideOverlay();
    } else {
      this.gridApi?.showLoadingOverlay();
    }
  }

  get data(): PmgmData[] {
    return this._data;
  }

  @Output() readonly loadPmgmDataForPreviousYear = new EventEmitter<void>();

  onGridReady(event: GridReadyEvent<PmgmData>): void {
    this.gridApi = event.api;

    if (this.data && this.gridApi.getModel().getRowCount() === 0) {
      this.gridApi.setRowData(this.data);
    }
  }

  onRowDataUpdated(params: RowDataUpdatedEvent<PmgmData>): void {
    params.api.forEachNode((node) => {
      if (node.data.fluctuationType) {
        node.setSelected(true);
      }
    });
  }

  positionValueGetter(params: ValueGetterParams<PmgmData>): string {
    return params.data.isManager
      ? translate('lossOfSkill.pmgm.table.tooltip.position.manager')
      : translate('lossOfSkill.pmgm.table.tooltip.position.employee');
  }

  yesNoBooleanConverter(value: boolean): string {
    if (value === null || value === undefined) {
      return '';
    }

    return value ? translate('shared.yes') : translate('shared.no');
  }

  pmgmAssesmentSortComparator(
    valueA: any,
    valueB: any,
    _nodeA: IRowNode,
    _nodeB: IRowNode,
    _isInverted: boolean
  ) {
    const colorOrder = {
      RED: 0,
      YELLOW: 1,
      GREEN: 2,
      GREY: 3,
    };

    if (
      colorOrder[valueA as PmgmAssessment] <
      colorOrder[valueB as PmgmAssessment]
    ) {
      return -1;
    } else if (
      colorOrder[valueA as PmgmAssessment] >
      colorOrder[valueB as PmgmAssessment]
    ) {
      return 1;
    } else {
      return 0;
    }
  }
}
