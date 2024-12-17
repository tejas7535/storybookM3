import { Component, Input } from '@angular/core';

import { BarChartConfig } from '../../shared/charts/models';

@Component({
  selector: 'ia-feature-analysis',
  templateUrl: './feature-analysis.component.html',
})
export class FeatureAnalysisComponent {
  @Input()
  barChartConfigs: BarChartConfig[];

  @Input()
  loading: boolean;
}
