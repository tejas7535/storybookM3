import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';

import d3OrgChart from 'd3-org-chart';

import { Employee } from '../../shared/models';
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

  public constructor(private readonly orgChartService: OrgChartService) {}

  @HostListener('document:click', ['$event']) clickout(event: any): void {
    const node: Node = event.target;

    if ((node as Element).classList.contains('employee-node-people')) {
      const clickedNote = (node as Element).getAttribute('data-id');
      console.log('Show employee list of ', clickedNote);
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

    this.chart
      .container(this.chartContainer.nativeElement)
      .data(this.chartData)
      .backgroundColor('white')
      .svgHeight(700)
      .initialZoom(0.95)
      .marginTop(30)
      .render();
  }
}
