import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { translate } from '@ngneat/transloco';
import { OrgChart } from 'd3-org-chart';
import moment from 'moment';

import { EmployeeListDialogComponent } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.component';
import {
  EmployeeListDialogMeta,
  EmployeeListDialogMetaFilters,
} from '../../shared/dialogs/employee-list-dialog/models';
import { EmployeeListDialogMetaHeadings } from '../../shared/dialogs/employee-list-dialog/models/employee-list-dialog-meta-headings.model';
import { FilterDimension, IdValue } from '../../shared/models';
import { FluctuationType } from '../../shared/tables/employee-list-table/models';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { ChartType, DimensionFluctuationData } from '../models';
import { OrgChartData, OrgChartEmployee, OrgChartNode } from './models';
import * as OrgChartConfig from './models/org-chart-config';
import { OrgChartService } from './org-chart.service';
import { DIMENSIONS_UNAVAILABLE_FOR_OPEN_POSITIONS } from '../../shared/constants';

@Component({
  selector: 'ia-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartComponent implements AfterViewInit {
  private _dialogRef: MatDialogRef<EmployeeListDialogComponent>;
  private _orgChartData: OrgChartData;
  private _chartContainer: ElementRef;
  private _selectedNodeEmployees: OrgChartEmployee[];
  private _selectedNodeEmployeesLoading: boolean;

  fluctuationTypeEnum = FluctuationType;
  fluctuationType: FluctuationType = FluctuationType.TOTAL;

  @Input() timeRange: IdValue;

  @Input() set orgChartData(orgChartData: OrgChartData) {
    this._orgChartData = orgChartData;

    if (orgChartData) {
      this.chartData = this.orgChartService.mapDimensionDataToNodes(
        orgChartData.data,
        orgChartData.translation,
        this.fluctuationType
      );
      this.updateChart();
    }
  }

  get orgChartData(): OrgChartData {
    return this._orgChartData;
  }

  @Input() isLoading = false;

  @Input() set selectedNodeEmployees(
    selectedNodeEmployees: OrgChartEmployee[]
  ) {
    this._selectedNodeEmployees = selectedNodeEmployees;
    this.updateDialogData();
  }

  get selectedNodeEmployees(): OrgChartEmployee[] {
    return this._selectedNodeEmployees;
  }

  @Input() set selectedNodeEmployeesLoading(
    selectedNodeEmployeesLoading: boolean
  ) {
    this._selectedNodeEmployeesLoading = selectedNodeEmployeesLoading;

    if (this._dialogRef && selectedNodeEmployeesLoading) {
      this._dialogRef.componentInstance.data.employees = undefined;
    }
  }

  get selectedNodeEmployeesLoading(): boolean {
    return this._selectedNodeEmployeesLoading;
  }

  @Output()
  readonly showParent: EventEmitter<DimensionFluctuationData> = new EventEmitter();

  @Output()
  readonly showOrgChartEmployees: EventEmitter<DimensionFluctuationData> = new EventEmitter();

  @Output()
  readonly loadChildAttritionOverTime: EventEmitter<DimensionFluctuationData> =
    new EventEmitter();

  @ViewChild('chartContainer') set chartContainer(chartContainer: ElementRef) {
    if (chartContainer) {
      this._chartContainer = chartContainer;
      this.updateChart();
    }
  }

  get chartContainer(): ElementRef {
    return this._chartContainer;
  }

  chart: any;
  chartData: OrgChartNode[];
  selectedDataNode: DimensionFluctuationData;

  constructor(
    private readonly orgChartService: OrgChartService,
    private readonly dialog: MatDialog
  ) {}

  @HostListener('document:click', ['$event']) clickout(event: any): void {
    const node: HTMLElement = event.target;
    const id = node.dataset.id;

    switch (node.id) {
      case OrgChartConfig.BUTTON_CSS.people: {
        this.selectedDataNode = this.getDimensionFluctuationDataById(id);

        this.showOrgChartEmployees.emit(this.selectedDataNode);

        const data = this.createEmployeeListDialogMeta();
        this._dialogRef = this.dialog.open(EmployeeListDialogComponent, {
          data,
        });

        break;
      }
      case OrgChartConfig.BUTTON_CSS.attrition: {
        this.selectedDataNode = this.getDimensionFluctuationDataById(id);
        this.loadChildAttritionOverTime.emit(this.selectedDataNode);
        const openPositionsAvailable =
          !DIMENSIONS_UNAVAILABLE_FOR_OPEN_POSITIONS.includes(
            this.selectedDataNode.filterDimension
          );
        const data = {
          type: ChartType.ORG_CHART,
          meta: this.orgChartService.createAttritionDialogMeta(
            this.selectedDataNode,
            this.timeRange.value,
            openPositionsAvailable
          ),
        };

        this.dialog.open(AttritionDialogComponent, {
          data,
          width: '90%',
          maxWidth: '750px',
        });

        break;
      }
      case OrgChartConfig.BUTTON_CSS.showUpArrow: {
        this.selectedDataNode = this.getDimensionFluctuationDataById(id);

        this.showParent.emit(this.selectedDataNode);

        break;
      }
      // No default
    }
  }

  ngAfterViewInit(): void {
    if (!this.chart) {
      // eslint-disable-next-line new-cap
      this.chart = new OrgChart();
    }

    this.updateChart();
  }

  getDimensionFluctuationDataById(id: string): DimensionFluctuationData {
    return this.orgChartData.data.find((elem) => elem.id === id);
  }

  updateChart(): void {
    if (
      !this.chart ||
      !this.chartData ||
      this.chartData.length === 0 ||
      !this.chartContainer
    ) {
      return;
    }

    // wait until view is initiated
    setTimeout(() => {
      const nodeWidth = 298;
      const nodeHeight =
        this.orgChartData.dimension === FilterDimension.ORG_UNIT ? 136 : 100;

      this.chart
        .container(this.chartContainer.nativeElement)
        .data(this.chartData)
        .svgHeight(
          this.chartContainer.nativeElement.getBoundingClientRect().height ||
            376 // default height
        )
        .svgWidth(
          this.chartContainer.nativeElement.getBoundingClientRect().height ||
            376
        ) // default width
        .backgroundColor('white')
        .initialZoom(1)
        .nodeWidth(() => nodeWidth)
        .nodeHeight(() => nodeHeight)
        .compact(false)
        .compactMarginBetween((_d: any) => 170)
        .childrenMargin((_d: any) => 70)
        .nodeContent(
          (d: { data: OrgChartNode; width: number; height: number }) =>
            this.orgChartService.getNodeContent(
              d.data,
              d.width,
              d.height,
              this.orgChartData.dimension
            )
        )
        .buttonContent(({ node }: any) =>
          this.orgChartService.getButtonContent(node)
        )
        .linkUpdate(() => this.orgChartService.updateLinkStyles())
        .render();

      this.chart.fit();
    });
  }

  updateDialogData(): void {
    if (this._dialogRef && this._dialogRef.componentInstance) {
      this._dialogRef.componentInstance.data =
        this.createEmployeeListDialogMeta();
    }
  }

  createEmployeeListDialogMeta(): EmployeeListDialogMeta {
    const dimension = translate(
      `filters.dimension.availableDimensions.${this.selectedDataNode.filterDimension}`
    );
    let value;
    let manager;
    if (this.selectedDataNode.filterDimension === FilterDimension.ORG_UNIT) {
      value = `${this.selectedDataNode.dimension} (${this.selectedDataNode.dimensionLongName})`;
      manager = this.selectedDataNode.managerOfOrgUnit;
    } else {
      value = this.selectedDataNode.dimension;
    }
    const timeframe = moment
      .unix(+this.timeRange.id.split('|')[1])
      .utc()
      .format('MMMM YYYY');

    const filters = new EmployeeListDialogMetaFilters(
      dimension,
      value,
      timeframe,
      manager
    );
    const title = translate('organizationalView.employeeListDialog.workforce');
    const headings = new EmployeeListDialogMetaHeadings(
      title,
      'people',
      false,
      filters
    );
    const customExcelFileName = `${title} ${value} ${timeframe}`;

    return new EmployeeListDialogMeta(
      headings,
      this.selectedNodeEmployees,
      this.selectedNodeEmployeesLoading,
      true,
      'workforce',
      undefined,
      customExcelFileName
    );
  }

  changeFluctuationType(change: MatButtonToggleChange) {
    const type = change.value;

    this.chartData.forEach((node) => {
      const totalFluctuationRate = this.orgChartService.getDisplayedValues(
        type,
        node.fluctuationRate
      );
      const directFluctuationRate = this.orgChartService.getDisplayedValues(
        type,
        node.directFluctuationRate
      );
      node.displayedTotalFluctuationRate = totalFluctuationRate;
      node.displayedDirectFluctuationRate = directFluctuationRate;
    });
    this.fluctuationType = type;
    this.chart.data(this.chartData).render();
  }
}
