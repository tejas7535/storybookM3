/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import { Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { CaseFilterItem, SalesOrg } from '@gq/core/store/reducers/models';
import { DATE_FORMATS } from '@gq/process-case-view/header-content/header-content.module';
import { ShipToParty } from '@gq/shared/services/rest/quotation/models/ship-to-party';
import { UpdateQuotationRequest } from '@gq/shared/services/rest/quotation/models/update-quotation-request.model';
import { getMomentUtcStartOfDayDate } from '@gq/shared/utils/misc.utils';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { StatusCustomerInfoHeaderModule } from '../../header/status-customer-info-header/status-customer-info-header.module';
import { EditCaseModalComponent } from '../../modal/edit-case-modal/edit-case-modal.component';
import { EditCaseModalData } from '../../modal/edit-case-modal/edit-case-modal-data.model';
import { OfferTypeSelectComponent } from '../../offer-type-select/offer-type-select.component';
import { PurchaseOrderTypeSelectComponent } from '../../purchase-order-type-select/purchase-order-type-select.component';
import { SectorGpsdSelectComponent } from '../../sector-gpsd-select/sector-gpsd-select.component';
import { CaseHeaderInformationComponent } from '../case-header-information.component';

@Component({
  selector: 'gq-edit-case-header-information',
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
export class EditCaseHeaderInformationComponent
  extends CaseHeaderInformationComponent
  implements OnInit
{
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);
  dialogRef: MatDialogRef<EditCaseModalComponent> = inject(MatDialogRef);
  modalData: EditCaseModalData = inject(MAT_DIALOG_DATA) as EditCaseModalData;

  shipToPartySalesOrgs$: Observable<SalesOrg[]> =
    this.activeCaseFacade.shipToPartySalesOrgs$;
  shipToParty$: Observable<CaseFilterItem> =
    this.autocomplete.shipToCustomerForEditCase$;
  isEditMode = true;

  private userHasOfferTypeAccess = false;

  reset(): void {
    this.activeCaseFacade.resetEditCaseSettings();
  }

  ngOnInit(): void {
    this.userHasOfferTypeAccess$.subscribe((hasAccess) => {
      this.userHasOfferTypeAccess = hasAccess;
    });

    this.shipToPartySalesOrg = this.modalData?.shipToPartySalesOrg;
    this.isSapCase = this.modalData?.isSapCase;

    if (this.modalData?.caseCustomer) {
      this.sectorGpsdFacade.loadSectorGpsdByCustomerAndSalesOrg(
        this.modalData?.caseCustomer?.identifier?.customerId,
        this.modalData?.caseCustomer?.identifier?.salesOrg
      );
    }

    this.headerInfoForm = new FormGroup({
      caseName: new FormControl(
        { value: this.modalData?.caseName, disabled: false },
        [
          Validators.pattern('\\s*\\S.*'),
          Validators.maxLength(this.NAME_MAX_LENGTH),
        ]
      ),
      currency: new FormControl(
        {
          value: this.modalData?.currency,
          disabled: this.isSapCase,
        },
        [Validators.required]
      ),
      shipToParty: new FormControl(
        {
          value: this.modalData?.shipToParty,
          disabled: !this.modalData?.enableSapFieldEditing,
        },
        []
      ),
      quotationToDate: new FormControl(
        {
          value: this.modalData?.quotationToDate
            ? getMomentUtcStartOfDayDate(this.modalData?.quotationToDate)
            : undefined,
          disabled: !this.modalData?.enableSapFieldEditing,
        },
        [this.validateDateGreaterOrEqualInquiryDate]
      ),
      requestedDeliveryDate: new FormControl(
        {
          value: this.modalData?.requestedDeliveryDate
            ? getMomentUtcStartOfDayDate(this.modalData?.requestedDeliveryDate)
            : undefined,
          disabled: !this.modalData?.enableSapFieldEditing,
        },
        [
          this.validateDateGreaterOrEqualReferenceDate(
            getMomentUtcStartOfDayDate(this.modalData?.caseCreationDate)
          ),
        ]
      ),
      customerInquiryDate: new FormControl(
        {
          value: this.modalData?.customerInquiryDate
            ? getMomentUtcStartOfDayDate(this.modalData?.customerInquiryDate)
            : undefined,
          disabled: !this.modalData?.enableSapFieldEditing,
        },
        [
          this.validateDateSmallerOrEqualReferenceDate(
            getMomentUtcStartOfDayDate(this.modalData?.caseCreationDate)
          ),
        ]
      ),
      bindingPeriodValidityEndDate: new FormControl(
        {
          value: this.modalData?.bindingPeriodValidityEndDate
            ? getMomentUtcStartOfDayDate(
                this.modalData?.bindingPeriodValidityEndDate
              )
            : undefined,
          disabled: !this.modalData?.enableSapFieldEditing,
        },
        [
          this.validateDateGreaterReferenceDate(
            getMomentUtcStartOfDayDate(this.modalData?.caseCreationDate)
          ),
          this.validateDateMoreThan18MonthsInFutureFromReferenceDate(
            getMomentUtcStartOfDayDate(this.modalData?.caseCreationDate)
          ),
        ]
      ),
      purchaseOrderType: new FormControl({
        value: this.modalData?.purchaseOrderType,
        disabled: false,
      }),
      partnerRoleType: new FormControl({
        value: this.modalData?.partnerRoleType,
        disabled: !this.modalData?.enableSapFieldEditing,
      }),
      offerType: new FormControl({
        value: this.modalData?.offerType,
        disabled: false,
      }),
    });

    if (this.modalData?.disabled) {
      this.headerInfoForm.disable();
    }

    this.autocomplete.resetView();
    this.autocomplete.initFacade(AutocompleteRequestDialog.EDIT_CASE);

    super.ngOnInit();

    this.dialogRef
      .beforeClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.reset();
      });
  }

  closeDialog(): void {
    this.reset();
    this.dialogRef.close();
  }

  submitDialog(): void {
    const {
      caseName,
      currency,
      quotationToDate,
      requestedDeliveryDate,
      customerInquiryDate,
      bindingPeriodValidityEndDate,
      shipToParty,
      purchaseOrderType,
      partnerRoleType,
      offerType,
    } = this.headerInfoForm.controls;

    const returnUpdateQuotationRequest: UpdateQuotationRequest = {
      caseName: caseName.value?.trim(),
      currency: currency.value,
      quotationToDate: quotationToDate.value?.toISOString(),
      requestedDelDate: requestedDeliveryDate.value?.toISOString(),
      customerInquiryDate: customerInquiryDate.value?.toISOString(),
      validTo: bindingPeriodValidityEndDate.value?.toISOString(),
      shipToParty: shipToParty.value?.id
        ? ({
            customerId: shipToParty.value.id,
            salesOrg: this.shipToPartySalesOrg,
          } as ShipToParty)
        : undefined,
      purchaseOrderTypeId: purchaseOrderType.value?.id,
      partnerRoleId: partnerRoleType.value?.id,
      offerTypeId: this.userHasOfferTypeAccess
        ? offerType.value?.id
        : undefined,
    };

    this.dialogRef.close(returnUpdateQuotationRequest);
  }
}
