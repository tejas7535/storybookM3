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

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  getCustomerCurrency,
  getQuotationErrorMessage,
  getUpdateLoading,
  updateQuotationDetails,
} from '../../../../core/store';
import { UpdateQuotationDetail } from '../../../../core/store/reducers/process-case/models';
import { ColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { PriceSource, QuotationDetail } from '../../../models/quotation-detail';
import { HelperService } from '../../../services/helper-service/helper-service.service';
import { PriceService } from '../../../services/price-service/price.service';
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
  customerCurrency$: Observable<string>;
  value: number;
  affectedKpis: KpiValue[];
  fields = ColumnFields;

  isRelativePriceChange = true;
  isRelativePriceChangeDisabled = false;
  showRadioGroup = this.modalData.field === ColumnFields.PRICE;

  // variables needed for warning indication
  mspWarningEnabled = false;
  marginWarningTooltip = translate(
    'shared.quotationDetailsTable.toolTip.gpmOrGpiTooLow'
  );
  mspWarningTooltip = translate(
    'shared.quotationDetailsTable.toolTip.priceLowerThanMsp'
  );

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
    this.customerCurrency$ = this.store.select(getCustomerCurrency);

    if (
      this.modalData.field === ColumnFields.PRICE &&
      !this.modalData.quotationDetail.price
    ) {
      this.isRelativePriceChangeDisabled = true;
      this.isRelativePriceChange = false;
    }

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
            this.isRelativePriceChange &&
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
      this.modalData.quotationDetail,
      this.modalData.field !== ColumnFields.PRICE ||
        (this.modalData.field === ColumnFields.PRICE &&
          this.isRelativePriceChange)
    );
    this.mspWarningEnabled =
      this.modalData.quotationDetail.msp &&
      this.affectedKpis.find((e) => e.key === ColumnFields.PRICE)?.value <
        this.modalData.quotationDetail.msp;
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
      } else if (this.modalData.field === ColumnFields.PRICE) {
        newPrice = this.isRelativePriceChange
          ? PriceService.multiplyAndRoundValues(
              this.modalData.quotationDetail.price,
              1 + value / 100
            )
          : value;
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
    } else if (
      this.modalData.field === ColumnFields.PRICE &&
      !this.isRelativePriceChange
    ) {
      HelperService.validateAbsolutePriceInputKeyPress(event, value);
    } else {
      HelperService.validateNumberInputKeyPress(event, value);
    }
  }

  onPaste(event: ClipboardEvent): void {
    if (this.modalData.field === ColumnFields.ORDER_QUANTITY) {
      HelperService.validateQuantityInputPaste(event);
    } else {
      HelperService.validateNumberInputPaste(
        event,
        this.editFormControl,
        this.isRelativePriceChange
      );
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
          (Number.parseInt(this.editFormControl.value ?? this.value, 10) || 0) +
            1
        )
      );
      this.editInputField?.nativeElement.focus();
    }
  }

  decrement(): void {
    if (
      // should not decrement to less than -99 % for percentage changes
      (this.modalData.field !== ColumnFields.ORDER_QUANTITY &&
        this.isRelativePriceChange &&
        (this.editFormControl.value ?? this.value) > -99) ||
      // absolute price can not be lower than 1
      (!this.isRelativePriceChange &&
        (this.editFormControl.value ?? this.value) > 1) ||
      // quantity should not be lower than 1
      (this.modalData.field === ColumnFields.ORDER_QUANTITY &&
        (this.editFormControl.value ?? this.value) > 1)
    ) {
      this.editFormControl.setValue(
        PriceService.roundToTwoDecimals(
          (Number.parseInt(this.editFormControl.value ?? this.value, 10) || 0) -
            1
        )
      );
      this.editInputField?.nativeElement.focus();
    }
  }

  onRadioButtonChange(isRelative: boolean): void {
    this.editFormControl.setValue('');
    this.setAffectedKpis(isRelative ? this.modalData.quotationDetail.price : 0);
  }
}
