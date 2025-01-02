/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import {
  combineLatest,
  distinctUntilChanged,
  filter,
  Observable,
  tap,
} from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { QuotationToDateStoreModule } from '@gq/core/store/quotation-to-date/quotation-to-date.module';
import { SalesOrg } from '@gq/core/store/reducers/create-case/models/sales-orgs.model';
import { ShipToPartyModule } from '@gq/core/store/ship-to-party/ship-to-party.module';
import { AutocompleteSelectionComponent } from '@gq/shared/components/autocomplete-selection/autocomplete-selection.component';
import { DATE_FORMATS } from '@gq/shared/constants/date-formats';
import { CustomerId } from '@gq/shared/models/customer/customer-ids.model';
import { getMomentUtcStartOfDayDate } from '@gq/shared/utils/misc.utils';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { StatusCustomerInfoHeaderModule } from '../../header/status-customer-info-header/status-customer-info-header.module';
import { OfferTypeSelectComponent } from '../../offer-type-select/offer-type-select.component';
import { PurchaseOrderTypeSelectComponent } from '../../purchase-order-type-select/purchase-order-type-select.component';
import { SectorGpsdSelectComponent } from '../../sector-gpsd-select/sector-gpsd-select.component';
import { SelectSalesOrgComponent } from '../../select-sales-org/select-sales-org.component';
import { CaseHeaderInformationComponent } from '../case-header-information.component';
import { HeaderInformationData } from '../models/header-information-data.interface';

