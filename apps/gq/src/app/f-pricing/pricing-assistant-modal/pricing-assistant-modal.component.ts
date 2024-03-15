/* eslint-disable @typescript-eslint/member-ordering */
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { FPricingFacade } from '@gq/core/store/f-pricing/f-pricing.facade';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { EditingModal } from '@gq/shared/components/modal/editing-modal/models/editing-modal.model';
import { KpiValue } from '@gq/shared/components/modal/editing-modal/models/kpi-value.model';
import { PriceSource, QuotationDetail } from '@gq/shared/models';
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

  priceSourceEnum = PriceSource;
  overlayToShowEnum = OverlayToShow;
  isInitiallyManualPrice =
    this.dialogData.priceSource === PriceSource.MANUAL ||
    this.dialogData.priceSource === PriceSource.TARGET_PRICE;

  visibleOverlay: OverlayToShow = this.isInitiallyManualPrice
    ? OverlayToShow.manualPricing
    : OverlayToShow.gqPricing;

  showAddManualPriceButton = !this.isInitiallyManualPrice;

  manualPriceData: EditingModal = {
    field: ColumnFields.PRICE,
    // When the priceSource is targetPrice, we use this value to initialize the price (ManualPrice)
    // the targetPrice itself will not be touched
    quotationDetail: {
      ...this.dialogData,
      price: this.getInitialPriceValue(),
    },
  };

  comment: string;

  formGroup: FormGroup = new FormGroup({
    comment: new FormControl(undefined, Validators.maxLength(200)),
  });

  mvdTabActivated = false;

  ngOnInit(): void {
    this.fPricingFacade.loadDataForPricingAssistant(
      this.dialogData.gqPositionId
    );
    // only show addManualPriceButton if the price is not already set
    this.getInitialPriceValue();
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
      panelClass: 'show-more',
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
    // first time the 'Add Manual Price' button is clicked, the button should be hidden
    this.showAddManualPriceButton = false;
    this.visibleOverlay = OverlayToShow.manualPricing;
    this.fPricingFacade.changePrice(this.manualPriceData.quotationDetail.price);
  }

  manualPriceChanged(kpis: KpiValue[]): void {
    // change the modalData so that the new Price will be displayed in the PriceButton
    this.manualPriceData = {
      ...this.manualPriceData,
      quotationDetail: {
        ...this.manualPriceData.quotationDetail,
        price: kpis.find((kpi) => kpi.key === 'price').value,
        gpm: kpis.find((kpi) => kpi.key === 'gpm').value,
      },
    };

    this.fPricingFacade.changePrice(this.manualPriceData.quotationDetail.price);
  }

  gqPriceClicked(): void {
    this.visibleOverlay = OverlayToShow.gqPricing;
    // TODO: replace with the reference Price Value
    this.fPricingFacade.changePrice(null);
    // check if manualPriceData has been net, if not display button 'Add Manual Price'
    if (!this.manualPriceData.quotationDetail.price) {
      this.showAddManualPriceButton = true;
    }
  }

  onComparedMaterialClicked(material: string): void {
    this.materialToCompare = material;
    this.visibleOverlay = OverlayToShow.comparisonScreen;
  }

  closeOverlay(): void {
    this.visibleOverlay = OverlayToShow.gqPricing;
  }

  mvdTabClicked(): void {
    this.mvdTabActivated = true;
  }

  private getInitialPriceValue(): number {
    return this.dialogData.priceSource === PriceSource.TARGET_PRICE
      ? this.dialogData.targetPrice
      : this.dialogData.price;
  }
}
