import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { combineLatest, map, Observable, pairwise, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getQuotationErrorMessage,
  getUpdateLoading,
  updateQuotationDetails,
} from '../../../core/store';
import { UpdateQuotationDetail } from '../../../core/store/reducers/process-case/models';
import {
  PriceSource,
  QuotationDetail,
} from '../../../shared/models/quotation-detail';
import { ColumnFields } from '../../../shared/services/column-utility-service/column-fields.enum';
import { HelperService } from '../../../shared/services/helper-service/helper-service.service';
import { PriceService } from '../../../shared/services/price-service/price.service';

@Component({
  selector: 'gq-editing-modal',
  templateUrl: './editing-modal.component.html',
})
export class EditingModalComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  confirmDisabled = true;
  editFormControl: FormControl;
  updateLoading$: Observable<boolean>;
  value: string;
  quotationDetail: QuotationDetail;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      quotationDetail: QuotationDetail;
      field: keyof QuotationDetail;
    },
    private readonly dialogRef: MatDialogRef<EditingModalComponent>,
    private readonly store: Store
  ) {
    this.value =
      this.modalData.quotationDetail[this.modalData.field]?.toString() || '0';
    this.quotationDetail = this.modalData.quotationDetail;
  }

  ngOnInit(): void {
    this.editFormControl = new FormControl(this.value);
    this.updateLoading$ = this.store.select(getUpdateLoading);

    this.addSubscriptions();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  addSubscriptions(): void {
    const loadingStopped$ = this.store.select(getUpdateLoading).pipe(
      pairwise(),
      // eslint-disable-next-line ngrx/avoid-mapping-selectors
      map(([preVal, curVal]) => preVal && !curVal)
    );
    const isErrorMessage$ = this.store.select(getQuotationErrorMessage);

    this.subscription.add(
      combineLatest([isErrorMessage$, loadingStopped$]).subscribe(
        ([isErrorMessage, loadingStopped]) => {
          if (!isErrorMessage && loadingStopped) {
            this.closeDialog();
          }
        }
      )
    );

    this.subscription.add(
      this.editFormControl.valueChanges.subscribe((val: string) => {
        this.confirmDisabled =
          val === null ||
          // dynamic to value
          val === this.value ||
          // dynamic to value
          (val !== null && val.length === 0) ||
          (val !== null && val.trim() === this.value) ||
          (![ColumnFields.PRICE, ColumnFields.ORDER_QUANTITY].includes(
            this.modalData.field as ColumnFields
          ) &&
            Number.parseFloat(val) >= 100);
      })
    );
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  confirmEditing(): void {
    const value = Number.parseFloat(this.editFormControl.value);

    if (this.modalData.field === ColumnFields.ORDER_QUANTITY) {
      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          orderQuantity: value,
          gqPositionId: this.modalData.quotationDetail.gqPositionId,
        },
      ];
      this.store.dispatch(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    } else {
      let newPrice: number;

      if (
        [ColumnFields.GPM, ColumnFields.GPI].includes(
          this.modalData.field as ColumnFields
        )
      ) {
        newPrice = PriceService.getManualPriceByMarginAndCost(
          this.modalData.field === ColumnFields.GPM
            ? this.quotationDetail.sqv
            : this.quotationDetail.gpc,
          value
        );
      } else if (this.modalData.field === ColumnFields.DISCOUNT) {
        newPrice = PriceService.getManualPriceByDiscount(
          this.quotationDetail.sapGrossPrice,
          value
        );
      } else {
        newPrice = value;
      }
      const price = newPrice / this.quotationDetail.material.priceUnit;

      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          price,
          gqPositionId: this.quotationDetail.gqPositionId,
          priceSource: PriceSource.MANUAL,
        },
      ];
      this.store.dispatch(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    }
    // eslint-disable-next-line unicorn/prefer-ternary
  }
  onKeyPress(event: KeyboardEvent, value: HTMLInputElement): void {
    if (this.modalData.field === ColumnFields.ORDER_QUANTITY) {
      HelperService.validateQuantityInputKeyPress(event);
    } else {
      HelperService.validateNumberInputKeyPress(event, value);
    }
  }

  onPaste(event: ClipboardEvent): void {
    if (this.modalData.field === ColumnFields.ORDER_QUANTITY) {
      HelperService.validateQuantityInputPaste(event);
    } else {
      HelperService.validateNumberInputPaste(event, this.editFormControl);
    }
  }
}
