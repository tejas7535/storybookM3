import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
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

import {
  ActiveCaseActions,
  activeCaseFeature,
  UpdateQuotationDetail,
} from '@gq/core/store/active-case';
import { HelperService } from '@gq/shared/services/helper/helper.service';
import {
  calculateAffectedKPIs,
  multiplyAndRoundValues,
} from '@gq/shared/utils/pricing.utils';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { Store } from '@ngrx/store';

import { EditingModal } from './models/editing-modal.model';
import { KpiValue } from './models/kpi-value.model';

@Directive()
export abstract class EditingModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('editInputField') editInputField: ElementRef;

  readonly VALUE_FORM_CONTROL_NAME = 'valueInput';
  readonly IS_RELATIVE_PRICE_CONTROL_NAME = 'isRelativePriceChangeRadioGroup';

  editingFormGroup = new FormGroup<{
    valueInput: FormControl<string | undefined>;
    isRelativePriceChangeRadioGroup?: FormControl<boolean>;
  }>({ valueInput: new FormControl(undefined) });

  updateLoading$: Observable<boolean>;
  localeValue: string;
  affectedKpis: KpiValue[];

  /**
   * If true, it is possible to switch between relative and absolute price change using radio buttons.
   */
  isPriceChangeTypeAvailable = false;
  isRelativePriceChangeDisabled = false;

  /**
   * Text of the warning, which will be displayed, if it is set.
   */
  warningText?: string;

  /**
   * Only if true, the save button will be enabled
   */
  hasValueChanged = false;

  protected value: number;

  protected readonly subscription: Subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public modalData: EditingModal,
    protected translocoLocaleService: TranslocoLocaleService,
    protected helperService: HelperService,
    private readonly dialogRef: MatDialogRef<EditingModalComponent>,
    private readonly store: Store,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.editingFormGroup
      .get(this.VALUE_FORM_CONTROL_NAME)
      .setValidators([this.isInputValid.bind(this)]);
    this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).markAllAsTouched();

    this.updateLoading$ = this.store.select(
      activeCaseFeature.selectUpdateLoading
    );

    if (this.isPriceChangeTypeAvailable) {
      this.initPriceChangeRadioGroup();
    }

    this.subscribeLoadingStopped();
    this.subscribeInputValueChanges();
  }

  ngAfterViewInit(): void {
    this.value = this.getValue();
    this.localeValue = this.getLocaleValue(this.value);

    this.setAffectedKpis(this.value);

    this.editInputField?.nativeElement.focus();
    this.changeDetectorRef.detectChanges();

    // validate input initially
    this.validateInput(`${this.value}`);
  }

  callPriceChangeTypeSwitchHandler(isRelative: boolean): void {
    this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).setValue('');
    this.handlePriceChangeTypeSwitch?.(isRelative);
  }

  /**
   * Increase or decrease the value, depending on the given increment value.
   *
   * @param increment 1 to increment and -1 to decrement
   */
  changeValueIncrementally(increment: -1 | 1): void {
    const value = HelperService.parseLocalizedInputValue(
      this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).value,
      this.translocoLocaleService.getLocale()
    );

    const shouldChange =
      increment === 1
        ? this.shouldIncrement(value)
        : this.shouldDecrement(value);

    if (shouldChange) {
      this.editingFormGroup
        .get(this.VALUE_FORM_CONTROL_NAME)
        .setValue(
          this.helperService
            .transformNumber(
              (value || this.value || 0) + increment,
              !Number.isInteger(value)
            )
            .toString()
        );
      this.editInputField?.nativeElement.focus();
    }
  }

  confirmEditing(): void {
    const value = HelperService.parseLocalizedInputValue(
      this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).value,
      this.translocoLocaleService.getLocale()
    );

    this.store.dispatch(
      ActiveCaseActions.updateQuotationDetails({
        updateQuotationDetailList: [this.buildUpdateQuotationDetail(value)],
      })
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  callInputFieldKeyDownHandler(event: KeyboardEvent): void {
    this.handleInputFieldKeyDown?.(event);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected getValue(): number {
    const quotationDetail = this.modalData.quotationDetail as any;

    return quotationDetail[this.modalData.field] as number;
  }

  protected getLocaleValue(value: number): string {
    return this.helperService.transformNumber(value, true);
  }

  protected setAffectedKpis(value: number): void {
    this.affectedKpis = calculateAffectedKPIs(
      value,
      this.modalData.field,
      this.modalData.quotationDetail,
      !this.isPriceChangeTypeAvailable ||
        (this.isPriceChangeTypeAvailable &&
          this.editingFormGroup.get(this.IS_RELATIVE_PRICE_CONTROL_NAME).value)
    );
  }

  private initPriceChangeRadioGroup(): void {
    this.editingFormGroup.addControl(
      this.IS_RELATIVE_PRICE_CONTROL_NAME,
      new FormControl(true, Validators.required)
    );

    this.isRelativePriceChangeDisabled =
      this.shouldDisableRelativePriceChange();

    if (this.isRelativePriceChangeDisabled) {
      this.editingFormGroup
        .get(this.IS_RELATIVE_PRICE_CONTROL_NAME)
        .setValue(false);
    }
  }

  private isInputValid(control: AbstractControl): ValidationErrors {
    if (this.validateInput(control.value) || !control.value) {
      return undefined;
    }

    return { invalidInput: true };
  }

  private subscribeLoadingStopped(): void {
    const loadingStopped$ = this.store
      .select(activeCaseFeature.selectUpdateLoading)
      .pipe(
        pairwise(),
        // eslint-disable-next-line ngrx/avoid-mapping-selectors
        map(([preVal, curVal]) => preVal && !curVal)
      );
    const isErrorMessage$ = this.store.select(
      activeCaseFeature.selectQuotationLoadingErrorMessage
    );

    this.subscription.add(
      combineLatest([isErrorMessage$, loadingStopped$]).subscribe(
        ([isErrorMessage, loadingStopped]) => {
          if (!isErrorMessage && loadingStopped) {
            this.closeDialog();
          }
        }
      )
    );
  }

  private subscribeInputValueChanges(): void {
    this.subscription.add(
      this.editingFormGroup
        .get(this.VALUE_FORM_CONTROL_NAME)
        .valueChanges.subscribe((value: string) => {
          let parsedValue = HelperService.parseLocalizedInputValue(
            value,
            this.translocoLocaleService.getLocale()
          );

          if (this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).invalid) {
            parsedValue = Number.NaN;
          }

          this.hasValueChanged =
            (this.modalData.quotationDetail as any)[this.modalData.field] !==
            this.determineAbsoluteValue(parsedValue);

          // trigger dynamic kpi simulation
          this.setAffectedKpis(parsedValue);
        })
    );
  }

  /**
   * Check if the given value is relative and if yes, calculate the absolute value based on it and on the initial value.
   * Otherwise, return the given value without changes.
   * Needed, in order to be able to check if the initial value has been changed.
   *
   * @param value the current value
   * @returns the absolute value
   */
  protected determineAbsoluteValue(value: number): number {
    if (
      this.isPriceChangeTypeAvailable &&
      this.editingFormGroup.get(this.IS_RELATIVE_PRICE_CONTROL_NAME).value
    ) {
      return multiplyAndRoundValues(
        (this.modalData.quotationDetail as any)[this.modalData.field],
        1 + value / 100
      );
    }

    return value;
  }

  /**
   * Handle the switch between relative and absolute price change via radio buttons.
   *
   * @param isRelative true, if relative price change has been selected, otherwise false
   */
  abstract handlePriceChangeTypeSwitch?(isRelative: boolean): void;

  /**
   * Handle keydown event, triggered on the input field.
   *
   * @param event {@link KeyboardEvent}
   */
  abstract handleInputFieldKeyDown?(event: KeyboardEvent): void;

  /**
   * Validate the given input value.
   *
   * @param value The input value to be validated
   * @returns true, if the given input value is valid, otherwise false.
   */
  protected abstract validateInput(value: string): boolean;

  /**
   * Check if the value should be incremented.
   *
   * @param value The current value. In some cases, incrementing is always possible and the current value does not need to be checked.
   * @returns true, if the value should be incremented, otherwise false.
   */
  protected abstract shouldIncrement(value?: number): boolean;

  /**
   * Check if the value should be decremented.
   *
   * @param value The current value.
   * @returns true, if the value should be decremented, otherwise false.
   */
  protected abstract shouldDecrement(value: number): boolean;

  /**
   * If true, "Relative" is disabled and it is not possible to select this price change type in the radio buttons group.
   */
  protected abstract shouldDisableRelativePriceChange?(): boolean;

  /**
   * Build the {@link UpdateQuotationDetail} object, which will be used when editing is confirmed, using the given current value.
   *
   * @param value The current value.
   * @returns The built {@link UpdateQuotationDetail} object
   */
  protected abstract buildUpdateQuotationDetail(
    value: number
  ): UpdateQuotationDetail;
}
