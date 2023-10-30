import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ComparableMaterialsRowData } from '@gq/core/store/reducers/transactions/models/f-pricing-comparable-materials.interface';
import { MaterialDetails } from '@gq/shared/models/quotation-detail/material-details.model';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';

import { COMPARABLE_MATERIALS_ROW_DATA_MOCK } from '../../../testing/mocks/models/f-pricing-comparable-materials.mock';
import { MATERIAL_DETAILS_MOCK } from '../../../testing/mocks/models/material-details.mock';
import { OverlayToShow } from './models/overlay-to-show.enum';
@Component({
  selector: 'gq-pricing-assistant-modal',
  templateUrl: './pricing-assistant-modal.component.html',
  // to have it as non-singleton in this class
  // otherwise it will override the columnState on in backgrounds quotationSDetailsTable
  providers: [AgGridStateService],
})
export class PricingAssistantModalComponent {
  material: MaterialDetails = MATERIAL_DETAILS_MOCK;
  referencePriceRowData: ComparableMaterialsRowData[] =
    COMPARABLE_MATERIALS_ROW_DATA_MOCK;

  overlayToShowEnum = OverlayToShow;
  visibleOverlay: OverlayToShow = OverlayToShow.gqPricing;

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
    this.visibleOverlay = OverlayToShow.manualPricing;
  }

  onComparedMaterialClicked(material: string): void {
    console.log(`comparismScreen for ${material}`);
    this.visibleOverlay = OverlayToShow.comparismScreen;
  }

  closeOverlay(): void {
    this.visibleOverlay = OverlayToShow.gqPricing;
  }
}
