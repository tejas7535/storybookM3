import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { translate } from '@ngneat/transloco';

import { FeatureSelector } from '../models/feature-selector.model';

@Component({
  selector: 'ia-features-dialog',
  templateUrl: './features-dialog.component.html',
  styleUrls: ['./features-dialog.component.scss'],
})
export class FeaturesDialogComponent implements OnInit {
  readonly SELECTED_FEATURES_MAX = 4;

  selected: FeatureSelector[] = [];
  unselected: FeatureSelector[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FeatureSelector[],
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    for (const entry of this.data) {
      if (entry.selected) {
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
