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
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { combineLatest, map, Observable, pairwise, Subscription } from 'rxjs';

import { updateQuotationDetails } from '@gq/core/store/actions';
import { UpdateQuotationDetail } from '@gq/core/store/reducers/models';
import {
  getQuotationCurrency,
  getQuotationErrorMessage,
  getUpdateLoading,
} from '@gq/core/store/selectors/process-case/process-case.selectors';
import { QuotationDetailsTableValidationService } from '@gq/process-case-view/quotation-details-table/services/quotation-details-table-validation.service';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { Store } from '@ngrx/store';

import { ColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import * as constants from '../../../constants';
import { PriceSource, QuotationDetail } from '../../../models/quotation-detail';
import { HelperService } from '../../../services/helper/helper.service';
import { PriceService } from '../../../services/price/price.service';
import { KpiValue } from './kpi-value.model';

@Component({
  selector: 'gq-editing-modal',
  templateUrl: './editing-modal.component.html',
})
export class EditingModalComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly subscription: Subscription = new Subscription();

  updateLoading$: Observable<boolean>;
  quotationCurrency$: Observable<string>;
  value: number;
  localeValue: string;
  affectedKpis: KpiValue[];
  fields = ColumnFields;

  isRelativePriceChangeDisabled: boolean;
  showRadioGroup = this.modalData.field === ColumnFields.PRICE;

  priceThreshold = constants.PRICE_VALIDITY_MARGIN_THRESHOLD;

  // variables needed for warning indication
  mspWarningEnabled: boolean;
  orderQuantityWarning: boolean;

  editingFormGroup: FormGroup = new FormGroup({
    isRelativePriceChangeRadioGroup: new FormControl(true, Validators.required),
    valueInput: new FormControl(undefined),
  });

  @ViewChild('edit') editInputField: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      quotationDetail: QuotationDetail;
      field: ColumnFields;
    },
    private readonly dialogRef: MatDialogRef<EditingModalComponent>,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly translocoLocaleService: TranslocoLocaleService,
    private readonly helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.editingFormGroup
      .get('valueInput')
      .setValidators([this.isInputValid.bind(this)]);
    this.editingFormGroup.get('valueInput').markAllAsTouched();

    this.updateLoading$ = this.store.select(getUpdateLoading);
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);

    if (
      this.modalData.field === ColumnFields.PRICE &&
      !this.modalData.quotationDetail.price
    ) {
      this.isRelativePriceChangeDisabled = true;
      this.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(false);
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
    this.localeValue = this.helperService.transformNumber(this.value, true);

    this.setAffectedKpis(this.value);

    this.editInputField?.nativeElement.focus();
    this.cdr.detectChanges();

    // validate input initially
    this.validateInput(`${this.value}`);
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
      this.editingFormGroup
        .get('valueInput')
        .valueChanges.subscribe((val: string) => {
          let parsedValue = HelperService.parseLocalizedInputValue(
            val,
            this.translocoLocaleService.getLocale()
          );

          if (this.editingFormGroup.get('valueInput').invalid) {
            parsedValue = Number.NaN;
          }
          // trigger dynamic kpi simulation
          this.setAffectedKpis(parsedValue);
        })
    );
  }

  validateInput(value: string): boolean {
    const locale = this.translocoLocaleService.getLocale();

    if (this.modalData.field === ColumnFields.ORDER_QUANTITY) {
      // order quantity needs to be a multiple of delivery unit, else warn
      const deliveryUnit = this.modalData.quotationDetail.deliveryUnit;
      this.orderQuantityWarning =
        QuotationDetailsTableValidationService.isOrderQuantityInvalid(
          +value,
          deliveryUnit
        );

      return constants.getQuantityRegex(locale).test(value);
    }

    return !this.editingFormGroup.get('isRelativePriceChangeRadioGroup')
      .value && this.modalData.field === ColumnFields.PRICE
      ? constants.getCurrencyRegex(locale).test(value)
      : constants.getPercentageRegex(locale).test(value);
  }

  isInputValid(control: AbstractControl): ValidationErrors {
    if (this.validateInput(control.value) || !control.value) {
      return undefined;
    }

    return { invalidInput: true };
  }

  setAffectedKpis(val: number): void {
    this.affectedKpis = PriceService.calculateAffectedKPIs(
      val,
      this.modalData.field,
      this.modalData.quotationDetail,
      this.modalData.field !== ColumnFields.PRICE ||
        (this.modalData.field === ColumnFields.PRICE &&
          this.editingFormGroup.get('isRelativePriceChangeRadioGroup').value)
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
    const value = HelperService.parseLocalizedInputValue(
      this.editingFormGroup.get('valueInput').value,
      this.translocoLocaleService.getLocale()
    );

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
        newPrice = this.editingFormGroup.get('isRelativePriceChangeRadioGroup')
          .value
          ? PriceService.multiplyAndRoundValues(
              this.modalData.quotationDetail.price,
              1 + value / 100
            )
          : value;
      } else {
        newPrice = value;
      }
      const priceUnit = PriceService.getPriceUnit(
        this.modalData.quotationDetail
      );
      const price = newPrice / priceUnit;

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

  onKeyPress(event: KeyboardEvent): void {
    if (this.modalData.field === ColumnFields.ORDER_QUANTITY) {
      HelperService.validateQuantityInputKeyPress(event);
    }
  }

  increment(): void {
    // margins and discounts should not be higher than 99 %
    const value = HelperService.parseLocalizedInputValue(
      this.editingFormGroup.get('valueInput').value,
      this.translocoLocaleService.getLocale()
    );

    if (
      [ColumnFields.ORDER_QUANTITY, ColumnFields.PRICE].includes(
        this.modalData.field
      ) ||
      value < 99
    ) {
      this.editingFormGroup
        .get('valueInput')
        .setValue(
          this.helperService
            .transformNumber(
              (value || this.value || 0) + 1,
              !Number.isInteger(value)
            )
            .toString()
        );
      this.editInputField?.nativeElement.focus();
    }
  }

  decrement(): void {
    const value = HelperService.parseLocalizedInputValue(
      this.editingFormGroup.get('valueInput').value,
      this.translocoLocaleService.getLocale()
    );
    if (
      // should not decrement to less than -99 % for percentage changes
      (this.modalData.field !== ColumnFields.ORDER_QUANTITY &&
        this.editingFormGroup.get('isRelativePriceChangeRadioGroup').value &&
        (value ?? this.value) > -99) ||
      // absolute price can not be lower than 1
      (!this.editingFormGroup.get('isRelativePriceChangeRadioGroup').value &&
        (value ?? this.value) > 1) ||
      // quantity should not be lower than 1
      (this.modalData.field === ColumnFields.ORDER_QUANTITY &&
        (value ?? this.value) > 1)
    ) {
      this.editingFormGroup
        .get('valueInput')
        .setValue(
          this.helperService
            .transformNumber(
              (value || this.value || 0) - 1,
              !Number.isInteger(value)
            )
            .toString()
        );
      this.editInputField?.nativeElement.focus();
    }
  }

  onRadioButtonChange(isRelative: boolean): void {
    this.editingFormGroup.get('valueInput').setValue('');
    this.setAffectedKpis(isRelative ? this.modalData.quotationDetail.price : 0);
  }
}
