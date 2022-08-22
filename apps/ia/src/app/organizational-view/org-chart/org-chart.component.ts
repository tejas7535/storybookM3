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
import { MatDialog } from '@angular/material/dialog';

import { TranslocoService } from '@ngneat/transloco';
import { OrgChart } from 'd3-org-chart';

import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { EmployeeListDialogMeta } from '../../shared/employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { ChartType } from '../models/chart-type.enum';
import { OrgUnitFluctuationData } from '../models/org-unit-fluctuation-data.model';
import * as OrgChartConfig from './models/org-chart-config';
import { OrgChartService } from './org-chart.service';

@Component({
  selector: 'ia-org-chart',
  templateUrl: './org-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartComponent implements AfterViewInit {
  private _data: OrgUnitFluctuationData[] = [];

  @Input() set data(data: OrgUnitFluctuationData[]) {
    this._data = data;
    this.chartData = this.orgChartService.mapOrgUnitsToNodes(data);
    this.updateChart();
  }

  get data(): OrgUnitFluctuationData[] {
    return this._data;
  }

  @Input() isLoading = false;

  @Output()
  readonly showParent: EventEmitter<OrgUnitFluctuationData> = new EventEmitter();

  @Output()
  readonly loadMeta: EventEmitter<OrgUnitFluctuationData> = new EventEmitter();

  @ViewChild('chartContainer') chartContainer: ElementRef;

  chart: any;
  chartData: any[];

  constructor(
    private readonly orgChartService: OrgChartService,
    private readonly dialog: MatDialog,
    private readonly translocoService: TranslocoService
  ) {}

  @HostListener('document:click', ['$event']) clickout(event: any): void {
    const node: HTMLElement = event.target;
    const id = node.dataset.id;
    const orgUnit = this.data.find((elem) => elem.id === id);

    switch (node.id) {
      case OrgChartConfig.BUTTON_CSS.people: {
        const data = new EmployeeListDialogMeta(
          new EmployeeListDialogMetaHeadings(
            `${orgUnit.managerOfOrgUnit} (${orgUnit.orgUnit})`,
            this.translocoService.translate(
              'employeeListDialog.contentTitle',
              {},
              'organizational-view'
            )
          ),
          orgUnit.directLeafChildren,
          true // TODO
        );
        this.dialog.open(EmployeeListDialogComponent, {
          data,
        });

        break;
      }
      case OrgChartConfig.BUTTON_CSS.attrition: {
        this.loadMeta.emit(orgUnit);
        this.dialog.open(AttritionDialogComponent, {
          data: ChartType.ORG_CHART,
          width: '90%',
          maxWidth: '750px',
        });

        break;
      }
      case OrgChartConfig.BUTTON_CSS.showUpArrow: {
        this.showParent.emit(orgUnit);

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
    // wait until view is initiated to get template from this tab instead of previous one
    setTimeout(() => {
      this.updateChart();
    });
  }

  updateChart(): void {
    if (!this.chart || !this.chartData || this.chartData.length === 0) {
      return;
    }

    this.chart
      .container(this.chartContainer.nativeElement)
      .data(this.chartData)
      .svgHeight(
        this.chartContainer.nativeElement.getBoundingClientRect().height
      )
      .backgroundColor('white')
      .initialZoom(0.8)
      .nodeWidth(() => 320)
      .nodeHeight(() => 207)
      .compact(false)
      .nodeContent((d: any) => this.orgChartService.getNodeContent(d.data))
      .buttonContent(({ node }: any) =>
        this.orgChartService.getButtonContent(node)
      )
      .linkUpdate(() => this.orgChartService.updateLinkStyles())
      .render();

    this.chart.fit();
  }
}
