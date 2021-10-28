import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import { SolidDoughnutChartConfig } from '../../../shared/charts/models/solid-doughnut-chart-config.model';

@Component({
  selector: 'ia-reasons-for-leaving-chart',
  templateUrl: './reasons-for-leaving-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonsForLeavingChartComponent {
  @Input() config: SolidDoughnutChartConfig;
  @Input() data: DoughnutChartData[];
  @Input() isLoading: boolean;
  @Input() orgUnit: string;

  @Input() comparedConfig: SolidDoughnutChartConfig;
  @Input() comparedData: DoughnutChartData[];
  @Input() comparedIsLoading: boolean;
  @Input() comparedOrgUnit: string;
}
