import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FPricingFacade } from '@gq/core/store/f-pricing/f-pricing.facade';
import { QuotationDetail } from '@gq/shared/models';

// gq-pa in the selector is for gq-pricingAssistant
@Component({
  selector: 'gq-pa-material-details',
  templateUrl: './material-details.component.html',
  standalone: false,
})
export class MaterialDetailsComponent {
  private readonly dialogRef = inject(MatDialogRef<MaterialDetailsComponent>);
  private readonly fPricingFacade = inject(FPricingFacade);
  readonly quotationDetail: QuotationDetail = inject(MAT_DIALOG_DATA);

  readonly materialSalesOrg$ = this.fPricingFacade.materialSalesOrg$;
  readonly materialSalesOrgDataAvailable$ =
    this.fPricingFacade.materialSalesOrgDataAvailable$;

  closeDialog(): void {
    this.dialogRef.close();
  }
}
