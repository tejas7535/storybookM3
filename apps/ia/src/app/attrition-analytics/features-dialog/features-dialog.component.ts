import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FeatureSelector } from '../models/feature-selector.model';

@Component({
  selector: 'ia-features-dialog',
  templateUrl: './features-dialog.component.html',
  styleUrls: ['./features-dialog.component.scss'],
})
export class FeaturesDialogComponent implements OnInit {
  static SELECTED_FEATURES_MAX = 4;

  selected: any[] = [];
  unselected: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: FeatureSelector[]) {}

  ngOnInit() {
    for (const entry of this.data) {
      if (entry.selected) {
        this.selected.push(entry);
      } else {
        this.unselected.push(entry);
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
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

  maxSelectedFeaturesPredicate(_drag: CdkDrag, drop: CdkDropList) {
    return drop.data.length < FeaturesDialogComponent.SELECTED_FEATURES_MAX;
  }
}
