import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { filter, Subscription } from 'rxjs';

import { BarChartConfig } from '../../shared/charts/models';
import { FeaturesDialogComponent } from '../features-dialog/features-dialog.component';
import { FeatureParams, FeatureSelectorConfig } from '../models';
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

  @Input()
  region: string;

  @Input()
  allSelectedFeatureParams: FeatureParams[];

  @Output()
  readonly selectFeatures: EventEmitter<FeatureParams[]> = new EventEmitter();

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly dialog: MatDialog) {}

  openFeaturesDialog(): void {
    const dialogRef = this.dialog.open(FeaturesDialogComponent, {
      data: new FeatureSelectorConfig(this.allFeatureSelectors, this.region),
    });

    this.dispatchResultOnClose(dialogRef);
  }

  dispatchResultOnClose(
    dialogRef: MatDialogRef<FeaturesDialogComponent>
  ): void {
    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(filter((result: any) => result))
        .subscribe((result: FeatureSelector[]) =>
          this.onSelectedFeatures(result)
        )
    );
  }

  onSelectedFeatures(featureSelectors: FeatureSelector[]): void {
    const selectedFeatures = featureSelectors.map(
      (selector) => selector.feature
    );

    const allFeatures = this.replaceRegionSelectedFeatures(
      this.allSelectedFeatureParams,
      selectedFeatures
    );

    this.selectFeatures.emit(allFeatures);
  }

  replaceRegionSelectedFeatures(
    allFeatures: FeatureParams[],
    newFeatures: FeatureParams[]
  ) {
    const otherFeatures = allFeatures.filter(
      (feature) => feature.region !== this.region
    );

    return [...otherFeatures, ...newFeatures];
  }

  drop(event: CdkDragDrop<string[]>): void {
    const selectedFeatures = this.allFeatureSelectors.filter(
      (feature) => feature.selected && feature.feature.region === this.region
    );

    moveItemInArray(selectedFeatures, event.previousIndex, event.currentIndex);
    this.onSelectedFeatures([...selectedFeatures]);
  }

  trackByFn(index: number): number {
    return index;
  }
}
