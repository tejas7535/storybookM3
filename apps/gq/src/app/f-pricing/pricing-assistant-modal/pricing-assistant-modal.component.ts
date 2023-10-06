import { Component, Inject } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { MaterialDetails } from '@gq/shared/models/quotation-detail/material-details.model';

import { MATERIAL_DETAILS_MOCK } from '../../../testing/mocks/models/material-details.mock';

@Component({
  selector: 'gq-pricing-assistant-modal',
  templateUrl: './pricing-assistant-modal.component.html',
})
export class PricingAssistantModalComponent {
  material: MaterialDetails = MATERIAL_DETAILS_MOCK;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: any, // tbd
    private readonly dialogRef: MatDialogRef<PricingAssistantModalComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    console.log('confirm');
  }

  manualPriceClicked(): void {
    console.log('manualPriceClicked');
  }
}
