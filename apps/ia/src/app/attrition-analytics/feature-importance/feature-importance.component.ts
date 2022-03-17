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
  @Input() loading: boolean;
  @Input() set groups(groups: FeatureImportanceGroup[]) {
    if (groups) {
      this.initChart(groups);
    }
  }
  @Input() hasNextFeatures: boolean;
  @Input() sortDirection: SortDirection;

  @Output()
  private readonly loadNext: EventEmitter<void> = new EventEmitter();

  @Output()
  private readonly toggleSort: EventEmitter<void> = new EventEmitter();

  options: EChartsOption;
  sortDirectionEnum = SortDirection;

  initChart(groups: FeatureImportanceGroup[]): void {
    this.options = createFeaturesImportanceConfig(groups);
  }

  loadNextFeatures(): void {
    this.loadNext.emit();
  }

  toggleSortDirection(): void {
    this.toggleSort.emit();
  }
}
