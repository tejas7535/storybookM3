import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { EChartsOption } from 'echarts';

import { BarChartData } from '../../models';
import { ChartConfigService } from '../../services/chart.config.service';

@Component({
  selector: 'gq-quotation-by-product-line-or-gpsd-bar-chart',
  templateUrl: './quotation-by-product-line-or-gpsd-bar-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class QuotationByProductLineOrGpsdBarChartComponent
  implements OnInit, OnChanges
{
  @Input() data: BarChartData[];
  public options: EChartsOption;
  public updatedOptions: EChartsOption;

  constructor(private readonly chartConfigService: ChartConfigService) {}

  ngOnInit(): void {
    this.options = this.getOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.data &&
      changes.data.previousValue !== changes.data.currentValue
    ) {
      this.options = this.getOptions();
    }
  }

  private getOptions(): EChartsOption {
    const seriesConfig = this.chartConfigService.getSeriesConfig(this.data);
    const options: EChartsOption = {
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

    return options;
  }
}
