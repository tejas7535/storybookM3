import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { Store } from '@ngrx/store';

import { getAvailableCurrencies } from '../../../../core/store';
import { UpdateQuotationRequest } from '../../../services/rest-services/quotation-service/models/update-quotation-request.model';

@Component({
  selector: 'gq-edit-case-modal',

  templateUrl: './edit-case-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCaseModalComponent implements OnInit {
  NAME_MAX_LENGTH = 20;

  public caseModalForm: UntypedFormGroup;
  public poDateLessThanToday: boolean;

  currencies$: Observable<string[]>;

  private readonly now: Date = new Date(Date.now());
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private today: Date = new Date(this.now.setHours(0, 0, 0, 0));

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      caseName: string;
      currency: string;
      enableEditDates: boolean;
      quotationToDate?: string;
      requestedDeliveryDate?: string;
      customerPurchaseOrderDate?: string;
      bindingPeriodValidityEndDate?: string;
    },
    private readonly dialogRef: MatDialogRef<EditCaseModalComponent>,
    private readonly store: Store,
    private readonly adapter: DateAdapter<any>,
    private readonly translocoLocaleService: TranslocoLocaleService
  ) {}

  ngOnInit(): void {
    const locale = this.translocoLocaleService.getLocale();

    this.adapter.setLocale(locale || 'en-US');

    this.currencies$ = this.store.select(getAvailableCurrencies);

    this.caseModalForm = new UntypedFormGroup({
      caseName: new UntypedFormControl(this.modalData?.caseName || '', [
        Validators.pattern('\\s*\\S.*'),
        Validators.maxLength(this.NAME_MAX_LENGTH),
      ]),
      currency: new UntypedFormControl(this.modalData.currency, [
        Validators.required,
      ]),
      quotationToDate: new FormControl(
        {
          value: this.modalData?.quotationToDate
            ? new Date(this.modalData?.quotationToDate)
            : undefined,
          disabled: !this.modalData?.enableEditDates,
        },
        [this.validateDateGreaterOrEqualThanPurchaseOrderDate]
      ),
      requestedDeliveryDate: new FormControl({
        value: this.modalData?.requestedDeliveryDate
          ? new Date(this.modalData?.requestedDeliveryDate)
          : undefined,
        disabled: !this.modalData?.enableEditDates,
      }),
      customerPurchaseOrderDate: new FormControl({
        value: this.modalData?.customerPurchaseOrderDate
          ? new Date(this.modalData?.customerPurchaseOrderDate)
          : undefined,
        disabled: !this.modalData?.enableEditDates,
      }),
      bindingPeriodValidityEndDate: new FormControl(
        {
          value: this.modalData?.bindingPeriodValidityEndDate
            ? new Date(this.modalData?.bindingPeriodValidityEndDate)
            : undefined,
          disabled: !this.modalData?.enableEditDates,
        },
        [this.validateDateGreaterOrEqualThanPurchaseOrderDate]
      ),
    });

    this.subscribeToChanges();
  }

  public subscribeToChanges(): void {
    this.caseModalForm
      .get('requestedDeliveryDate')
      .valueChanges.subscribe(
        (value) =>
          (this.poDateLessThanToday = this.checkValueGreaterOrEqualToday(value))
      );

    this.caseModalForm
      .get('customerPurchaseOrderDate')
      .valueChanges.subscribe(() => {
        Object.keys(this.caseModalForm.controls).forEach((field) => {
          if (field !== 'customerPurchaseOrderDate') {
            const control = this.caseModalForm.get(field);
            control.updateValueAndValidity();
          }
        });
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitDialog(): void {
    const returnUpdateQuotationRequest: UpdateQuotationRequest = {
      caseName: this.caseModalForm.controls.caseName.value.trim(),
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
      if (poDate && new Date(control.value).valueOf() < poDate.value) {
        return { smallerThanPoDate: true };
      }
    }

    return undefined;
  };
}
