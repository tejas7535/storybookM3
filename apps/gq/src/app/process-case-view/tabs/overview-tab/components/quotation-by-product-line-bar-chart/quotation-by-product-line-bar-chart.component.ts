import { Component, Input, OnInit } from '@angular/core';

import { EChartsOption } from 'echarts';

import { BarChartData } from '../quotation-by-product-line/models/bar-chart-data.model';
import { ChartConfigService } from '../quotation-by-product-line/services/chart.config.service';

@Component({
  selector: 'gq-quotation-by-product-line-bar-chart',
  templateUrl: './quotation-by-product-line-bar-chart.component.html',
})
export class QuotationByProductLineBarChartComponent implements OnInit {
  @Input() data: BarChartData[];
  public options: EChartsOption;

  constructor(private readonly chartConfigService: ChartConfigService) {}

  ngOnInit(): void {
    const seriesConfig = this.chartConfigService.getSeriesConfig(this.data);
    this.options = {
      tooltip: this.chartConfigService.getTooltipConfig(),
      xAxis: this.chartConfigService.getXAxisConfig(this.data),
      yAxis: {
        type: 'category',
        show: false,
      },
      series: seriesConfig,
      legend: this.chartConfigService.getLegend(seriesConfig),
      grid: {
        left: '4rem',
        right: '4rem',
        top: '0rem',
        height: '20rem',
        bottom: '1rem',
      },
      color: this.chartConfigService.COLORS,
    };
  }
}
