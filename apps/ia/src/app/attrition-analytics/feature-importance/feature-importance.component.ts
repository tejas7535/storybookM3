import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EChartsOption } from 'echarts';

import { SortDirection } from '../../shared/models';
import { FeatureImportanceGroup } from '../models';
import { createFeaturesImportanceConfig } from './feature-importance.config';

@Component({
  selector: 'ia-feature-importance',
  templateUrl: './feature-importance.component.html',
})
export class FeatureImportanceComponent {
  @Input() hasNextFeatures: boolean;
  @Input() loading: boolean;

  @Output()
  private readonly loadNext: EventEmitter<void> = new EventEmitter();

  options: EChartsOption;
  sortDirectionEnum = SortDirection;

  @Input() set groups(groups: FeatureImportanceGroup[]) {
    if (groups) {
      this.initChart(groups);
    }
  }

  initChart(groups: FeatureImportanceGroup[]): void {
    this.options = createFeaturesImportanceConfig(groups);
  }

  loadNextFeatures(): void {
    this.loadNext.emit();
  }
}
