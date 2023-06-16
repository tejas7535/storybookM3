import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

import { translate } from '@ngneat/transloco';

import { FeatureSelectorConfig } from '../models';
import { FeatureSelector } from '../models/feature-selector.model';

@Component({
  selector: 'ia-features-dialog',
  templateUrl: './features-dialog.component.html',
  styleUrls: ['../attrition-analytics.scss'],
})
export class FeaturesDialogComponent implements OnInit {
  readonly SELECTED_FEATURES_MAX = 4;

  selected: FeatureSelector[] = [];
  unselected: FeatureSelector[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: FeatureSelectorConfig,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    for (const entry of this.config.data) {
      if (entry.feature.region === this.config.region && entry.selected) {
        this.selected.push(entry);
      } else {
        this.unselected.push(entry);
      }
    }
  }

  drop(event: CdkDragDrop<FeatureSelector[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  maxSelectedFeaturesPredicate = (_drag: CdkDrag, drop: CdkDropList) =>
    drop.data.length < this.SELECTED_FEATURES_MAX;

  itemReleased() {
    if (this.selected.length >= this.SELECTED_FEATURES_MAX) {
      this.snackBar.open(
        translate(
          'attritionAnalytics.addAnalysis.featuresDialog.selectedFeaturesMaxInfo',
          { selectedFeaturesMax: this.SELECTED_FEATURES_MAX }
        )
      );
    }
  }
}
