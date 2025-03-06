import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

export interface CustomerPlanningLevelConfirmationModalProps {
  customerName: string;
  customerNumber: string;
}

@Component({
  selector: 'd360-customer-planning-level-confirmation-modal',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './customer-planning-level-confirmation-modal.component.html',
})
export class CustomerPlanningLevelConfirmationModalComponent {
  protected readonly dialogRef: MatDialogRef<CustomerPlanningLevelConfirmationModalComponent> =
    inject(MatDialogRef<CustomerPlanningLevelConfirmationModalComponent>);

  protected readonly data: CustomerPlanningLevelConfirmationModalProps =
    inject(MAT_DIALOG_DATA);

  public onConfirm() {
    this.dialogRef.close(true);
  }

  public onCancel() {
    this.dialogRef.close(false);
  }
}
