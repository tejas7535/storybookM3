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

import { Observable, tap } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { SalesOrg } from '@gq/core/store/reducers/create-case/models/sales-orgs.model';
import { CaseFilterItem } from '@gq/core/store/reducers/models';
import { DATE_FORMATS } from '@gq/process-case-view/header-content/header-content.module';
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
  shipToParty$: Observable<CaseFilterItem> =
    this.autocomplete.shipToCustomerForCaseCreation$;
  isEditMode = false;

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
        [this.validateDateGreaterOrEqualThanPurchaseOrderDate]
      ),
      requestedDeliveryDate: new FormControl(
        {
          value: undefined,
          disabled: false,
        },
        [this.validateDateGreaterOrEqualToday]
      ),
      customerPurchaseOrderDate: new FormControl({
        value: undefined,
        disabled: false,
      }),
      bindingPeriodValidityEndDate: new FormControl(
        {
          value: undefined,
          disabled: false,
        },
        [this.validateDateGreaterOrEqualThanPurchaseOrderDate]
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
    // when the customer sales orgs are loading, reset the partner role type
    this.createCaseFacade.customerSalesOrgs$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((_loading) => {
          // eslint-disable-next-line unicorn/no-useless-undefined
          this.headerInfoForm.get('partnerRoleType')?.setValue(undefined);
        })
      )
      .subscribe();

    this.headerInfoFormChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((formValues) => {
        this.hasChanges.emit(this.hasHeaderInfoFormChange);
        this.isValid.emit(this.headerInfoForm.valid);
        this.data.emit(formValues);
      });
  }

  ngOnDestroy(): void {
    this.reset();
  }
}
