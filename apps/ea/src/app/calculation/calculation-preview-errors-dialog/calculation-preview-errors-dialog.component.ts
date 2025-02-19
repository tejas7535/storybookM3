/* eslint-disable @typescript-eslint/member-ordering */
import { Component, computed, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { CalculationPreviewErrorsItemComponent } from '../calculation-preview-errors-item/calculation-preview-errors-item.component';
import { CalculationPreviewErrorsDialogData } from './calculation-preview-errors-dialog-data.interface';

@Component({
  templateUrl: './calculation-preview-errors-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    CalculationPreviewErrorsItemComponent,
  ],
})
export class CalculationPreviewErrorsDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<CalculationPreviewErrorsDialogComponent>
  );
  dataSignal = inject<CalculationPreviewErrorsDialogData>(MAT_DIALOG_DATA);

  title = computed(() => this.dataSignal.title);
  downstreamPreviewItems = () => this.dataSignal.downstreamPreviewItems;
  downstreamErrors = computed(() => this.dataSignal.downstreamErrors);

  catalogPreviewItems = computed(() => this.dataSignal.catalogPreviewItems);
  catalogErrors = computed(() => this.dataSignal.catalogErrors);

  closeDialog() {
    this.dialogRef.close();
  }
}
