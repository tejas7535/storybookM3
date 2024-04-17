import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
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
export class PricingAssistantModalComponent implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(
    MatDialogRef<PricingAssistantModalComponent>
  );

  dialogData: QuotationDetail = inject(MAT_DIALOG_DATA);
  fPricingFacade = inject(FPricingFacade);
  fPricingData$ = this.fPricingFacade.fPricingDataComplete$;
  comparableTransactionsLoading$ =
    this.fPricingFacade.comparableTransactionsLoading$;
  fPricingDataLoading$ = this.fPricingFacade.fPricingDataLoading$;

  material: MaterialDetails = this.dialogData.material;
  materialToCompare: string;

  priceSourceEnum = PriceSource;
  overlayToShowEnum = OverlayToShow;

  gqPricingConfirmButtonDisabled = true;

  isInitiallyManualPrice =
    this.dialogData.priceSource === PriceSource.MANUAL ||
    this.dialogData.priceSource === PriceSource.TARGET_PRICE;

  visibleOverlay: OverlayToShow = this.isInitiallyManualPrice
    ? OverlayToShow.manualPricing
    : OverlayToShow.gqPricing;

  showAddManualPriceButton = !this.isInitiallyManualPrice;

  // that's the data the editingModal is initialized with
  manualPriceData: EditingModal = {
    field: ColumnFields.PRICE,
    // When the priceSource is targetPrice, we use this value to initialize the price (ManualPrice)
    // the targetPrice itself will not be touched
    quotationDetail: {
      ...this.dialogData,
      // when rfqData is present use these values, otherwise use the values from the dialogData
      sqv: this.dialogData.rfqData?.sqv ?? this.dialogData.sqv,
      gpm: this.dialogData.gpmRfq ?? this.dialogData.gpm,
      price: this.getInitialPriceValue(),
    },
  };

  manualPriceInputInvalidOrUnchanged = true;
  manualPriceToDisplay: number;
  manualPriceGPMToDisplay: number;

  commentValidAndChanged = false;
  comment: FormControl = new FormControl(
    this.dialogData?.priceComment || undefined,
    Validators.maxLength(200)
  );

  ngOnInit(): void {
    this.fPricingFacade.loadDataForPricingAssistant(
      this.dialogData.gqPositionId
    );
  }

  ngAfterViewInit(): void {
    this.comment.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (value: string) =>
          (this.commentValidAndChanged =
            !!value &&
            this.comment.valid &&
            value !== this.dialogData.priceComment)
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
      panelClass: 'show-more',
    });
  }

  backToGqPricingPage(): void {
    this.visibleOverlay = OverlayToShow.gqPricing;
  }

  confirmGqPrice(): void {
    this.fPricingFacade.updateFPricingData(this.dialogData.gqPositionId);
    this.fPricingFacade.updatePriceSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeDialog());
  }

  confirmManualPrice(): void {
    this.fPricingFacade.updateManualPrice(
      this.dialogData.gqPositionId,
      this.comment.value
    );
    this.fPricingFacade.updatePriceSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeDialog());
  }

  manualPriceClicked(): void {
    // first time the 'Add Manual Price' button is clicked, the button should be hidden afterwards
    // when a netPrice is available, it will be set as manualPrice and then the confirm Button shall be enabled directly
    if (this.showAddManualPriceButton && this.manualPriceGPMToDisplay) {
      this.manualPriceInputInvalidOrUnchanged = false;
    }
    this.showAddManualPriceButton = false;
    this.visibleOverlay = OverlayToShow.manualPricing;
    this.fPricingFacade.changePrice(this.manualPriceToDisplay);
  }

  // fired when user input has changed in the editingComponent
  manualPriceChanged(kpis: KpiValue[]): void {
    this.manualPriceToDisplay = kpis.find((kpi) => kpi.key === 'price').value;
    this.manualPriceGPMToDisplay = kpis.find((kpi) => kpi.key === 'gpm').value;

    this.fPricingFacade.changePrice(this.manualPriceToDisplay);
  }

  // the editingComponent includes logic for enabling and disabling the button
  manualPriceInvalidOrUnchangedHandled(invalidOrUnchanged: boolean): void {
    this.manualPriceInputInvalidOrUnchanged = invalidOrUnchanged;
  }

  gqPriceClicked(): void {
    this.visibleOverlay = OverlayToShow.gqPricing;
    // TODO: replace with the reference Price Value
    this.fPricingFacade.changePrice(null);
    // check if manualPriceData has been net, if not display button 'Add Manual Price'
    if (
      !this.manualPriceData.quotationDetail.price &&
      this.manualPriceInputInvalidOrUnchanged &&
      !this.commentValidAndChanged
    ) {
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
    this.gqPricingConfirmButtonDisabled = false;
  }

  private getInitialPriceValue(): number {
    return this.dialogData.priceSource === PriceSource.TARGET_PRICE
      ? this.dialogData.targetPrice
      : this.dialogData.price;
  }
}
