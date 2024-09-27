import { Component, Input, OnInit } from '@angular/core';

import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';
import { RecommendationType } from '@gq/core/store/transactions/models/recommendation-type.enum';
import { Customer } from '@gq/shared/models/customer';
import { Coefficients } from '@gq/shared/models/quotation-detail';
import { EChartsOption } from 'echarts';

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

  @Input() set transactions(value: ComparableLinkedTransaction[]) {
    this.transactionValues = value;

    if (this.coefficients && this.currency) {
      this.updateOptions(value);
    }
  }
  @Input() coefficients: Coefficients;
  @Input() currency: string;
  @Input() customer: Customer;
  @Input() userHasGpcRole: boolean;
  @Input() hideRolesHint: boolean;
  @Input() recommendationType: RecommendationType;

  transactionValues: ComparableLinkedTransaction[] = [];

  ngOnInit(): void {
    if (this.transactionValues && this.coefficients && this.currency) {
      this.updateOptions(this.transactionValues);
    }
  }

  private updateOptions(transactions: ComparableLinkedTransaction[]) {
    const dataPoints = this.chartConfigService.buildDataPoints(
      transactions,
      this.currency,
      this.recommendationType
    );

    const regressionData = this.regressionService.buildRegressionPoints(
      this.coefficients,
      transactions
    );

    const seriesConfig = this.chartConfigService.getSeriesConfig(
      dataPoints,
      regressionData,
      this.customer
    );

    this.options = {
      tooltip: this.chartConfigService.getToolTipConfig(
        this.userHasGpcRole,
        this.recommendationType
      ),
      xAxis: this.chartConfigService.getXAxisConfig(dataPoints),
      yAxis: this.chartConfigService.getYAxisConfig(
        this.recommendationType,
        transactions
      ),
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
