/* eslint-disable max-lines */
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
import { PushPipe } from '@ngrx/component';
import { GridApi } from 'ag-grid-enterprise';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { IMRService } from '../../../../../feature/internal-material-replacement/imr.service';
import {
  IMRSubstitution,
  replacementTypeValues,
} from '../../../../../feature/internal-material-replacement/model';
import { DatePickerComponent } from '../../../../../shared/components/date-picker/date-picker.component';
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
import { getDateOrNull } from '../../../../../shared/utils/date-format';
import {
  errorsFromSAPtoMessage,
  singlePostResultToUserMessage,
  ToastResult,
} from '../../../../../shared/utils/error-handling';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';
import { IMRValidatorsService } from '../../../services/imr-validators.service';
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
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
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
  protected readonly replacementTypeOptions = replacementTypeValues.map(
    (replacementType) => ({
      id: replacementType,
      text: translate(`replacement_type.${replacementType}`),
    })
  );

  private readonly dialogRef = inject(
    MatDialogRef<InternalMaterialReplacementSingleSubstitutionModalComponent>
  );
  protected readonly data: InternalMaterialReplacementModalProps =
    inject(MAT_DIALOG_DATA);
  protected readonly iMRService = inject(IMRService);
  protected readonly iMRValidatorsService = inject(IMRValidatorsService);
  protected readonly snackbarService = inject(SnackbarService);
  protected readonly selectableOptionsService = inject(
    SelectableOptionsService
  );
  protected readonly destroyRef = inject(DestroyRef);

  protected readonly DisplayFunctions = DisplayFunctions;

  protected loading = signal(false);

  protected translationStart = 'internal_material_replacement.column';
  protected cutoverDateCustomErrorMessage = signal<string | null>(null);
  protected startOfProductionCustomErrorMessage = signal<string | null>(null);
  protected replacementDateCustomErrorMessage = signal<string | null>(null);
  protected materialCustomErrorMessage = signal<string | null>(null);

  protected predecessorMaterialControl = new FormControl(null, {
    validators: this.iMRValidatorsService.keepMaterialOnPackagingChange(
      'successorMaterial',
      this.materialCustomErrorMessage
    ),
  });
  protected successorMaterialControl = new FormControl(null, {
    validators: this.iMRValidatorsService.keepMaterialOnPackagingChange(
      'predecessorMaterial',
      this.materialCustomErrorMessage
    ),
  });
  protected formGroup = new FormGroup(
    {
      replacementType: new FormControl(null, {
        validators: Validators.required,
      }),
      region: new FormControl(null),
      salesArea: new FormControl(null),
      salesOrg: new FormControl(null),
      customerNumber: new FormControl(null),
      predecessorMaterial: this.predecessorMaterialControl,
      successorMaterial: this.successorMaterialControl,
      replacementDate: new FormControl(null, {
        validators: this.data.isNewSubstitution
          ? []
          : this.iMRValidatorsService.validateAgainstExistingDate(
              this.data.substitution.replacementDate,
              this.replacementDateCustomErrorMessage
            ),
      }),
      startOfProduction: new FormControl(null, {
        validators: this.data.isNewSubstitution
          ? []
          : this.iMRValidatorsService.validateAgainstExistingDate(
              this.data.substitution.startOfProduction,
              this.startOfProductionCustomErrorMessage
            ),
      }),
      cutoverDate: new FormControl(null, {
        validators: this.data.isNewSubstitution
          ? []
          : this.iMRValidatorsService.validateAgainstExistingDate(
              this.data.substitution.cutoverDate,
              this.cutoverDateCustomErrorMessage
            ),
      }),
      note: new FormControl(null),
    },
    {
      validators: [
        this.iMRValidatorsService.cutoverDateBeforeSOP(
          this.startOfProductionCustomErrorMessage
        ),
        this.iMRValidatorsService.replacementBeforeCutoverDate(
          this.replacementDateCustomErrorMessage
        ),
      ],
      updateOn: 'change',
    }
  );

  public ngOnInit(): void {
    this.predecessorMaterialControl.valueChanges
      .pipe(
        tap(() =>
          this.successorMaterialControl.updateValueAndValidity({
            emitEvent: false,
          })
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.successorMaterialControl.valueChanges
      .pipe(
        tap(() =>
          this.predecessorMaterialControl.updateValueAndValidity({
            emitEvent: false,
          })
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.enableAllFields();
    this.setInitialValues();

    if (this.data.isNewSubstitution) {
      this.disableAllFieldsExceptReplacementType();
    } else {
      this.setDisabledFields();
      this.configureRequiredFields();
    }
  }

  private setInitialValues() {
    this.formGroup.patchValue(
      {
        // set the defaults
        ...this.data.substitution,
      },
      { emitEvent: false }
    );
  }

  private setDisabledFields() {
    const disabledFields = this.getReplacementTypeLogic().deactivatedFields;
    disabledFields.forEach((field) => {
      this.formGroup.get(field).disable();
    });
  }

  private getReplacementTypeLogic(): ReplacementTypeLogic {
    const type = this.formGroup.get('replacementType').getRawValue()?.id;

    if (type === null) {
      return {
        replacementType: null,
        mandatoryFields: [],
        deactivatedFields: [],
      };
    }

    return getReplacementTypeLogic(this.data.isNewSubstitution, type);
  }

  private resetModal() {
    Object.keys(this.formGroup.controls)
      .filter((key) => key !== 'replacementType')
      .filter((key) => key !== 'region')
      .forEach((key) =>
        this.formGroup.get(key).reset(null, { emitEvent: false })
      );
  }

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
      this.snackbarService.error(translate('generic.validation.check_inputs'));

      return;
    }

    const redefinedSubstitution: IMRSubstitution = {
      // use the initial values
      ...this.data.substitution,

      // overwrite with the form values
      ...this.formGroup.getRawValue(),

      cutoverDate: getDateOrNull(this.formGroup.getRawValue().cutoverDate),
      replacementDate: getDateOrNull(
        this.formGroup.getRawValue().replacementDate
      ),
      startOfProduction: getDateOrNull(
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

    this.iMRService
      .saveSingleIMRSubstitution(redefinedSubstitution, false)
      .pipe(
        map((postResult) =>
          singlePostResultToUserMessage(
            postResult,
            errorsFromSAPtoMessage,
            translate(
              'customer_material_portfolio.phase_in_out_single_modal.save.success'
            )
          )
        ),
        tap((userMessage: ToastResult) => {
          this.snackbarService.show(
            userMessage.message,
            undefined,
            undefined,
            userMessage.variant as any
          );

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

  protected handleOnClose(
    reloadData: boolean,
    redefinedSubstitution: IMRSubstitution
  ) {
    this.resetModal();
    this.dialogRef.close({ reloadData, redefinedSubstitution });
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
      this.iMRValidatorsService.setOrRemoveRequired(
        mandatoryFields.includes(key as keyof IMRSubstitution),
        control
      );
    });
  }
}
