/* eslint-disable max-lines */
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
} from '@angular/material/input';

import { map, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';
import { GridApi } from 'ag-grid-community';
import moment, { Moment } from 'moment';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { IMRService } from '../../../../../feature/internal-material-replacement/imr.service';
import {
  IMRSubstitution,
  replacementTypeValues,
} from '../../../../../feature/internal-material-replacement/model';
import { DatePickerComponent } from '../../../../../shared/components/date-picker/date-picker.component';
import { ErrorHandlingSelectComponent } from '../../../../../shared/components/error-handling-select/error-handling-select.component';
import {
  SelectableValue,
  SelectableValueUtils,
} from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompleteOnTypeComponent } from '../../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { SingleAutocompletePreLoadedComponent } from '../../../../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { DisplayFunctions } from '../../../../../shared/components/inputs/display-functions.utils';
import { FilterDropdownComponent } from '../../../../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { ValidateForm } from '../../../../../shared/decorators';
import { SelectableOptionsService } from '../../../../../shared/services/selectable-options.service';
import {
  errorsFromSAPtoMessage,
  singlePostResultToUserMessage,
  ToastResult,
} from '../../../../../shared/utils/error-handling';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';
import {
  getReplacementTypeLogic,
  ReplacementTypeLogic,
} from '../internal-material-replacement-logic-helper';

export interface InternalMaterialReplacementModalProps {
  isNewSubstitution: boolean;
  substitution: IMRSubstitution;
  gridApi: GridApi;
}

