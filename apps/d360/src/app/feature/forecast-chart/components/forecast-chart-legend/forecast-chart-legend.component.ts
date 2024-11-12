import { Component } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';

import { chartSeriesConfig } from '../../model';

@Component({
  selector: 'd360-forecast-chart-legend',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './forecast-chart-legend.component.html',
  styleUrl: './forecast-chart-legend.component.scss',
})
export class ForecastChartLegendComponent {
  public colors = chartSeriesConfig;
}
