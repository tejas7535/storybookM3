import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import { SolidDoughnutChartConfig } from '../../../shared/charts/models/solid-doughnut-chart-config.model';

@Component({
  selector: 'ia-reasons-for-leaving-chart',
  templateUrl: './reasons-for-leaving-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonsForLeavingChartComponent {
  TOP_TITLE_POSITION = 165;
  CENTER_TITLE_POSITION = 'center';
  SHORT_HEIGHT_LEGEND = 74;
  FULL_HEIGHT_LEGEND = 'auto';

  @Input() config: SolidDoughnutChartConfig;
  @Input() data: DoughnutChartData[];
  @Input() isLoading: boolean;

  @Input() comparedConfig: SolidDoughnutChartConfig;
  @Input() comparedData: DoughnutChartData[];
  @Input() comparedIsLoading: boolean;
}
