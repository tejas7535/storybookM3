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
import d3OrgChart from 'd3-org-chart';

import { EmployeeListDialogMetaHeadings } from '../../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { EmployeeListDialogMeta } from '../../shared/employee-list-dialog/employee-list-dialog-meta.model';
import { EmployeeListDialogComponent } from '../../shared/employee-list-dialog/employee-list-dialog.component';
import { Employee } from '../../shared/models/employee.model';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { AttritionDialogMeta } from '../attrition-dialog/models/attrition-dialog-meta.model';
import * as OrgChartConfig from './models/org-chart-config';
import { OrgChartService } from './org-chart.service';

@Component({
  selector: 'ia-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
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

  public constructor(
    private readonly orgChartService: OrgChartService,
    private readonly dialog: MatDialog,
    private readonly translocoService: TranslocoService
  ) {}

  @HostListener('document:click', ['$event']) clickout(event: any): void {
    const node: Element = event.target;
    const employeeId = node.getAttribute('data-id');
    const employee = this.data.find((elem) => elem.employeeId === employeeId);

    if (node.classList.contains(OrgChartConfig.BUTTON_CSS.people)) {
      const data = new EmployeeListDialogMeta(
        new EmployeeListDialogMetaHeadings(
          `${employee.employeeName} (${employee.orgUnit})`,
          undefined,
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
    } else if (node.classList.contains(OrgChartConfig.BUTTON_CSS.attrition)) {
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
    } else if (node.classList.contains(OrgChartConfig.BUTTON_CSS.showUpArrow)) {
      this.showParent.emit(employee);
    }
  }

  public ngAfterViewInit(): void {
    if (!this.chart) {
      // eslint-disable-next-line new-cap
      this.chart = new d3OrgChart();
    }
    this.updateChart();
  }

  public updateChart(): void {
    if (!this.chart || !this.chartData || this.chartData.length === 0) {
      return;
    }

    this.chart
      .container(this.chartContainer.nativeElement)
      .data(this.chartData)
      .backgroundColor('white')
      .svgHeight('650px')
      .svgWidth(window.innerWidth)
      .initialZoom(0.95)
      .marginTop(50)
      .render();
  }
}
