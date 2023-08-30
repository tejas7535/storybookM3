import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { filter } from 'rxjs';

import { FeaturesDialogComponent } from '../features-dialog/features-dialog.component';
import {
  FeatureParams,
  FeatureSelector,
  FeatureSelectorConfig,
} from '../models';

@Component({
  selector: 'ia-edit-feature-selection',
  templateUrl: './edit-feature-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditFeatureSelectionComponent {
  @Input()
  region: string;

  @Input()
  selectors: FeatureSelector[];

  @Output()
  changeSelectedFeatures = new EventEmitter<FeatureParams[]>();

  constructor(private readonly dialog: MatDialog) {}

  editFeatureSelection(): void {
    if (this.region && this.selectors) {
      const dialogRef = this.dialog.open(FeaturesDialogComponent, {
        data: new FeatureSelectorConfig(this.selectors, this.region),
      });

      this.onDialogClose(dialogRef);
    }
  }

  onDialogClose(dialogRef: MatDialogRef<FeaturesDialogComponent>): void {
    dialogRef
      .afterClosed()
      .pipe(filter((result: any) => result))
      .subscribe((result: FeatureSelector[]) =>
        this.onSelectedFeatures(result)
      );
  }

  onSelectedFeatures(featureSelectors: FeatureSelector[]): void {
    const selectedFeatures = featureSelectors.map(
      (selector) => selector.feature
    );

    this.changeSelectedFeatures.emit(selectedFeatures);
  }
}
