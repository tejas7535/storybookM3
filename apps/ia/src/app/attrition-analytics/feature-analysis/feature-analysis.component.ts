import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { filter, Subscription } from 'rxjs';

import { BarChartConfig } from '../../shared/charts/models';
import { FeaturesDialogComponent } from '../features-dialog/features-dialog.component';
import { FeatureParams } from '../models';
import { FeatureSelector } from '../models/feature-selector.model';

@Component({
  selector: 'ia-feature-analysis',
  templateUrl: './feature-analysis.component.html',
})
export class FeatureAnalysisComponent {
  readonly NUMBER_OF_TILES = 4;

  @Input()
  allFeatureSelectors: FeatureSelector[];

  @Input()
  barChartConfigs: BarChartConfig[];

  @Input()
  loading: boolean;

  @Output()
  private readonly selectFeatures: EventEmitter<FeatureParams[]> =
    new EventEmitter();

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly dialog: MatDialog) {}

  openFeaturesDialog(): void {
    const dialogRef = this.dialog.open(FeaturesDialogComponent, {
      data: this.allFeatureSelectors,
    });

    this.dispatchResultOnClose(dialogRef);
  }

  dispatchResultOnClose(
    dialogRef: MatDialogRef<FeaturesDialogComponent>
  ): void {
    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(filter((result) => result))
        .subscribe((result) => this.onSelectedFeatures(result))
    );
  }

  onSelectedFeatures(featureSelectors: FeatureSelector[]): void {
    const features = featureSelectors.map((selector) => selector.feature);
    this.selectFeatures.emit(features);
  }

  drop(event: CdkDragDrop<string[]>): void {
    const selectedFeatures = this.allFeatureSelectors.filter(
      (feature) => feature.selected
    );

    moveItemInArray(selectedFeatures, event.previousIndex, event.currentIndex);
    this.onSelectedFeatures(selectedFeatures);
  }

  trackByFn(index: number): number {
    return index;
  }
}