@Component({
  selector: 'gq-create-case-header-information',
  templateUrl: '../case-header-information.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormField,
    MatInputModule,
    SectorGpsdSelectComponent,
    PurchaseOrderTypeSelectComponent,
    OfferTypeSelectComponent,
    SharedTranslocoModule,
    MatSelectModule,
    PushPipe,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    LetDirective,
    AutocompleteInputComponent,
    SelectSalesOrgComponent,
    StatusCustomerInfoHeaderModule,
    AutocompleteSelectionComponent,
    ShipToPartyModule,
    QuotationToDateStoreModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
})
export class CreateCaseHeaderInformationComponent
  extends CaseHeaderInformationComponent
  implements OnInit, OnDestroy
{
  @Output() hasChanges: EventEmitter<boolean> = new EventEmitter();
  @Output() isValid: EventEmitter<boolean> = new EventEmitter();
  @Output() data: EventEmitter<HeaderInformationData> = new EventEmitter();

  private readonly createCaseFacade: CreateCaseFacade =
    inject(CreateCaseFacade);
  shipToPartySalesOrgs$: Observable<SalesOrg[]> =
    this.createCaseFacade.shipToPartySalesOrgs$;
  selectedCustomerSalesOrg$: Observable<SalesOrg> =
    this.createCaseFacade.selectedCustomerSalesOrg$;

  selectedCustomerIdentifier$ = this.createCaseFacade.customerIdentifier$;
  isEditMode = false;
  quotationToChangedByUser = false;

  private readonly controlsToModify = [
    'salesOrg',
    'currency',
    'caseName',
    'purchaseOrderType',
    'partnerRoleType',
    'offerType',
    'shipToParty',
    'quotationToDate',
    'requestedDeliveryDate',
    'customerInquiryDate',
    'bindingPeriodValidityEndDate',
  ];

  reset(): void {
    this.createCaseFacade.resetCaseCreationInformation();
  }

  ngOnInit(): void {
    this.isSapCase = false;
    this.headerInfoForm = new FormGroup({
      customer: new FormControl({ value: undefined, disabled: false }),
      salesOrg: new FormControl({ value: undefined, disabled: false }),
      caseName: new FormControl({ value: undefined, disabled: false }, [
        Validators.pattern('\\s*\\S.*'),
        Validators.maxLength(this.NAME_MAX_LENGTH),
      ]),
      currency: new FormControl(
        {
          value: undefined,
          disabled: false,
        },
        [Validators.required]
      ),
      shipToParty: new FormControl({
        value: undefined,
        disabled: false,
      }),
      quotationToDate: new FormControl(
        {
          value: undefined,
          disabled: false,
        },
        [this.validateDateGreaterOrEqualInquiryDate]
      ),
      requestedDeliveryDate: new FormControl(
        {
          value: undefined,
          disabled: false,
        },
        [this.validateDateGreaterOrEqualReferenceDate(this.today)]
      ),
      customerInquiryDate: new FormControl(
        {
          value: this.today,
          disabled: false,
        },
        [this.validateDateSmallerOrEqualReferenceDate(this.today)]
      ),
      bindingPeriodValidityEndDate: new FormControl(
        {
          value: undefined,
          disabled: false,
        },
        [
          this.validateDateGreaterReferenceDate(this.today),
          this.validateDateMoreThan18MonthsInFutureFromReferenceDate(
            this.today
          ),
        ]
      ),
      purchaseOrderType: new FormControl({
        value: undefined,
        disabled: false,
      }),
      partnerRoleType: new FormControl({
        value: undefined,
        disabled: false,
      }),
      offerType: new FormControl({
        value: undefined,
        disabled: false,
      }),
    });

    this.autocomplete.resetView();
    this.autocomplete.initFacade(AutocompleteRequestDialog.CREATE_CASE);

    super.ngOnInit();
    this.modifyInputs('disable', this.controlsToModify);
    // when the customer sales orgs are loading, reset the partner role type
    this.createCaseFacade.customerSalesOrgs$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_loading) => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        this.headerInfoForm.get('partnerRoleType')?.setValue(undefined);
      });

    this.selectedCustomerSalesOrg$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((salesOrg: SalesOrg) => !!salesOrg),
        distinctUntilChanged()
      )
      .subscribe((salesOrg: SalesOrg) => {
        this.headerInfoForm.get('currency')?.setValue(salesOrg.currency);
      });

    this.selectedCustomerIdentifier$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        tap((customerId: CustomerId) => {
          if (customerId?.customerId) {
            this.modifyInputs('enable', this.controlsToModify);
            this.headerInfoForm
              .get('customerInquiryDate')
              ?.setValue(this.today);
          } else {
            this.modifyInputs('reset', this.controlsToModify);
            this.modifyInputs('disable', this.controlsToModify);
            this.quotationToChangedByUser = false;
          }
        }),
        filter(
          (customerId: CustomerId) =>
            !!customerId?.customerId && !!customerId?.salesOrg
        )
      )
      .subscribe((customerId: CustomerId) => {
        this.createCaseFacade.getQuotationToDate(customerId);
      });

    this.headerInfoForm
      .get('currency')
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((currency: string) => !!currency),
        distinctUntilChanged()
      )
      .subscribe((currency: string) => {
        this.createCaseFacade.updateCurrencyOfPositionItems(currency);
      });

    this.headerInfoForm
      .get('quotationToDate')
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((quotationToDate: Date) => !!quotationToDate),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.quotationToChangedByUser = true;
      });

    this.headerInfoFormChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((formValues) => {
        this.hasChanges.emit(this.hasHeaderInfoFormChange);
        this.isValid.emit(this.headerInfoForm.valid);
        this.data.emit(formValues);
      });

    this.headerInfoForm.statusChanges
      .pipe(
        tap(() => this.isValid.emit(this.headerInfoForm.valid)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    combineLatest([
      this.createCaseFacade.newCaseRowData$,
      this.createCaseFacade.quotationToDate$,
    ])
      .pipe(
        filter(
          ([_rowData, quotationToDate]) =>
            quotationToDate && !this.quotationToChangedByUser
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([rowData, quotationToDate]) => {
        let quotationTo = quotationToDate.extendedDate;
        if (rowData.length >= quotationToDate.manyItemsDateThreshold) {
          quotationTo = quotationToDate.extendedDateForManyItems;
        }
        this.headerInfoForm
          .get('quotationToDate')
          ?.setValue(getMomentUtcStartOfDayDate(quotationTo), {
            emitEvent: false,
          });
      });
  }

  ngOnDestroy(): void {
    this.reset();
  }

  // Common function to handle enabling/disabling/resetting controls
  private modifyInputs(
    action: 'disable' | 'enable' | 'reset',
    controls: string[]
  ): void {
    controls.forEach((control) => {
      const formControl = this.headerInfoForm.controls[control];
      if (formControl) {
        switch (action) {
          case 'disable': {
            formControl.disable();

            break;
          }
          case 'enable': {
            formControl.enable();

            break;
          }
          case 'reset': {
            formControl.reset(undefined, { emitEvent: false, onlySelf: true });

            break;
          }
          // No default
        }
      }
    });
  }
}
