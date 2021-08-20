import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BarChartConfig } from '../../shared/charts/models/bar-chart-config.model';

@Component({
  selector: 'ia-employee-analytics',
  templateUrl: './employee-analytics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeAnalyticsComponent {
  @Input() config: BarChartConfig;
}
