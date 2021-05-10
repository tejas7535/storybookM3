import { Component, Input, OnInit } from '@angular/core';

import { EChartsOption } from 'echarts';

import { Transaction } from '../../../core/store/reducers/transactions/models/transaction.model';
import { Coefficients } from '../../../shared/models/quotation-detail';
import { DATA_ZOOM, GRID_CONFIG, LEGEND } from './echarts/chart.config';
import { ChartConfigService } from './echarts/chart.config.service';
import { RegressionService } from './echarts/regression.service';

@Component({
  selector: 'gq-transparency-graph',
  templateUrl: './transparency-graph.component.html',
})
export class TransparencyGraphComponent implements OnInit {
  options: EChartsOption;

  @Input() transactions: Transaction[];
  @Input() coefficients: Coefficients;
  constructor(
    private readonly chartConfigService: ChartConfigService,
    private readonly regressionService: RegressionService
  ) {}
  ngOnInit(): void {
    if (this.transactions && this.coefficients) {
      const dataPoints = this.chartConfigService.buildDataPoints(
        this.transactions
      );
      const regressionData = this.regressionService.buildRegressionPoints(
        this.coefficients,
        this.transactions
      );

      this.options = {
        tooltip: this.chartConfigService.getToolTipConfig(),
        xAxis: this.chartConfigService.getXAxisConfig(dataPoints),
        yAxis: this.chartConfigService.Y_AXIS_CONFIG,
        series: this.chartConfigService.getSeriesConfig(
          dataPoints,
          regressionData
        ),
        grid: GRID_CONFIG,
        dataZoom: DATA_ZOOM,
        legend: LEGEND,
      };
    }
  }
}
