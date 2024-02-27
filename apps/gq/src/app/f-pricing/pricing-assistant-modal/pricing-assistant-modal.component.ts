/* eslint-disable @typescript-eslint/member-ordering */
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { FPricingFacade } from '@gq/core/store/f-pricing/f-pricing.facade';
import { QuotationDetail } from '@gq/shared/models';
import { MaterialDetails } from '@gq/shared/models/quotation-detail/material-details.model';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';

import { MaterialDetailsComponent } from './material-details/material-details.component';
import { OverlayToShow } from './models/overlay-to-show.enum';

@Component({
  selector: 'gq-pricing-assistant-modal',
  templateUrl: './pricing-assistant-modal.component.html',
  // to have it as non-singleton in this class
  // otherwise it will override the columnState on in backgrounds quotationSDetailsTable
  providers: [AgGridStateService],
})
export class PricingAssistantModalComponent implements OnInit {
  dialogData: QuotationDetail = inject(MAT_DIALOG_DATA);
  fPricingFacade = inject(FPricingFacade);
  fPricingData$ = this.fPricingFacade.fPricingDataComplete$;
  comparableTransactionsLoading$ =
    this.fPricingFacade.comparableTransactionsLoading$;
  fPricingDataLoading$ = this.fPricingFacade.fPricingDataLoading$;

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(
    MatDialogRef<PricingAssistantModalComponent>
  );

  material: MaterialDetails = this.dialogData.material;

  materialToCompare: string;

  overlayToShowEnum = OverlayToShow;
  visibleOverlay: OverlayToShow = OverlayToShow.gqPricing;

  ngOnInit(): void {
    this.fPricingFacade.loadDataForPricingAssistant(
      this.dialogData.gqPositionId
    );
  }

  closeDialog(): void {
    this.fPricingFacade.resetDataForPricingAssistant();
    this.dialogRef.close();
  }

  showMore(): void {
    this.dialog.open(MaterialDetailsComponent, {
      width: '792px',
      data: this.dialogData,
      autoFocus: false,
    });
  }

  backToGqPricingPage(): void {
    this.visibleOverlay = OverlayToShow.gqPricing;
  }

  confirm(): void {
    this.fPricingFacade.updateFPricingData(this.dialogData.gqPositionId);
    this.fPricingFacade.updateFPricingDataSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeDialog());
  }

  manualPriceClicked(): void {
    console.log('manualPriceClicked');
    this.visibleOverlay = OverlayToShow.manualPricing;
  }

  onComparedMaterialClicked(material: string): void {
    this.materialToCompare = material;
    this.visibleOverlay = OverlayToShow.comparisonScreen;
  }

  closeOverlay(): void {
    this.visibleOverlay = OverlayToShow.gqPricing;
  }
}
