import { Component, Input, OnInit } from '@angular/core';

import { EChartsOption } from 'echarts';

import { ComparableLinkedTransaction } from '../../../core/store/reducers/transactions/models/comparable-linked-transaction.model';
import { Customer } from '../../../shared/models/customer';
import { Coefficients } from '../../../shared/models/quotation-detail';
import { DATA_ZOOM, GRID_CONFIG } from './echarts/chart.config';
import { ChartConfigService } from './echarts/chart.config.service';
import { RegressionService } from './echarts/regression.service';

@Component({
  selector: 'gq-transparency-graph',
  templateUrl: './transparency-graph.component.html',
})
export class TransparencyGraphComponent implements OnInit {
  options: EChartsOption;

  constructor(
    private readonly chartConfigService: ChartConfigService,
    private readonly regressionService: RegressionService
  ) {}

  @Input() transactions: ComparableLinkedTransaction[];
  @Input() coefficients: Coefficients;
  @Input() currency: string;
  @Input() customer: Customer;

  ngOnInit(): void {
    if (this.transactions && this.coefficients && this.currency) {
      const dataPoints = this.chartConfigService.buildDataPoints(
        this.transactions,
        this.currency
      );
      const regressionData = this.regressionService.buildRegressionPoints(
        this.coefficients,
        this.transactions
      );

      const seriesConfig = this.chartConfigService.getSeriesConfig(
        dataPoints,
        regressionData,
        this.customer
      );
      this.options = {
        tooltip: this.chartConfigService.getToolTipConfig(),
        xAxis: this.chartConfigService.getXAxisConfig(dataPoints),
        yAxis: this.chartConfigService.Y_AXIS_CONFIG,
        series: seriesConfig.series,
        grid: GRID_CONFIG,
        dataZoom: DATA_ZOOM,
        legend: this.chartConfigService.getLegend(
          this.customer,
          seriesConfig.series,
          seriesConfig.options
        ),
      };
    }
  }
}
