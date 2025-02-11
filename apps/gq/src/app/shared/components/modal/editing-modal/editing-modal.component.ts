/* eslint-disable max-lines */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { combineLatest, map, Observable, pairwise, Subscription } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { UpdateQuotationDetail } from '@gq/core/store/active-case/models';
import { SimulationService } from '@gq/process-case-view/quotation-details-table/services/simulation/simulation.service';
import { PercentColumns } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import {
  getNextHigherPossibleMultiple,
  getNextLowerPossibleMultiple,
  parseLocalizedInputValue,
} from '@gq/shared/utils/misc.utils';
import { multiplyAndRoundValues } from '@gq/shared/utils/pricing.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';
import Big from 'big.js';

import { EditingModal } from './models/editing-modal.model';
import { KpiValue } from './models/kpi-value.model';

@Directive()
export abstract class EditingModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private readonly simulationService: SimulationService =
    inject(SimulationService);
  protected translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );
  protected transformationService: TransformationService = inject(
    TransformationService
  );
  private readonly dialogRef: MatDialogRef<EditingModalComponent> =
    inject(MatDialogRef);
  private readonly store: Store = inject(Store);
  private readonly changeDetectorRef: ChangeDetectorRef =
    inject(ChangeDetectorRef);

  private readonly featureToggleService: FeatureToggleConfigService = inject(
    FeatureToggleConfigService
  );

  @Input() modalData: EditingModal;
  @Input() isDialog = true;
  @Input() isDisabled = false;
  @Input() warningTemplate: TemplateRef<any>;
  @Input() additionalContentTemplate: TemplateRef<any>;
  @Input() kpiAdditionalContentTemplate: TemplateRef<any>;

  @Output() affectedKpiOutput: EventEmitter<KpiValue[]> = new EventEmitter();
  @Output() isInvalidOrUnchanged: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('editInputField') editInputField: ElementRef;

  readonly isNewCaseCreation = this.featureToggleService.isEnabled(
    'createManualCaseAsView'
  );

  readonly isTargetPriceSourceEditable = this.featureToggleService.isEnabled(
    'targetPriceSourceColumn'
  );

  readonly VALUE_FORM_CONTROL_NAME = 'valueInput';
  readonly IS_RELATIVE_PRICE_CONTROL_NAME = 'isRelativePriceChangeRadioGroup';
  readonly ADDITIONAL_CONTENT_CONTROL_NAME = 'additionalContentValue';

  editingFormGroup = new FormGroup<{
    valueInput: FormControl<string | undefined>;
    isRelativePriceChangeRadioGroup?: FormControl<boolean>;
    additionalContentValue?: FormControl;
  }>({
    valueInput: new FormControl(undefined),
    additionalContentValue: new FormControl(undefined),
  });

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

  /**
   * when true will display a hint under formControl based on the field
   */
  showFieldHint = false;

  ngOnInit(): void {
    this.editingFormGroup
      .get(this.VALUE_FORM_CONTROL_NAME)
      .setValidators([this.isInputValid.bind(this)]);
    this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).markAllAsTouched();

    if (this.isDisabled) {
      this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).disable();
    }

    this.updateLoading$ = this.store.select(
      activeCaseFeature.selectUpdateLoading
    );

    if (this.isPriceChangeTypeAvailable) {
      this.initPriceChangeRadioGroup();
    }

    this.subscribeLoadingStopped();
    this.subscribeInputValueChanges();
    if (this.handleAdditionalContent) {
      this.handleAdditionalContent();
    }
  }

  ngAfterViewInit(): void {
    this.value = this.getValue();
    this.localeValue = this.getLocaleValue(this.value);

    this.setAffectedKpis(this.value);

    this.editInputField?.nativeElement.focus();
    this.changeDetectorRef.detectChanges();
    if (this.isNewCaseCreation) {
      const initialValue = this.getInitialValue?.(this.value);
      if (initialValue) {
        this.value = initialValue;
        this.editingFormGroup
          .get(this.VALUE_FORM_CONTROL_NAME)
          .setValue(`${initialValue}`);
      }
    }

    // validate input initially
    this.validateInput(`${this.value}`);
  }

  callPriceChangeTypeSwitchHandler(isRelative: boolean): void {
    this.priceChangeSwitched();
    this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).setValue('');
    this.handlePriceChangeTypeSwitch?.(isRelative);
  }

  /**
   * Increase or decrease the value, depending on the given increment value.
   *
   * @param increment 1 to increment and -1 to decrement
   */
  changeValueIncrementally(increment: -1 | 1 | number): void {
    const value = parseLocalizedInputValue(
      this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).value,
      this.translocoLocaleService.getLocale()
    );

    const shouldChange =
      increment > 0 ? this.shouldIncrement(value) : this.shouldDecrement(value);

    if (shouldChange) {
      // next Value by multiple
      let nextHigher = getNextHigherPossibleMultiple(value, this.incrementStep);
      let nextLower = getNextLowerPossibleMultiple(value, this.incrementStep);

      nextHigher =
        nextHigher === value
          ? getNextHigherPossibleMultiple(nextHigher + 1, this.incrementStep)
          : nextHigher;
      nextLower =
        nextLower === value
          ? getNextLowerPossibleMultiple(nextLower - 1, this.incrementStep)
          : nextLower;
      const newValue = increment > 0 ? nextHigher : nextLower;

      this.editingFormGroup
        .get(this.VALUE_FORM_CONTROL_NAME)
        .setValue(
          this.transformationService
            .transformNumber(
              this.incrementStep && this.decrementStep
                ? newValue
                : (value || this.value || 0) + increment,
              !Number.isInteger(value)
            )
            .toString()
        );
      this.editInputField?.nativeElement.focus();
    }
  }

  confirmEditing(): void {
    const value = parseLocalizedInputValue(
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
    // if percentage number then multiply with 100
    const updatedValue = PercentColumns.includes(this.modalData.field)
      ? Big(value).times(100).toNumber()
      : value;

    return this.transformationService.transformNumber(updatedValue, true);
  }

  protected setAffectedKpis(value: number): void {
    this.affectedKpis = this.simulationService.calculateAffectedKPIs(
      value,
      this.modalData.field,
      this.modalData.quotationDetail,
      !this.isPriceChangeTypeAvailable ||
        (this.isPriceChangeTypeAvailable &&
          this.editingFormGroup.get(this.IS_RELATIVE_PRICE_CONTROL_NAME).value)
    );

    const invalid =
      this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).invalid ||
      this.editingFormGroup.get(this.IS_RELATIVE_PRICE_CONTROL_NAME)?.invalid;
    const unchanged =
      !this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).value ||
      !this.hasValueChanged;

    this.isInvalidOrUnchanged.emit(invalid || unchanged);

    this.affectedKpiOutput.emit(this.affectedKpis);
  }

  protected resetKpiValues() {
    this.affectedKpis = this.affectedKpis.map((kpi) => ({
      ...kpi,
      value: undefined as number,
    }));
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

  private initPriceChangeRadioGroup(): void {
    this.editingFormGroup.addControl(
      this.IS_RELATIVE_PRICE_CONTROL_NAME,
      new FormControl(false, Validators.required)
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
    const control = this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME);
    this.subscription.add(
      control.valueChanges.subscribe((value: string) => {
        let parsedValue = parseLocalizedInputValue(
          value,
          this.translocoLocaleService.getLocale()
        );

        if (control.invalid) {
          parsedValue = Number.NaN;
        } else if (PercentColumns.includes(this.modalData.field)) {
          parsedValue = Big(parsedValue).div(100).toNumber();
        }

        this.handleHasValueChanged(parsedValue);
        // trigger dynamic kpi simulation
        this.setAffectedKpis(parsedValue);
      })
    );
  }

  /**
   * checks whether changes have been made.
   * True when input Value has changed
   * or when additional content is available value or additional content has changed
   * else False
   *
   * @param parsedValue the parsed value from the input field
   * @param additionalContentChanged boolean value if the additional content has been changed (logic is handled in providing component)
   */
  protected handleHasValueChanged(
    parsedValue: number,
    additionalValueHasChanged?: boolean
  ): void {
    const oldValue = (this.modalData.quotationDetail as any)[
      this.modalData.field
    ];

    // if percentage field only consider 4 digits as input allows only 4 digits
    const formattedOldValue = PercentColumns.includes(this.modalData.field)
      ? Number.parseFloat(oldValue.toFixed(4))
      : oldValue;

    const hasInputControlChanged =
      formattedOldValue !== this.determineAbsoluteValue(parsedValue) &&
      !!this.editingFormGroup.get(this.VALUE_FORM_CONTROL_NAME).value;

    this.hasValueChanged = this.additionalContentTemplate
      ? hasInputControlChanged || additionalValueHasChanged
      : hasInputControlChanged;
  }

  /**
   * Handle the switch between relative and absolute price change via radio buttons.
   *
   * @param isRelative true, if relative price change has been selected, otherwise false
   */
  abstract handlePriceChangeTypeSwitch?(isRelative: boolean): void;

  /**
   * publish the switch between relative and absolute price change via radio buttons.
   */
  abstract priceChangeSwitched?(): void;

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
   * will override the current value from modalData and set to the formControl
   * @param value The current value
   */
  abstract getInitialValue?(value: number): number;
  /**
   * parameter 1 for more specified error message
   */
  errorMsgParams1?: string;
  /**
   * parameter 2 for more specified error message
   */
  errorMsgParams2?: string;

  /**
   * parameter 1 for more specified hint message
   */
  hintMsgParams1?: string;
  /**
   * parameter 2 for more specified hint message
   */
  hintMsgParams2?: string;

  /**
   * Check if the value should be incremented.
   *
   * @param value The current value. In some cases, incrementing is always possible and the current value does not need to be checked.
   * @returns true, if the value should be incremented, otherwise false.
   */
  protected abstract shouldIncrement(value?: number): boolean;
  /**
   * Increment step value
   */
  incrementStep?: number;

  /**
   * Check if the value should be decremented.
   *
   * @param value The current value.
   * @returns true, if the value should be decremented, otherwise false.
   */
  protected abstract shouldDecrement(value: number): boolean;
  /**
   * Decrement step value
   */
  decrementStep?: number;

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

  protected handleAdditionalContent?(): void;
}