@Component({
  selector: 'd360-internal-material-replacement-single-substitution-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    ErrorHandlingSelectComponent,
    SingleAutocompletePreLoadedComponent,
    SingleAutocompleteOnTypeComponent,
    SharedTranslocoModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatHint,
    CdkTextareaAutosize,
    FormsModule,
    ReactiveFormsModule,
    DatePickerComponent,
    FilterDropdownComponent,
    LoadingSpinnerModule,
    PushPipe,
  ],
  templateUrl:
    './internal-material-replacement-single-substitution-modal.component.html',
  styleUrl:
    './internal-material-replacement-single-substitution-modal.component.scss',
})
export class InternalMaterialReplacementSingleSubstitutionModalComponent
  implements OnInit
{
  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected data: InternalMaterialReplacementModalProps,
    public dialogRef: MatDialogRef<InternalMaterialReplacementSingleSubstitutionModalComponent>
  ) {}

  protected readonly replacementTypeOptions = replacementTypeValues.map(
    (rt) => ({
      id: rt,
      text: translate(`replacement_type.${rt}`, {}),
    })
  );

  protected readonly imrService = inject(IMRService);
  protected readonly translocoLocaleService = inject(TranslocoLocaleService);
  protected readonly snackbarService = inject(SnackbarService);
  protected readonly selectableOptionsService = inject(
    SelectableOptionsService
  );
  protected readonly destroyRef = inject(DestroyRef);

  protected readonly displayFnText = DisplayFunctions.displayFnText;
  protected readonly displayFnUnited = DisplayFunctions.displayFnUnited;

  protected loading = signal(false);

  protected translationStart = 'internal_material_replacement.column';

  protected cutoverDateCustomErrorMessage = signal<string | null>(null);
  protected startOfProductionCustomErrorMessage = signal<string | null>(null);
  protected replacementDateCustomErrorMessage = signal<string | null>(null);

  protected MAX_DATE = new Date(9999, 12, 31);
  protected TODAY = new Date();

  ngOnInit(): void {
    this.enableAllFields();
    this.setInitialValues();

    if (this.data.isNewSubstitution) {
      this.disableAllFieldsExceptReplacementType();
    } else {
      this.setDisabledFields();
      this.configureRequiredFields();
    }
  }

  setInitialValues() {
    this.formGroup.patchValue(
      {
        // set the defaults
        ...this.data.substitution,
      },
      { emitEvent: false }
    );
  }

  setDisabledFields() {
    const disabledFields = this.getReplacementTypeLogic().deactivatedFields;
    disabledFields.forEach((field) => {
      this.formGroup.get(field).disable();
    });
  }

  getReplacementTypeLogic(): ReplacementTypeLogic {
    const type = this.formGroup.get('replacementType').getRawValue()?.id;

    if (type == null) {
      return {
        replacementType: null,
        mandatoryFields: [],
        deactivatedFields: [],
      };
    }

    return getReplacementTypeLogic(this.data.isNewSubstitution, type);
  }

  resetModal() {
    Object.keys(this.formGroup.controls)
      .filter((key) => key !== 'replacementType')
      .filter((key) => key !== 'region')
      .forEach((key) =>
        this.formGroup.get(key).reset(null, { emitEvent: false })
      );
  }

  protected formGroup = new FormGroup({
    replacementType: new FormControl(null, { validators: Validators.required }),
    region: new FormControl(null),
    salesArea: new FormControl(null),
    salesOrg: new FormControl(null),
    customerNumber: new FormControl(null),
    predecessorMaterial: new FormControl(null),
    successorMaterial: new FormControl(null),
    replacementDate: new FormControl(null, {
      validators: this.data.isNewSubstitution
        ? []
        : this.validateAgainstExistingDate(
            this.data.substitution.replacementDate,
            this.replacementDateCustomErrorMessage
          ),
    }),
    startOfProduction: new FormControl(null, {
      validators: this.data.isNewSubstitution
        ? []
        : this.validateAgainstExistingDate(
            this.data.substitution.startOfProduction,
            this.startOfProductionCustomErrorMessage
          ),
    }),
    cutoverDate: new FormControl(null, {
      validators: this.data.isNewSubstitution
        ? []
        : this.validateAgainstExistingDate(
            this.data.substitution.cutoverDate,
            this.cutoverDateCustomErrorMessage
          ),
    }),
    note: new FormControl(null),
  });

  protected updateForm(event: any): void {
    if (event !== null) {
      this.enableAllFields();
      this.setDisabledFields();
      this.configureRequiredFields();

      if (this.data.isNewSubstitution) {
        this.resetModal();
      }
    }
  }

  @ValidateForm('formGroup')
  protected onSave(): void {
    if (!this.formGroup.valid) {
      this.snackbarService.openSnackBar(
        translate('generic.validation.check_inputs', {})
      );

      return;
    }

    const redefinedSubstitution: IMRSubstitution = {
      // use the initial values
      ...this.data.substitution,

      // overwrite with the form values
      ...this.formGroup.getRawValue(),

      cutoverDate: this.getMomentAsDateOrNull(
        this.formGroup.getRawValue().cutoverDate
      ),
      replacementDate: this.getMomentAsDateOrNull(
        this.formGroup.getRawValue().replacementDate
      ),
      startOfProduction: this.getMomentAsDateOrNull(
        this.formGroup.getRawValue().startOfProduction
      ),
    };

    Object.keys(redefinedSubstitution).forEach((key) => {
      const value = (redefinedSubstitution as any)[key] as SelectableValue;
      if (SelectableValueUtils.isSelectableValue(value)) {
        (redefinedSubstitution as any)[key] = value.id;
      }
    });

    this.loading.set(true);

    this.imrService
      .saveSingleIMRSubstitution(redefinedSubstitution, false)
      .pipe(
        map((postResult) =>
          singlePostResultToUserMessage(
            postResult,
            errorsFromSAPtoMessage,
            translate(
              `customer_material_portfolio.phase_in_out_single_modal.save.success`,
              {}
            )
          )
        ),
        tap((userMessage: ToastResult) => {
          this.snackbarService.openSnackBar(userMessage.message);

          this.loading.set(false);

          if (
            userMessage.variant === 'success' ||
            userMessage.variant === 'warning'
          ) {
            this.handleOnClose(true, redefinedSubstitution);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.data.gridApi.applyServerSideTransaction({
      update: [redefinedSubstitution],
    });
  }

  handleOnClose(reloadData: boolean, redefinedSubstitution: IMRSubstitution) {
    this.resetModal();
    this.dialogRef.close({ reloadData, redefinedSubstitution });
  }

  /**
   * A custom validator to only check the max/min date ranges if the value is different
   * from the prefilled one. We don't want to show an error message if the user didn't change
   * an already valid date while editing an existing (but older) record.
   *
   * @param preFilledValue
   */
  validateAgainstExistingDate(
    preFilledValue: any,
    errorMessage: WritableSignal<string | null>
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = control.value ? moment(control.value) : null;
      const preFilledDate = preFilledValue ? moment(preFilledValue) : null;

      if (errorMessage) {
        errorMessage.set(null);
      }

      if (currentDate == null) {
        return null;
      }

      if (currentDate.isSame(preFilledDate)) {
        return null;
      }

      if (currentDate.isBefore(moment(this.TODAY))) {
        errorMessage.set(
          translate('error.date.beforeMinEditingExistingRecord', {
            existingDate:
              this.translocoLocaleService.localizeDate(preFilledValue),
            earliestPossibleDate: this.translocoLocaleService.localizeDate(
              this.TODAY
            ),
          })
        );

        return { customDatepickerMin: true };
      }

      if (currentDate.isAfter(moment(this.MAX_DATE))) {
        errorMessage.set(
          translate('error.date.afterMaxEditingExistingRecord', {
            existingDate:
              this.translocoLocaleService.localizeDate(preFilledValue),
            latestPossibleDate: this.translocoLocaleService.localizeDate(
              this.MAX_DATE
            ),
          })
        );

        return { customDatepickerMax: true };
      }

      return null;
    };
  }

  private getMomentAsDateOrNull(dateControl: Moment | null) {
    return dateControl ? moment(dateControl).toDate() : null;
  }

  private disableAllFieldsExceptReplacementType() {
    Object.keys(this.formGroup.controls)
      .filter((key) => key !== 'replacementType')
      .forEach((key) => this.formGroup.get(key).disable({ emitEvent: false }));
  }

  private enableAllFields() {
    Object.keys(this.formGroup.controls).forEach((key) =>
      this.formGroup.get(key).enable({ emitEvent: false })
    );
  }

  private configureRequiredFields() {
    const mandatoryFields = this.getReplacementTypeLogic().mandatoryFields;

    Object.keys(this.formGroup.controls).forEach((key) => {
      const control = this.formGroup.get(key);
      this.setOrRemoveRequired(
        mandatoryFields.includes(key as keyof IMRSubstitution),
        control
      );
    });
  }

  private setOrRemoveRequired(
    required: boolean,
    control: AbstractControl
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    required
      ? control?.addValidators(Validators.required)
      : control?.removeValidators(Validators.required);

    control?.updateValueAndValidity({ emitEvent: true });
  }
}
