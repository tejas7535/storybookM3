import { Component, Input, OnInit } from '@angular/core';

import { ECharts } from 'echarts';

import { DataPoint } from '@cdba/shared/components/bom-chart/data-point.model';
import { CHART_HIGHLIGHT_INFO } from '@cdba/shared/constants/colors';
import { ComparisonDetail } from '@cdba/shared/models/comparison.model';

import { ComparisonDetailsChartService } from '../service/comparison-details-chart.service';

@Component({
  selector: 'cdba-comparison-chart',
  standalone: false,
  templateUrl: './comparison-chart.component.html',
})
export class ComparisonChartComponent implements OnInit {
  @Input()
  details: ComparisonDetail[];
  @Input()
  currency: string;

  eChartsInstance: ECharts;
  eChartOptions: any;

  invariantBarSeriesData: DataPoint[];

  constructor(private readonly chartService: ComparisonDetailsChartService) {}

  ngOnInit(): void {
    this.eChartOptions = this.chartService.provideParetoChartConfig(
      this.details,
      this.currency
    );
  }

  findBarChartIndex(): number {
    const index = this.eChartOptions.series.findIndex(
      (series: any) => series.type === 'bar'
    );
    if (index === -1) {
      // Only possible when the bar chart config was altered
      throw new Error('Bar chart series not found');
    }

    return index;
  }

  onChartInit(ec: ECharts): void {
    if (!ec) {
      throw new Error('ECharts instance is not defined');
    }

    this.eChartsInstance = ec;

    if (this.eChartOptions?.series) {
      this.invariantBarSeriesData =
        this.eChartOptions.series[this.findBarChartIndex()]?.data;
    }
  }

  filterCostTypes(costTypes: string[]): void {
    const barSeriesIndex = this.findBarChartIndex();

    if (costTypes.length > 0) {
      const highlightedDetails: DataPoint[] = [];

      for (const dataPoint of this.invariantBarSeriesData) {
        if (costTypes.includes(dataPoint.name)) {
          highlightedDetails.push({
            ...dataPoint,
            itemStyle: {
              ...dataPoint.itemStyle,
              color: CHART_HIGHLIGHT_INFO,
            },
          });
        } else {
          highlightedDetails.push(dataPoint);
        }
      }

      this.eChartOptions.series[barSeriesIndex].data = highlightedDetails;
    } else {
      this.eChartOptions.series[barSeriesIndex].data =
        this.invariantBarSeriesData;
    }

    this.eChartsInstance?.setOption(this.eChartOptions);
  }
}
