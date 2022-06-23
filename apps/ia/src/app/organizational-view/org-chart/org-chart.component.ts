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
import { Employee } from '../../shared/models';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { AttritionDialogMeta } from '../attrition-dialog/models/attrition-dialog-meta.model';
import * as OrgChartConfig from './models/org-chart-config';
import { OrgChartService } from './org-chart.service';

@Component({
  selector: 'ia-org-chart',
  templateUrl: './org-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartComponent implements AfterViewInit {
  private _data: Employee[] = [];

  @Input() set data(data: Employee[]) {
    this._data = data;
    this.chartData = this.orgChartService.mapEmployeesToNodes(data);
    this.updateChart();
  }

  get data(): Employee[] {
    return this._data;
  }

  @Input() isLoading = false;

  @Input() selectedTimeRange = '';

  @Output()
  readonly showParent: EventEmitter<Employee> = new EventEmitter();

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
    const employeeId = node.dataset.id;
    const employee = this.data.find((elem) => elem.employeeId === employeeId);

    switch (node.id) {
      case OrgChartConfig.BUTTON_CSS.people: {
        const data = new EmployeeListDialogMeta(
          new EmployeeListDialogMetaHeadings(
            `${employee.employeeName} (${employee.orgUnit})`,
            this.translocoService.translate(
              'employeeListDialog.contentTitle',
              {},
              'organizational-view'
            )
          ),
          employee.directLeafChildren
        );
        this.dialog.open(EmployeeListDialogComponent, {
          data,
        });

        break;
      }
      case OrgChartConfig.BUTTON_CSS.attrition: {
        const attritionMeta = employee?.attritionMeta;
        const data = new AttritionDialogMeta(
          attritionMeta,
          this.selectedTimeRange
        );
        this.dialog.open(AttritionDialogComponent, {
          data,
          width: '90%',
          maxWidth: '750px',
        });

        break;
      }
      case OrgChartConfig.BUTTON_CSS.showUpArrow: {
        this.showParent.emit(employee);

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
