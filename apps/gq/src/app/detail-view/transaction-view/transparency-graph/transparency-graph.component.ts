import { Component, Input, OnInit } from '@angular/core';

import { EChartsOption } from 'echarts';

import { Transaction } from '../../../core/store/reducers/transactions/models/transaction.model';
import { DATA_ZOOM, GRID_CONFIG, LEGEND } from './echarts/chart.config';
import { ChartConfigService } from './echarts/chart.config.service';

@Component({
  selector: 'gq-transparency-graph',
  templateUrl: './transparency-graph.component.html',
})
export class TransparencyGraphComponent implements OnInit {
  options: EChartsOption;

  @Input() transactions: Transaction[];

  constructor(private readonly chartConfigService: ChartConfigService) {}
  ngOnInit(): void {
    if (this.transactions) {
      const dataPoints = this.chartConfigService.buildDataPoints(
        this.transactions
      );

      this.options = {
        tooltip: this.chartConfigService.getToolTipConfig(),
        xAxis: this.chartConfigService.getXAxisConfig(dataPoints),
        yAxis: this.chartConfigService.Y_AXIS_CONFIG,
        series: this.chartConfigService.getSeriesConfig(dataPoints),
        grid: GRID_CONFIG,
        dataZoom: DATA_ZOOM,
        legend: LEGEND,
      };
    }
  }
}
