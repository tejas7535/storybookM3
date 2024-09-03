import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { translate } from '@jsverse/transloco';

import { DoughnutChartData } from '../../../shared/charts/models';
import { SolidDoughnutChartConfig } from '../../../shared/charts/models/solid-doughnut-chart-config.model';
import { COLOR_PALETTE } from '../../store/selectors/reasons-and-counter-measures.selector.utils';

@Component({
  selector: 'ia-reasons-for-leaving-chart',
  templateUrl: './reasons-for-leaving-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonsForLeavingChartComponent {
  @Input() data: DoughnutChartData[];
  @Input() isLoading: boolean;

  config: SolidDoughnutChartConfig;

  @Input() set side(side: 'left' | 'right') {
    this.config = {
      title: '',
      color: COLOR_PALETTE,
      side,
    };
  }

  @Input() set title(title: string) {
    this.config = {
      ...this.config,
      title,
    };
  }

  @Input() set conductedInterviewsInfo(info: {
    conducted: number;
    percentage: number;
  }) {
    if (info) {
      this.config = {
        ...this.config,
        title: translate(
          'reasonsAndCounterMeasures.reasonsForLeaving.chart.titleOverallReasons'
        ),
        subTitle: translate(
          'reasonsAndCounterMeasures.reasonsForLeaving.chart.conductedInfo',
          {
            conducted: info.conducted,
            percentage: info.percentage,
          }
        ),
      };
    }
  }
}
