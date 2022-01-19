import { Component, Input } from '@angular/core';

import { EChartsOption } from 'echarts';

import { FeatureImportanceGroup } from '../models';
import { createFeaturesImportanceConfig } from './feature-importance.config';

@Component({
  selector: 'ia-feature-importance',
  templateUrl: './feature-importance.component.html',
})
export class FeatureImportanceComponent {
  @Input() loading: boolean;
  @Input() title: string;
  @Input() xAxisName: string;
  @Input() legendTop: string;
  @Input() legendTitle: string;
  @Input() legendBottom: string;
  @Input() set groups(groups: FeatureImportanceGroup[]) {
    if (groups) {
      this.initChart(groups);
    }
  }

  options: EChartsOption;

  initChart(groups: FeatureImportanceGroup[]): void {
    this.options = createFeaturesImportanceConfig(
      groups,
      this.title,
      this.xAxisName
    );
  }
}
