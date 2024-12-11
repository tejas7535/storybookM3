import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

import { BehaviorSubject, debounce, EMPTY, Observable, tap, timer } from 'rxjs';

import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades/autocomplete.facade';
import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { SalesOrg } from '@gq/core/store/reducers/create-case/models/sales-orgs.model';
import { SectorGpsdFacade } from '@gq/core/store/sector-gpsd/sector-gpsd.facade';
import { IdValue } from '@gq/shared/models/search';
import { getMomentUtcStartOfDayDate } from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import _ from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import moment, { Moment } from 'moment';

import { FilterNames } from '../autocomplete-input/filter-names.enum';
import { EditCaseModalData } from '../modal/edit-case-modal/edit-case-modal-data.model';
import { HeaderInformationData } from './models/header-information-data.interface';
@Directive()
export abstract class CaseHeaderInformationComponent implements OnInit {
  submitDialog?(): void;
  closeDialog?(): void;
  /**
   * actions that need to be performed when the component is destroyed
   */
  abstract reset(): void;
  /**
   * Observable that emits the sales orgs of the ship to party
   */
  abstract shipToPartySalesOrgs$: Observable<SalesOrg[]>;

  abstract isEditMode: boolean;
  abstract quotationToChangedByUser: boolean;
  // values for the Form after initialization, needed to Check whether the form has changes or not
  private initialFormValues: HeaderInformationData;

  private readonly headerInfoFormChanged$$: BehaviorSubject<HeaderInformationData> =
    new BehaviorSubject<HeaderInformationData>(null);
  private readonly adapter: DateAdapter<Moment> = inject(DateAdapter);
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  private readonly currencyFacade: CurrencyFacade = inject(CurrencyFacade);
  private readonly rolesFacade: RolesFacade = inject(RolesFacade);
  private readonly changeDetectorRef: ChangeDetectorRef =
    inject(ChangeDetectorRef);

  readonly autocomplete: AutoCompleteFacade = inject(AutoCompleteFacade);
  readonly destroyRef: DestroyRef = inject(DestroyRef);

  readonly sectorGpsdFacade: SectorGpsdFacade = inject(SectorGpsdFacade);

  readonly NAME_MAX_LENGTH = 35;
  readonly DEBOUNCE_TIME_DEFAULT = 500;

  readonly today: Moment = getMomentUtcStartOfDayDate(new Date().toISOString());
  readonly MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE = 2;
  readonly COMMENT_INPUT_MAX_LENGTH = 200;

  modalData: EditCaseModalData;
  isInvalidInput = false;
  shipToPartySalesOrg: string;
  isSapCase: boolean;
  filterName = FilterNames.CUSTOMER_AND_SHIP_TO_PARTY;

  headerInfoForm: FormGroup;
  hasHeaderInfoFormChange: boolean;
  userHasOfferTypeAccess$: Observable<boolean> =
    this.rolesFacade.userHasRegionWorldOrGreaterChinaRole$.pipe();

  headerInfoFormChanged$: Observable<HeaderInformationData> =
    this.headerInfoFormChanged$$.asObservable();

  availableCurrencies$: Observable<string[]> =
    this.currencyFacade.availableCurrencies$;

  ngOnInit(): void {
    this.quotationToChangedByUser = false;
    const locale = this.translocoLocaleService.getLocale();
    this.adapter.setLocale(locale || 'en-US');
    this.initialFormValues = cloneDeep(this.headerInfoForm.getRawValue());
    this.subscribeToChanges();
  }

  subscribeToChanges(): void {
    this.headerInfoForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((formValues: HeaderInformationData) => {
        const mappedFormValues = _.mapValues(formValues, (value) =>
          value === null || value === '' ? undefined : value
        );
        this.hasHeaderInfoFormChange = !isEqual(
          mappedFormValues,
          this.initialFormValues
        );

        if (
          this.hasHeaderInfoFormChange &&
          formValues.customerInquiryDate !==
            this.initialFormValues.customerInquiryDate
        ) {
          this.validateInquiryDateDependentDates();
        }

        this.headerInfoFormChanged$$.next({
          ...(mappedFormValues as HeaderInformationData),
          quotationToManualInput: this.quotationToChangedByUser,
        });
      });

    this.headerInfoForm
      .get('shipToParty')
      .valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
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

    this.shipToPartySalesOrgs$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((salesOrgs: SalesOrg[]) => {
        if (salesOrgs && salesOrgs.length > 0) {
          this.shipToPartySalesOrg = salesOrgs[0].id;
        }
      });
  }

  onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    if (pastedText.length > this.COMMENT_INPUT_MAX_LENGTH) {
      this.isInvalidInput = true;

      // Clear the error after 3 seconds
      setTimeout(() => {
        this.isInvalidInput = false;
        this.changeDetectorRef.detectChanges();
      }, 3000);
    }
  }

  protected validateDateGreaterOrEqualReferenceDate(
    referenceDate: Moment
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return undefined;
      }

      if (getMomentUtcStartOfDayDate(control.value).isBefore(referenceDate)) {
        return { smallerThanReferenceDate: true };
      }

      return undefined;
    };
  }

  protected validateDateGreaterReferenceDate(
    referenceDate: Moment
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return undefined;
      }

      if (
        getMomentUtcStartOfDayDate(control.value).isSameOrBefore(referenceDate)
      ) {
        return { smallerOrEqualThanReferenceDate: true };
      }

      return undefined;
    };
  }
  protected validateDateSmallerOrEqualReferenceDate(
    referenceDate: Moment
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return undefined;
      }

      if (
        getMomentUtcStartOfDayDate(control.value).isAfter(referenceDate, 'day')
      ) {
        return { greaterThanReferenceDate: true };
      }

      return undefined;
    };
  }

  protected validateInquiryDateDependentDates = () => {
    const quotationToDateControl = this.headerInfoForm.get('quotationToDate');
    quotationToDateControl?.updateValueAndValidity({ emitEvent: false });

    if (this.quotationToChangedByUser) {
      quotationToDateControl.markAsTouched();
    } else {
      quotationToDateControl?.markAsUntouched();
    }
  };

  protected validateDateGreaterOrEqualInquiryDate: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control.value) {
      return undefined;
    }

    if (this.headerInfoForm) {
      const inquiryDate = this.headerInfoForm.get('customerInquiryDate');

      if (inquiryDate && control.value.isBefore(moment(inquiryDate.value))) {
        return { smallerThanInquiryDate: true };
      }
    }

    return undefined;
  };

  protected validateDateMoreThan18MonthsInFutureFromReferenceDate(
    referenceDate: Moment
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return undefined;
      }

      const date = getMomentUtcStartOfDayDate(control.value);
      if (referenceDate && date.diff(referenceDate, 'months', true) > 18) {
        return { moreThan18MonthsInFuture: true };
      }

      return undefined;
    };
  }
  protected formatAutocompleteResult(value: IdValue) {
    if (!value?.id || !value?.value) {
      return '';
    }

    return `${value.id} | ${value.value} ${
      value.value2 ? `| ${value.value2}` : ''
    }`;
  }
}
