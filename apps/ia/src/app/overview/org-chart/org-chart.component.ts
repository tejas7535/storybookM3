import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import d3OrgChart from 'd3-org-chart';

import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { TeamMemberDialogComponent } from '../team-member-dialog/team-member-dialog.component';
import { OrgChartEmployee } from './models/org-chart-employee.model';
import { OrgChartService } from './org-chart.service';

@Component({
  selector: 'ia-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartComponent implements AfterViewInit {
  private _showHeatMap = false;
  private _data: OrgChartEmployee[] = [];

  @Input() set data(data: OrgChartEmployee[]) {
    this._data = data;
    this.chartData = this.orgChartService.mapEmployeesToNodes(
      data,
      this.showHeatMap
    );
    this.updateChart();
  }

  @Input() isLoading = false;

  @Input() set showHeatMap(showHeatMap: boolean) {
    this._showHeatMap = showHeatMap;
    this.chartData = this.orgChartService.mapEmployeesToNodes(
      this.data,
      showHeatMap
    );
    this.updateChart();
  }

  get showHeatMap(): boolean {
    return this._showHeatMap;
  }

  get data(): OrgChartEmployee[] {
    return this._data;
  }

  @ViewChild('chartContainer') chartContainer: ElementRef;

  chart: any;
  chartData: any[];

  public constructor(
    private readonly orgChartService: OrgChartService,
    private readonly dialog: MatDialog
  ) {}

  @HostListener('document:click', ['$event']) clickout(event: any): void {
    const node: Element = event.target;
    const employeeId = node.getAttribute('data-id');
    const employee = this.data.find((elem) => elem.employeeId === employeeId);

    if (node.classList.contains('employee-node-people')) {
      this.dialog.open(TeamMemberDialogComponent, {
        data: employee,
      });
    } else if (node.classList.contains('employee-node-attrition')) {
      const data = employee?.attritionMeta;
      this.dialog.open(AttritionDialogComponent, {
        data,
      });
    }
  }

  public ngAfterViewInit(): void {
    if (!this.chart) {
      this.chart = new d3OrgChart();
    }
    this.updateChart();
  }

  public updateChart(): void {
    if (!this.chart || !this.chartData || !this.chartData.length) {
      return;
    }

    setTimeout(() => {
      this.chart
        .container(this.chartContainer.nativeElement)
        .data(this.chartData)
        .backgroundColor('white')
        .svgHeight(700)
        .svgWidth(window.innerWidth)
        .initialZoom(0.95)
        .marginTop(30)
        .render();
    }, 100);
  }
}
