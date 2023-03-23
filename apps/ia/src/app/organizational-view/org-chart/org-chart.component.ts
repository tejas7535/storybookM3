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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { TranslocoService } from '@ngneat/transloco';
import { OrgChart } from 'd3-org-chart';

import { BASIC_LIST_ITEM_HEIGHT } from '../../shared/constants';
import { EmployeeListDialogComponent } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogMeta } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogMetaHeadings } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { FilterDimension } from '../../shared/models';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { ChartType } from '../models/chart-type.enum';
import { DimensionFluctuationData } from '../models/dimension-fluctuation-data.model';
import { OrgChartData, OrgChartEmployee } from './models';
import * as OrgChartConfig from './models/org-chart-config';
import { OrgChartService } from './org-chart.service';

@Component({
  selector: 'ia-org-chart',
  templateUrl: './org-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartComponent implements AfterViewInit {
  private _dialogRef: MatDialogRef<EmployeeListDialogComponent>;
  private _orgChartData: OrgChartData;
  private _chartContainer: ElementRef;
  private _selectedNodeEmployees: OrgChartEmployee[];
  private _selectedNodeEmployeesLoading: boolean;

  @Input() set orgChartData(orgChartData: OrgChartData) {
    const old = this._orgChartData;
    this._orgChartData = orgChartData;
    const orgChartTranslations = this.translocoService.translateObject(
      'organizationalView.orgChart.table'
    );
    this.chartData = this.orgChartService.mapDimensionDataToNodes(
      orgChartData.data,
      orgChartTranslations
    );

    if (old !== undefined && orgChartData !== undefined) {
      const shouldUpdateChart = this.orgChartNodesChanged(orgChartData, old);

      if (shouldUpdateChart) {
        this.updateChart();
      }
    }
  }

  get orgChartData(): OrgChartData {
    return this._orgChartData;
  }

  @Input() isLoading = false;

  @Input() set selectedNodeEmployees(selectedNodeEmployees: any[]) {
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
    this.updateDialogData();
  }

  get selectedNodeEmployeesLoading(): boolean {
    return this._selectedNodeEmployeesLoading;
  }

  @Output()
  readonly showParent: EventEmitter<DimensionFluctuationData> = new EventEmitter();

  @Output()
  readonly showOrgChartEmployees: EventEmitter<DimensionFluctuationData> = new EventEmitter();

  @Output()
  readonly loadMeta: EventEmitter<DimensionFluctuationData> = new EventEmitter();

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
  chartData: any[];
  selectedDataNode: DimensionFluctuationData;

  constructor(
    private readonly orgChartService: OrgChartService,
    private readonly dialog: MatDialog,
    private readonly translocoService: TranslocoService
  ) {}

  @HostListener('document:click', ['$event']) clickout(event: any): void {
    const node: HTMLElement = event.target;
    const id = node.dataset.id;
    this.selectedDataNode = this.orgChartData.data.find(
      (elem) => elem.id === id
    );

    switch (node.id) {
      case OrgChartConfig.BUTTON_CSS.people: {
        this.showOrgChartEmployees.emit(this.selectedDataNode);

        const data = this.createEmployeeListDialogMeta();
        this._dialogRef = this.dialog.open(EmployeeListDialogComponent, {
          data,
        });

        break;
      }
      case OrgChartConfig.BUTTON_CSS.attrition: {
        this.loadMeta.emit(this.selectedDataNode);
        this.dialog.open(AttritionDialogComponent, {
          data: ChartType.ORG_CHART,
          width: '90%',
          maxWidth: '750px',
        });

        break;
      }
      case OrgChartConfig.BUTTON_CSS.showUpArrow: {
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
      const nodeWidth =
        this.orgChartData.dimension === FilterDimension.ORG_UNIT ? 320 : 250;
      const nodeHeight =
        this.orgChartData.dimension === FilterDimension.ORG_UNIT ? 207 : 170;

      this.chart
        .container(this.chartContainer.nativeElement)
        .data(this.chartData)
        .svgHeight(
          this.chartContainer.nativeElement.getBoundingClientRect().height ||
            376 // default height
        )
        .backgroundColor('white')
        .initialZoom(0.8)
        .nodeWidth(() => nodeWidth)
        .nodeHeight(() => nodeHeight)
        .compact(false)
        .nodeContent((d: any) =>
          this.orgChartService.getNodeContent(
            d.data,
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
    const title =
      this.selectedDataNode.filterDimension === FilterDimension.ORG_UNIT
        ? `${this.selectedDataNode.managerOfOrgUnit} (${this.selectedDataNode.dimension})`
        : this.selectedDataNode.dimension;

    return new EmployeeListDialogMeta(
      new EmployeeListDialogMetaHeadings(
        title,
        this.translocoService.translate(
          'employeeListDialog.contentTitle',
          {},
          'organizational-view'
        )
      ),
      this.selectedNodeEmployees,
      this.selectedNodeEmployeesLoading,
      this.selectedDataNode.directEmployees ===
        this.selectedNodeEmployees.length,
      BASIC_LIST_ITEM_HEIGHT,
      false
    );
  }

  orgChartNodesChanged = (a: any, b: any) => {
    const differences = Object.fromEntries(
      Object.entries(b).filter(([key, val]) => key in a && a[key] !== val)
    );

    // org chart changed only when new data has been loaded
    return differences.data !== undefined;
  };
}
