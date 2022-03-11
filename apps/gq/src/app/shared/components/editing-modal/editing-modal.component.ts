import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { ColumnFields } from '../../../shared/ag-grid/constants/column-fields.enum';
import {
  PriceSource,
  QuotationDetail,
} from '../../../shared/models/quotation-detail';
import { HelperService } from '../../../shared/services/helper-service/helper-service.service';
import { PriceService } from '../../../shared/services/price-service/price.service';
import { KpiValue } from './kpi-value.model';
@Component({
  selector: 'gq-editing-modal',
  templateUrl: './editing-modal.component.html',
})
export class EditingModalComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly subscription: Subscription = new Subscription();
  confirmDisabled = true;
  editFormControl: FormControl;
  updateLoading$: Observable<boolean>;
  value: number;
  affectedKpis: KpiValue[];

  @ViewChild('edit') editInputField: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      quotationDetail: QuotationDetail;
      field: ColumnFields;
    },
    private readonly dialogRef: MatDialogRef<EditingModalComponent>,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.editFormControl = new FormControl();
    this.updateLoading$ = this.store.select(getUpdateLoading);

    this.addSubscriptions();
  }

  ngAfterViewInit(): void {
    this.value =
      this.modalData.field === ColumnFields.PRICE
        ? 0
        : (this.modalData.quotationDetail[
            this.modalData.field as keyof QuotationDetail
          ] as number);

    this.setAffectedKpis(this.value);

    this.editInputField?.nativeElement.focus();
    this.cdr.detectChanges();
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
        const parsedValue = Number.parseFloat(val);

        this.confirmDisabled =
          !val ||
          Number.isNaN(parsedValue) ||
          // dynamic to value
          val === this.value?.toString() ||
          // dynamic to value
          (![ColumnFields.ORDER_QUANTITY].includes(
            this.modalData.field as ColumnFields
          ) &&
            parsedValue >= 100);

        // trigger dynamic kpi simulation
        this.setAffectedKpis(parsedValue);
      })
    );
  }

  setAffectedKpis(val: number): void {
    this.affectedKpis = PriceService.calculateAffectedKPIs(
      val,
      this.modalData.field,
      this.modalData.quotationDetail
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
            ? this.modalData.quotationDetail.sqv
            : this.modalData.quotationDetail.gpc,
          value
        );
      } else if (this.modalData.field === ColumnFields.DISCOUNT) {
        newPrice = PriceService.getManualPriceByDiscount(
          this.modalData.quotationDetail.sapGrossPrice,
          value
        );
      } else {
        newPrice = value;
      }
      const price =
        newPrice / this.modalData.quotationDetail.material.priceUnit;

      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          price,
          gqPositionId: this.modalData.quotationDetail.gqPositionId,
          priceSource: PriceSource.MANUAL,
        },
      ];
      this.store.dispatch(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    }
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

  increment(): void {
    // margins and discounts should not be higher than 99 %
    if (
      [ColumnFields.ORDER_QUANTITY, ColumnFields.PRICE].includes(
        this.modalData.field
      ) ||
      this.editFormControl.value < 99
    ) {
      this.editFormControl.setValue(
        PriceService.roundToTwoDecimals(
          (this.editFormControl.value ?? this.value) + 1
        )
      );
    }
  }

  decrement(): void {
    if (
      (this.modalData.field !== ColumnFields.ORDER_QUANTITY &&
        (this.editFormControl.value ?? this.value) > -99) ||
      (this.modalData.field === ColumnFields.ORDER_QUANTITY &&
        (this.editFormControl.value ?? this.value) > 1)
    ) {
      this.editFormControl.setValue(
        PriceService.roundToTwoDecimals(
          (this.editFormControl.value ?? this.value) - 1
        )
      );
    }
  }
}
