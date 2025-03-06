import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

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
  standalone: false,
})
export class TransparencyGraphComponent implements OnChanges {
  options: EChartsOption;

  @Input() transactions: ComparableLinkedTransaction[];
  @Input() coefficients: Coefficients;
  @Input() currency: string;
  @Input() currentEurExchangeRatio: number;
  @Input() customer: Customer;
  @Input() userHasGpcRole: boolean;
  @Input() hideRolesHint: boolean;
  @Input() recommendationType: RecommendationType;

  private readonly chartConfigService = inject(ChartConfigService);
  private readonly regressionService = inject(RegressionService);

  ngOnChanges(_changes: SimpleChanges): void {
    this.updateOptions();
  }

  private updateOptions() {
    // graph can only be drawn if these values are available
    if (!this.transactions || !this.coefficients) {
      return;
    }

    const dataPoints = this.chartConfigService.buildDataPoints(
      this.transactions,
      this.currency,
      this.recommendationType
    );

    const regressionData = this.regressionService.buildRegressionPoints(
      this.coefficients,
      this.transactions,
      this.recommendationType,
      this.currentEurExchangeRatio
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
        this.transactions
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
