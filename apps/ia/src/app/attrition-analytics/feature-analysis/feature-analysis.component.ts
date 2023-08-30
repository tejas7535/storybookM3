import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BarChartConfig } from '../../shared/charts/models';
import { FeatureParams } from '../models';

@Component({
  selector: 'ia-feature-analysis',
  templateUrl: './feature-analysis.component.html',
})
export class FeatureAnalysisComponent {
  @Input()
  barChartConfigs: BarChartConfig[];

  @Input()
  loading: boolean;

  @Input()
  region: string;

  @Input()
  selectedFeatures: FeatureParams[];

  @Output()
  reorderFeatures = new EventEmitter<FeatureParams[]>();

  @Output()
  editFeatureSelection = new EventEmitter<void>();

  readonly NUMBER_OF_TILES = 4;

  drop(event: CdkDragDrop<string[]>): void {
    const reorderedFeatures = [...this.selectedFeatures];
    moveItemInArray(reorderedFeatures, event.previousIndex, event.currentIndex);

    this.reorderFeatures.emit(reorderedFeatures);
  }

  openEditFeatureSelectorDialog() {
    this.editFeatureSelection.emit();
  }

  trackByFn(index: number): number {
    return index;
  }
}
