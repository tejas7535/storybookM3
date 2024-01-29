import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { QuotationDetail } from '@gq/shared/models';

// gq-pa in the selector is for gq-pricingAssistant
@Component({
  selector: 'gq-pa-material-details',
  templateUrl: './material-details.component.html',
})
export class MaterialDetailsComponent {
  readonly quotationDetail: QuotationDetail = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<MaterialDetailsComponent>);

  closeDialog(): void {
    this.dialogRef.close();
  }
}
