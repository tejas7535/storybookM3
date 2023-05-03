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

import {
  debounce,
  EMPTY,
  Observable,
  Subject,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

import {
  clearCreateCaseRowData,
  clearCustomer,
  resetAllAutocompleteOptions,
} from '@gq/core/store/actions';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { SalesOrg } from '@gq/core/store/reducers/models';
import { getAvailableCurrencies, getSalesOrgs } from '@gq/core/store/selectors';
import { IdValue } from '@gq/shared/models/search';
import { ShipToParty } from '@gq/shared/services/rest/quotation/models/ship-to-party';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { Store } from '@ngrx/store';

import { UpdateQuotationRequest } from '../../../services/rest/quotation/models/update-quotation-request.model';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';

@Component({
  selector: 'gq-edit-case-modal',
  templateUrl: './edit-case-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCaseModalComponent implements OnInit, OnDestroy {
  private readonly DEBOUNCE_TIME_DEFAULT = 500;
  public readonly MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE = 2;
  NAME_MAX_LENGTH = 20;

  options: IdValue[] = [];

  public caseModalForm: UntypedFormGroup;
  public poDateLessThanToday: boolean;
  public salesOrg: string;
  public filterName = FilterNames.CUSTOMER_AND_SHIP_TO_PARTY;

  currencies$: Observable<string[]>;
  unsubscribe$$: Subject<boolean> = new Subject<boolean>();

  private readonly now: Date = new Date(Date.now());
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private today: Date = new Date(this.now.setHours(0, 0, 0, 0));

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      caseName: string;
      currency: string;
      enableSapFieldEditing: boolean;
      shipToParty?: IdValue;
      quotationToDate?: string;
      requestedDeliveryDate?: string;
      customerPurchaseOrderDate?: string;
      bindingPeriodValidityEndDate?: string;
      salesOrg?: string;
    },
    private readonly dialogRef: MatDialogRef<EditCaseModalComponent>,
    private readonly store: Store,
    private readonly adapter: DateAdapter<any>,
    private readonly translocoLocaleService: TranslocoLocaleService,
    public readonly autocomplete: AutoCompleteFacade
  ) {}

  ngOnInit(): void {
    this.autocomplete.resetView();
    this.autocomplete.initFacade(AutocompleteRequestDialog.EDIT_CASE);
    this.dispatchResetActions();

    const locale = this.translocoLocaleService.getLocale();

    this.adapter.setLocale(locale || 'en-US');

    this.currencies$ = this.store.select(getAvailableCurrencies);

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
            ? new Date(this.modalData?.quotationToDate)
            : undefined,
          disabled: !this.modalData?.enableSapFieldEditing,
        },
        [this.validateDateGreaterOrEqualThanPurchaseOrderDate]
      ),
      requestedDeliveryDate: new FormControl({
        value: this.modalData?.requestedDeliveryDate
          ? new Date(this.modalData?.requestedDeliveryDate)
          : undefined,
        disabled: !this.modalData?.enableSapFieldEditing,
      }),
      customerPurchaseOrderDate: new FormControl({
        value: this.modalData?.customerPurchaseOrderDate
          ? new Date(this.modalData?.customerPurchaseOrderDate)
          : undefined,
        disabled: !this.modalData?.enableSapFieldEditing,
      }),
      bindingPeriodValidityEndDate: new FormControl(
        {
          value: this.modalData?.bindingPeriodValidityEndDate
            ? new Date(this.modalData?.bindingPeriodValidityEndDate)
            : undefined,
          disabled: !this.modalData?.enableSapFieldEditing,
        },
        [this.validateDateGreaterOrEqualThanPurchaseOrderDate]
      ),
    });

    this.subscribeToChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$$.next(true);
    this.unsubscribe$$.complete();
  }

  public subscribeToChanges(): void {
    this.caseModalForm
      .get('requestedDeliveryDate')
      .valueChanges.pipe(takeUntil(this.unsubscribe$$))
      .subscribe(
        (value) =>
          (this.poDateLessThanToday = this.checkValueGreaterOrEqualToday(value))
      );

    this.caseModalForm
      .get('customerPurchaseOrderDate')
      .valueChanges.pipe(takeUntil(this.unsubscribe$$))
      .subscribe(() => {
        Object.keys(this.caseModalForm.controls).forEach((field) => {
          if (field !== 'customerPurchaseOrderDate') {
            const control = this.caseModalForm.get(field);
            control.updateValueAndValidity();
          }
        });
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
    this.dialogRef.close();
  }

  submitDialog(): void {
    const returnUpdateQuotationRequest: UpdateQuotationRequest = {
      caseName: this.caseModalForm.controls.caseName.value
        ? this.caseModalForm.controls.caseName.value.trim()
        : undefined,
      currency: this.caseModalForm.controls.currency.value,
      quotationToDate: this.caseModalForm.controls.quotationToDate.value
        ? new Date(
            this.caseModalForm.controls.quotationToDate.value
          ).toISOString()
        : undefined,
      requestedDelDate: this.caseModalForm.controls.requestedDeliveryDate.value
        ? new Date(
            this.caseModalForm.controls.requestedDeliveryDate.value
          ).toISOString()
        : undefined,
      customerPurchaseOrderDate: this.caseModalForm.controls
        .customerPurchaseOrderDate.value
        ? new Date(
            this.caseModalForm.controls.customerPurchaseOrderDate.value
          ).toISOString()
        : undefined,
      validTo: this.caseModalForm.controls.bindingPeriodValidityEndDate.value
        ? new Date(
            this.caseModalForm.controls.bindingPeriodValidityEndDate.value
          ).toISOString()
        : undefined,
      shipToParty: this.caseModalForm.controls.shipToParty.value
        ? ({
            customerId: this.caseModalForm.controls.shipToParty.value.id,
            salesOrg: this.salesOrg,
          } as ShipToParty)
        : undefined,
    };
    this.dialogRef.close(returnUpdateQuotationRequest);
  }

  public checkValueGreaterOrEqualToday(value: Date): boolean {
    if (!value) {
      return undefined;
    }

    if (value.valueOf() < this.today.valueOf()) {
      return true;
    }

    return undefined;
  }

  public validateDateGreaterOrEqualThanPurchaseOrderDate: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control.value) {
      return undefined;
    }

    if (this.caseModalForm) {
      const poDate = this.caseModalForm.get('customerPurchaseOrderDate');

      if (poDate && new Date(control.value).valueOf() <= poDate.value) {
        return { smallerThanPoDate: true };
      }
    }

    return undefined;
  };

  public datesAreEqual(date1: Date | string, date2: string): boolean {
    if (!date1 && !date2) {
      return true;
    }

    return new Date(date1).getTime() === new Date(date2).getTime();
  }

  public formatAutocompleteResult(value: IdValue) {
    if (!value?.id || !value?.value) {
      return '';
    }

    return `${value.id} | ${value.value} ${
      value.value2 ? `| ${value.value2}` : ''
    }`;
  }

  private dispatchResetActions(): void {
    this.store.dispatch(resetAllAutocompleteOptions());
    this.store.dispatch(clearCustomer());
    this.store.dispatch(clearCreateCaseRowData());
  }
}
