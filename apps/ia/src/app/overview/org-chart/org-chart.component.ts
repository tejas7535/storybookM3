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

import { first } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import d3OrgChart from 'd3-org-chart';

import { AttritionDialogComponent } from '../../shared/attrition-dialog/attrition-dialog.component';
import { Employee } from '../../shared/models';
import { OverviewState } from '../store';
import { getAttritionDataForOrgchart } from '../store/selectors/overview.selector';
import { OrgChartService } from './org-chart.service';

@Component({
  selector: 'ia-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartComponent implements AfterViewInit {
  @Input() set data(data: Employee[]) {
    this.chartData = this.orgChartService.mapEmployeesToNodes(data);
    this.updateChart();
  }

  @Input() isLoading = false;

  @ViewChild('chartContainer') chartContainer: ElementRef;

  chart: any;
  chartData: any[];

  public constructor(
    private readonly orgChartService: OrgChartService,
    private readonly dialog: MatDialog,
    private readonly store: Store<OverviewState>
  ) {}

  @HostListener('document:click', ['$event']) clickout(event: any): void {
    const node: Node = event.target;

    if ((node as Element).classList.contains('employee-node-people')) {
      const clickedNode = (node as Element).getAttribute('data-id');
      console.log('Show employee list of ', clickedNode);
    } else if (
      (node as Element).classList.contains('employee-node-attrition')
    ) {
      const employeeId = (node as Element).getAttribute('data-id');
      this.store
        .pipe(select(getAttritionDataForOrgchart, { employeeId }), first())
        .subscribe((data) => {
          this.dialog.open(AttritionDialogComponent, {
            data,
          });
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
