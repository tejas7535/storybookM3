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

import { tap } from 'rxjs';

import { FPricingFacade } from '@gq/core/store/f-pricing/f-pricing.facade';
import { MarketValueDriverWarningLevel } from '@gq/core/store/f-pricing/models/market-value-driver-warning-level.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { EditingModal } from '@gq/shared/components/modal/editing-modal/models/editing-modal.model';
import { KpiValue } from '@gq/shared/components/modal/editing-modal/models/kpi-value.model';
import { PriceSource, QuotationDetail } from '@gq/shared/models';
import { MaterialToCompare } from '@gq/shared/models/f-pricing/material-to-compare.interface';
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

  readonly marketValueDriverWarningLevel = MarketValueDriverWarningLevel;

  dialogData: QuotationDetail = inject(MAT_DIALOG_DATA);
  fPricingFacade = inject(FPricingFacade);
  fPricingData$ = this.fPricingFacade.fPricingDataComplete$.pipe(
    tap((f) =>
      f.quotationIsActive ? this.comment.enable() : this.comment.disable()
    )
  );
  comparableTransactionsLoading$ =
    this.fPricingFacade.comparableTransactionsLoading$;
  fPricingDataLoading$ = this.fPricingFacade.fPricingDataLoading$;
  fPricingCalculationsLoading$ =
    this.fPricingFacade.fPricingCalculationsLoading$;
  materialComparisonLoading$ = this.fPricingFacade.materialComparisonLoading$;

  material: MaterialDetails = this.dialogData.material;
  materialToCompare: MaterialToCompare;

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
    quotationDetail: {
      ...this.dialogData,
      // when rfqData is present use these values, otherwise use the values from the dialogData
      sqv: this.dialogData.rfqData?.sqv ?? this.dialogData.sqv,
      gpm: this.dialogData.rfqData?.gpm ?? this.dialogData.gpm,
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
    this.comment.patchValue(this.dialogData?.priceComment || undefined);

    this.comment.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => {
        this.commentValidAndChanged =
          this.comment.valid &&
          (!!value || !!this.dialogData.priceComment) &&
          value !== this.dialogData.priceComment;
      });
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
    this.showAddManualPriceButton = false;
    this.visibleOverlay = OverlayToShow.manualPricing;
    this.fPricingFacade.changePrice(this.manualPriceToDisplay);
  }

  // fired when user input has changed in the editingComponent
  manualPriceChanged(kpis: KpiValue[]): void {
    this.manualPriceToDisplay = kpis.find((kpi) => kpi.key === 'price').value;
    this.manualPriceGPMToDisplay = kpis.find((kpi) => kpi.key === 'gpm').value;

    // If kpi price is falsy (0, null, undefined etc.) set initial values from quotation detail.
    // This is needed for example when we open Pricing Assistant with Manual price currently selected
    // or click Add Manual Price option for the first time. (See GQUOTE-4884)
    if (!this.manualPriceToDisplay) {
      this.manualPriceToDisplay = this.manualPriceData.quotationDetail.price;
      this.manualPriceGPMToDisplay = this.manualPriceData.quotationDetail.gpm;
    }

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
    // check if manualPriceData has been set and changed, if not display button 'Add Manual Price'
    if (
      !this.isInitiallyManualPrice &&
      this.manualPriceInputInvalidOrUnchanged &&
      !this.commentValidAndChanged
    ) {
      this.showAddManualPriceButton = true;
    }
  }

  onComparedMaterialClicked(matToCompare: MaterialToCompare): void {
    this.materialToCompare = matToCompare;
    this.visibleOverlay = OverlayToShow.comparisonScreen;
    this.fPricingFacade.loadDataForComparisonScreen(
      this.material.productType,
      this.material.materialNumber13,
      matToCompare
    );
  }

  closeOverlay(): void {
    this.visibleOverlay = OverlayToShow.gqPricing;
  }

  mvdTabClicked(): void {
    this.gqPricingConfirmButtonDisabled = false;
  }
}
