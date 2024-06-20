import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { debounce, EMPTY, Subject, takeUntil, tap, timer } from 'rxjs';

import {
  clearCreateCaseRowData,
  clearCustomer,
  resetAllAutocompleteOptions,
} from '@gq/core/store/actions';
import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { SalesOrg } from '@gq/core/store/reducers/models';
import { SectorGpsdFacade } from '@gq/core/store/sector-gpsd/sector-gpsd.facade';
import { getSalesOrgs } from '@gq/core/store/selectors';
import { IdValue } from '@gq/shared/models/search';
import { ShipToParty } from '@gq/shared/services/rest/quotation/models/ship-to-party';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { Store } from '@ngrx/store';
import moment, { isMoment, Moment } from 'moment';

import { UpdateQuotationRequest } from '../../../services/rest/quotation/models/update-quotation-request.model';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import { EditCaseModalData } from './edit-case-modal-data.model';

@Component({
  selector: 'gq-edit-case-modal',
  templateUrl: './edit-case-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCaseModalComponent implements OnInit, OnDestroy {
  private readonly DEBOUNCE_TIME_DEFAULT = 500;
  private readonly today: Date = new Date(new Date().setHours(0, 0, 0, 0));
  readonly MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE = 2;

  NAME_MAX_LENGTH = 20;

  options: IdValue[] = [];
  caseModalForm: UntypedFormGroup;
  hasCaseModalFormChange: boolean;
  salesOrg: string;

  filterName = FilterNames.CUSTOMER_AND_SHIP_TO_PARTY;

  unsubscribe$$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: EditCaseModalData,
    private readonly dialogRef: MatDialogRef<EditCaseModalComponent>,
    private readonly store: Store,
    private readonly adapter: DateAdapter<any>,
    private readonly translocoLocaleService: TranslocoLocaleService,
    readonly autocomplete: AutoCompleteFacade,
    readonly currencyFacade: CurrencyFacade,
    readonly sectorGpsdFacade: SectorGpsdFacade
  ) {}

  ngOnInit(): void {
    this.sectorGpsdFacade.loadSectorGpsdByCustomerAndSalesOrg(
      this.modalData.caseCustomer.identifier.customerId,
      this.modalData.caseCustomer.identifier.salesOrg
    );

    this.autocomplete.resetView();
    this.autocomplete.initFacade(AutocompleteRequestDialog.EDIT_CASE);
    this.dispatchResetActions();

    const locale = this.translocoLocaleService.getLocale();

    this.adapter.setLocale(locale || 'en-US');

    this.salesOrg = this.modalData.salesOrg;
    this.caseModalForm = new FormGroup({
      caseName: new FormControl(
        { value: this.modalData?.caseName, disabled: false },
        [
          Validators.pattern('\\s*\\S.*'),
          Validators.maxLength(this.NAME_MAX_LENGTH),
        ]
      ),
      currency: new FormControl(this.modalData.currency, [Validators.required]),
      shipToParty: new FormControl(
        {
          value: this.modalData.shipToParty,
          disabled: !this.modalData?.enableSapFieldEditing,
        },
        []
      ),
      quotationToDate: new FormControl(
        {
          value: this.modalData?.quotationToDate
            ? moment(this.modalData.quotationToDate)
            : undefined,
          disabled: !this.modalData?.enableSapFieldEditing,
        },
        [this.validateDateGreaterOrEqualThanPurchaseOrderDate]
      ),
      requestedDeliveryDate: new FormControl(
        {
          value: this.modalData?.requestedDeliveryDate
            ? moment(this.modalData.requestedDeliveryDate)
            : undefined,
          disabled: !this.modalData?.enableSapFieldEditing,
        },
        [this.validateDateGreaterOrEqualToday]
      ),
      customerPurchaseOrderDate: new FormControl({
        value: this.modalData?.customerPurchaseOrderDate
          ? moment(this.modalData?.customerPurchaseOrderDate)
          : undefined,
        disabled: !this.modalData?.enableSapFieldEditing,
      }),
      bindingPeriodValidityEndDate: new FormControl(
        {
          value: this.modalData?.bindingPeriodValidityEndDate
            ? moment(this.modalData?.bindingPeriodValidityEndDate)
            : undefined,
          disabled: !this.modalData?.enableSapFieldEditing,
        },
        [this.validateDateGreaterOrEqualThanPurchaseOrderDate]
      ),
      purchaseOrderType: new FormControl({
        value: this.modalData?.purchaseOrderType,
        disabled: false,
      }),
      partnerRoleType: new FormControl({
        value: this.modalData?.partnerRoleType,
        disabled: false,
      }),
    });
    if (this.modalData?.disabled) {
      this.caseModalForm.disable();
    }

    this.subscribeToChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$$.next(true);
    this.unsubscribe$$.complete();
  }

  subscribeToChanges(): void {
    this.caseModalForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$$))
      .subscribe((formValues) => {
        let customPurchaseOrderDateChanged = false;

        this.hasCaseModalFormChange = Object.keys(formValues).some((key) => {
          const value = formValues[key];
          const refValue = this.modalData[key as keyof EditCaseModalData];

          let hasChanged = false;

          // check if dates changed
          if (isMoment(value)) {
            hasChanged = !this.isTheSameDay(value, refValue as string);

            // validate other fields that depend on the purchase order date
            if (hasChanged && key === 'customerPurchaseOrderDate') {
              customPurchaseOrderDateChanged = true;
            }
          } else {
            hasChanged =
              value !== refValue &&
              JSON.stringify(value) !== JSON.stringify(refValue); // use stringify for object comparison
          }

          if (hasChanged && refValue === undefined) {
            // ensure that  null = undefined (selects with undefined is resulting in null) & undefined = '' (e.g. removing the case name is resulting in an empty string)
            hasChanged = value !== null && value !== '';
          }

          return hasChanged;
        });

        if (customPurchaseOrderDateChanged) {
          this.validatePurchaseOrderDateDependentDates();
        }
      });

    this.caseModalForm
      .get('shipToParty')
      .valueChanges.pipe(
        takeUntil(this.unsubscribe$$),
        tap((value: string) => {
          if (value?.length < this.MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE) {
            this.autocomplete.resetAutocompleteMaterials();
          }
        }),
        debounce((value: string) =>
          value?.length >= this.MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE
            ? timer(this.DEBOUNCE_TIME_DEFAULT)
            : EMPTY
        )
      )
      .subscribe((searchVal: string) => {
        if (searchVal === '') {
          this.autocomplete.resetAutocompleteMaterials();

          return;
        }

        this.autocomplete.autocomplete({
          filter: FilterNames.CUSTOMER_AND_SHIP_TO_PARTY,
          searchFor: searchVal,
          limit: 5,
        });
      });

    this.store
      .select(getSalesOrgs)
      .pipe(takeUntil(this.unsubscribe$$))
      .subscribe((salesOrgs: SalesOrg[]) => {
        if (salesOrgs && salesOrgs.length > 0) {
          this.salesOrg = salesOrgs[0].id;
        }
      });

    this.dialogRef
      .beforeClosed()
      .pipe(takeUntil(this.unsubscribe$$))
      .subscribe(() => {
        this.dispatchResetActions();
      });
  }

  closeDialog(): void {
    this.sectorGpsdFacade.resetAllSectorGpsds();
    this.dialogRef.close();
  }

  submitDialog(): void {
    const {
      caseName,
      currency,
      quotationToDate,
      requestedDeliveryDate,
      customerPurchaseOrderDate,
      bindingPeriodValidityEndDate,
      shipToParty,
      purchaseOrderType,
      partnerRoleType,
    } = this.caseModalForm.controls;

    const returnUpdateQuotationRequest: UpdateQuotationRequest = {
      caseName: caseName.value?.trim(),
      currency: currency.value,
      quotationToDate: quotationToDate.value?.toISOString(),
      requestedDelDate: requestedDeliveryDate.value?.toISOString(),
      customerPurchaseOrderDate: customerPurchaseOrderDate.value?.toISOString(),
      validTo: bindingPeriodValidityEndDate.value?.toISOString(),
      shipToParty: shipToParty.value?.id
        ? ({
            customerId: shipToParty.value.id,
            salesOrg: this.salesOrg,
          } as ShipToParty)
        : undefined,
      purchaseOrderTypeId: purchaseOrderType.value?.id,
      partnerRoleId: partnerRoleType.value?.id,
    };

    this.dialogRef.close(returnUpdateQuotationRequest);
  }

  validateDateGreaterOrEqualToday: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control.value) {
      return undefined;
    }

    if (control.value.valueOf() < this.today.valueOf()) {
      return { smallerThanToday: true };
    }

    return undefined;
  };

  validatePurchaseOrderDateDependentDates = () => {
    const quotationToDateControl = this.caseModalForm.get('quotationToDate');
    quotationToDateControl?.updateValueAndValidity({ emitEvent: false });
    quotationToDateControl?.markAsTouched();

    const bindingPeriodValidityEndDateControl = this.caseModalForm.get(
      'bindingPeriodValidityEndDate'
    );
    bindingPeriodValidityEndDateControl?.updateValueAndValidity({
      emitEvent: false,
    });
    bindingPeriodValidityEndDateControl?.markAsTouched();
  };

  validateDateGreaterOrEqualThanPurchaseOrderDate: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control.value) {
      return undefined;
    }

    if (this.caseModalForm) {
      const poDate = this.caseModalForm.get('customerPurchaseOrderDate');

      if (poDate && control.value.isSameOrBefore(moment(poDate.value))) {
        return { smallerThanPoDate: true };
      }
    }

    return undefined;
  };

  formatAutocompleteResult(value: IdValue) {
    if (!value?.id || !value?.value) {
      return '';
    }

    return `${value.id} | ${value.value} ${
      value.value2 ? `| ${value.value2}` : ''
    }`;
  }

  private isTheSameDay(date1: Moment, date2: string): boolean {
    if (!date1 && !date2) {
      return true;
    }

    // moment(undefined) would create a today date -> prevent that
    if (!date2) {
      return false;
    }

    return date1.isSame(moment(date2), 'day');
  }

  private dispatchResetActions(): void {
    this.store.dispatch(resetAllAutocompleteOptions());
    this.store.dispatch(clearCustomer());
    this.store.dispatch(clearCreateCaseRowData());
  }
}
