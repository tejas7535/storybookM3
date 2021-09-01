import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { FeatureSelector } from '../models/feature-selector.model';
import { FeaturesDialogComponent } from './features-dialog/features-dialog.component';

@Component({
  selector: 'ia-add-analysis',
  templateUrl: './add-analysis.component.html',
})
export class AddAnalysisComponent implements OnDestroy {
  @Input() data: FeatureSelector[];
  @Output() selectedFeatures: EventEmitter<FeatureSelector[]> =
    new EventEmitter();
  dialogCloseSubscription: Subscription;

  constructor(private readonly dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(FeaturesDialogComponent, {
      data: this.data,
    });

    this.emitResultOnClose(dialogRef);
  }

  emitResultOnClose(dialogRef: MatDialogRef<FeaturesDialogComponent>) {
    this.dialogCloseSubscription = dialogRef
      .afterClosed()
      .subscribe((result) => this.selectedFeatures.emit(result));
  }

  ngOnDestroy(): void {
    this.dialogCloseSubscription?.unsubscribe();
  }
}
