/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { catchError, EMPTY, Observable, of, switchMap, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { isPast } from 'date-fns';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CMPService } from '../../../../../feature/customer-material-portfolio/cmp.service';
import {
  CMPData,
  DemandPlanAdoption,
  demandPlanAdoptionOptions,
} from '../../../../../feature/customer-material-portfolio/cmp-modal-types';
import { CfcrActionResponse } from '../../../../../feature/customer-material-portfolio/model';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DatePickerComponent } from '../../../../../shared/components/date-picker/date-picker.component';
import {
  SelectableValue,
  SelectableValueUtils,
} from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompleteOnTypeComponent } from '../../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { SingleAutocompletePreLoadedComponent } from '../../../../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { DisplayFunctions } from '../../../../../shared/components/inputs/display-functions.utils';
import { ValidateForm } from '../../../../../shared/decorators';
import { SelectableOptionsService } from '../../../../../shared/services/selectable-options.service';
import {
  errorsFromSAPtoMessage,
  singlePostResultToUserMessage,
} from '../../../../../shared/utils/error-handling';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';
import {
  CMPChangeModalFlavor,
  CMPModal,
  CMPSpecificModal,
} from '../../table/status-actions';

export enum SpecificModalContentType {
  PhaseIn = 'PhaseIn',
  PhaseOut = 'PhaseOut',
  Status = 'Status',
  Substitution = 'Substitution',
  SubstitutionProposal = 'SubstitutionProposal',
  NoContent = 'NoContent',
  Error = 'Error',
}

type FormType = Record<keyof CMPData, FormControl>;

type SpecialSaveTypes = 'veto' | 'change' | 'accept' | null;

/**
 * Component for managing a single customer material entry in the portfolio.
 * Handles various types of changes including phase-in, status change, no content, phase-out, schaeffler substitution, substitution, and substitution proposal.
 *
 * @export
 * @class CustomerMaterialSingleModalComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'd360-customer-material-single-add-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatDialogModule,
    MatButtonModule,
    SingleAutocompleteOnTypeComponent,
    SingleAutocompletePreLoadedComponent,
    MatFormFieldModule,
    MatInputModule,
    DatePickerComponent,
    ReactiveFormsModule,
    LoadingSpinnerModule,
    MatIcon,
    MatRadioModule,
  ],
  templateUrl: './customer-material-single-modal.component.html',
})
export class CustomerMaterialSingleModalComponent implements OnInit {
  /** Service for handling selectable options */
  protected readonly selectableOptionsService: SelectableOptionsService =
    inject(SelectableOptionsService);

  /** Service for handling customer material portfolio actions */
  protected readonly cMPService: CMPService = inject(CMPService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly dialog: MatDialog = inject(MatDialog);

  protected readonly data: {
    data: CMPData | null;
    description: string | null;
    title: string;
    modal: CMPModal;
    type: SpecificModalContentType;
    edit: boolean;
    subtitle?: string;
    successorSchaefflerMaterial?: string;
  } = inject(MAT_DIALOG_DATA);

  private readonly dialogRef: MatDialogRef<CustomerMaterialSingleModalComponent> =
    inject(MatDialogRef<CustomerMaterialSingleModalComponent>);

  protected readonly displayFnText = DisplayFunctions.displayFnText;
  protected readonly displayFnId = DisplayFunctions.displayFnId;
  protected readonly displayFnUnited = DisplayFunctions.displayFnUnited;

  protected types: typeof SpecificModalContentType = SpecificModalContentType;

  protected loading: WritableSignal<boolean> = signal(false);

  protected today: Date = new Date(Date.now());

  protected readonly demandPlanAdoptionOptions = demandPlanAdoptionOptions;
  protected substitutionProposalEdit: WritableSignal<boolean> = signal(false);
  protected hasForm: WritableSignal<boolean> = signal(true);

  private readonly cfcrAction: WritableSignal<CfcrActionResponse | null> =
    signal(null);

  /** Form group to handle the data input and validation of the modal form */
  protected formGroup: FormGroup<FormType> = new FormGroup<FormType>({
    // CMPBaseData
    customerNumber: new FormControl(null, Validators.required),
    materialNumber: new FormControl<SelectableValue | string>(
      null,
      Validators.required
    ),
    materialDescription: new FormControl(null),
    demandCharacteristic: new FormControl(null, Validators.required),

    // CMPStatusSpecificChangeData
    autoSwitchDate: new FormControl(null), // PhaseIn
    repDate: new FormControl(null),
    portfolioStatus: new FormControl(null),
    successorMaterial: new FormControl(null),
    demandPlanAdoption: new FormControl(null),
  });

  /**
   * Creates an instance of CustomerMaterialSingleModalComponent.
   *
   * @memberof CustomerMaterialSingleModalComponent
   */
  public constructor() {
    effect(() => {
      if (this.substitutionProposalEdit()) {
        this.formGroup.get('successorMaterial').enable();
      }
    });
  }

  /** @inheritdoc */
  public ngOnInit(): void {
    if (this.data.data) {
      this.formGroup.setValue(this.data.data);
    }

    if (this.data.modal === CMPSpecificModal.SCHAEFFLER_SUBSTITUTION) {
      this.setConfirmation();
    } else {
      this.setFormGroup();
    }
  }

  /**
   * Sets the confirmation text for the modal when changing to a Schaeffler substitution.
   *
   * @private
   * @memberof CustomerMaterialSingleModalComponent
   */
  private setConfirmation(): void {
    this.hasForm.set(false);

    this.data.description = translate(
      'customer.material_portfolio.modal.change_to_schaeffler.text',
      {
        sucessor:
          this.data.data?.successorMaterial ?? translate('error.valueUnknown'),
        schaefflerSuccessor:
          this.data?.successorSchaefflerMaterial ??
          translate('error.valueUnknown'),
      }
    );
  }

  /**
   * Configures the form group based on the type of change being made.
   * Disables or enables certain fields and adds required validators as necessary.
   *
   * @private
   * @memberof CustomerMaterialSingleModalComponent
   */
  private setFormGroup(): void {
    const fieldsToDeactivate: string[] = ['customerNumber'];
    const requiredFields: string[] = [];

    switch (this.data.type) {
      case SpecificModalContentType.PhaseIn: {
        requiredFields.push('autoSwitchDate');

        if (this.data.edit) {
          fieldsToDeactivate.push('materialNumber');
        }

        break;
      }

      case SpecificModalContentType.Status: {
        fieldsToDeactivate.push('autoSwitchDate', 'materialNumber');
        break;
      }

      case SpecificModalContentType.NoContent: {
        fieldsToDeactivate.push('materialNumber');
        break;
      }

      case SpecificModalContentType.PhaseOut: {
        requiredFields.push('autoSwitchDate');
        fieldsToDeactivate.push('materialNumber');

        break;
      }

      case SpecificModalContentType.Substitution: {
        requiredFields.push(
          'repDate',
          'successorMaterial',
          'demandPlanAdoption'
        );
        fieldsToDeactivate.push('materialNumber');
        this.onSuccessorChange();
        break;
      }

      case SpecificModalContentType.SubstitutionProposal: {
        requiredFields.push('repDate', 'successorMaterial', 'materialNumber');
        fieldsToDeactivate.push(
          'repDate',
          'successorMaterial',
          'materialNumber'
        );
        this.onSuccessorChange();
        break;
      }

      case SpecificModalContentType.Error: {
        requiredFields.push('materialNumber');
        fieldsToDeactivate.push('materialNumber');
        break;
      }

      default: {
        break;
      }
    }

    this.deactivateFields(fieldsToDeactivate);
    this.addRequired(requiredFields);
  }

  /**
   * Returns the translation key for a demand plan adoption option.
   *
   * @protected
   * @param {DemandPlanAdoption} option - The demand plan adoption option to retrieve the translation key for.
   * @return The translation key for the provided option.
   * @memberof CustomerMaterialSingleModalComponent
   */
  protected getTranslationKey(option: DemandPlanAdoption) {
    return `customer.material_portfolio.modal.substitution.transfere_forecast.${option.toLowerCase()}`.trim();
  }

  /**
   * Handles changes to the successor material field and fetches forecast action data if a successor is selected.
   *
   * @protected
   * @return {void}
   * @memberof CustomerMaterialSingleModalComponent
   */
  protected onSuccessorChange(): void {
    const reset = () => {
      this.cfcrAction.set(null);
      this.loading.set(false);
      this.formGroup.get('demandPlanAdoption').setValue(null);
    };

    this.loading.set(true);

    if (!this.formGroup.get('successorMaterial').value) {
      reset();

      return;
    }

    this.cMPService
      .getForecastActionData(this.getRequestData())
      .pipe(
        take(1),
        tap((data: CfcrActionResponse) => {
          if (
            !(
              data?.cfcrActions &&
              Array.isArray(data?.cfcrActions) &&
              data?.cfcrActions?.[0]
            )
          ) {
            reset();

            return;
          }

          this.cfcrAction.set(data);
          this.loading.set(false);

          this.formGroup
            .get('demandPlanAdoption')
            .setValue(
              this.cfcrAction()?.cfcrActions?.find((action) => action.selected)
                ?.cfcrAction ?? null
            );
        }),
        catchError(() => {
          reset();

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Determines whether a demand plan adoption radio button should be disabled based on previously fetched forecast action data.
   *
   * @protected
   * @param {DemandPlanAdoption} option - The demand plan adoption option to check the disabled state for.
   * @return {boolean} True if the option should be disabled, false otherwise.
   * @memberof CustomerMaterialSingleModalComponent
   */
  protected isRadioDisabled(option: DemandPlanAdoption): boolean {
    const isIncluded: () => boolean = () =>
      this.cfcrAction()?.cfcrActions?.filter(
        (action) => action.cfcrAction === option
      )?.length > 0;

    return !this.cfcrAction() || !isIncluded();
  }

  /**
   * Returns the translation key for the save button based on the current data and whether an edit is being made.
   *
   * @protected
   * @return {string} The translation key for the save button.
   * @memberof CustomerMaterialSingleModalComponent
   */
  protected getSaveButton(): string {
    if (this.data.type === SpecificModalContentType.SubstitutionProposal) {
      return this.substitutionProposalEdit()
        ? 'button.change'
        : 'customer_material_portfolio.modal.accept';
    }

    return this.data.edit
      ? 'button.save'
      : 'customer_material_portfolio.modal.add';
  }

  /**
   * Handles saving changes to a customer material entry in the portfolio.
   * Validates the form and calls the appropriate service method based on the type of change being made.
   *
   * @protected
   * @param {SpecialSaveTypes} specialType - A special type of save operation to perform, if necessary.
   * @return {void}
   * @memberof CustomerMaterialSingleModalComponent
   */
  @ValidateForm('formGroup')
  protected onSave(specialType: SpecialSaveTypes): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.save$(specialType).subscribe();
  }

  /**
   * Closes the modal without saving changes.
   *
   * @protected
   * @memberof CustomerMaterialSingleModalComponent
   */
  protected onClose(): void {
    this.dialogRef.close(false);
  }

  /**
   * Determines whether to show an edit button for a substitution proposal based on the current data and whether an edit is being made.
   *
   * @protected
   * @return {boolean} True if the edit button should be visible, false otherwise.
   * @memberof CustomerMaterialSingleModalComponent
   */
  protected editButtonVisible(): boolean {
    return (
      this.data.type === SpecificModalContentType.SubstitutionProposal &&
      !this.substitutionProposalEdit() &&
      !isPast(this.formGroup.get('repDate').value)
    );
  }

  /**
   * Disables certain fields in the form group based on a provided list of field names.
   *
   * @private
   * @param {string[]} fields - The list of field names to disable.
   * @memberof CustomerMaterialSingleModalComponent
   */
  private deactivateFields(fields: string[]): void {
    fields.forEach((field) => this.formGroup.get(field).disable());
  }

  /**
   * Adds required validators to certain fields in the form group based on a provided list of field names.
   *
   * @private
   * @param {string[]} fields - The list of field names to add required validators to.
   * @memberof CustomerMaterialSingleModalComponent
   */
  private addRequired(fields: string[]): void {
    fields.forEach((field) =>
      this.formGroup.get(field).addValidators(Validators.required)
    );
  }

  /**
   * Returns the appropriate action URL for saving changes based on the type of change being made and any special types specified.
   *
   * @private
   * @param {SpecialSaveTypes} specialType - A special type of save operation to retrieve the action URL for, if necessary.
   * @return {(string | null)} The appropriate action URL for saving changes.
   * @memberof CustomerMaterialSingleModalComponent
   */
  private getActionURL(specialType: SpecialSaveTypes): string | null {
    switch (specialType) {
      case 'veto': {
        return 'veto-substitution';
      }

      case 'accept': {
        return 'accept-substitution';
      }

      case 'change': {
        return 'single-substitution';
      }

      default: {
        break;
      }
    }

    switch (this.data.modal) {
      case CMPChangeModalFlavor.EDIT_MODAL: {
        return 'update';
      }

      case CMPChangeModalFlavor.STATUS_TO_PHASE_OUT: {
        return 'single-phase-out';
      }

      case CMPChangeModalFlavor.STATUS_TO_PHASE_IN: {
        return 'single-phase-in';
      }

      case CMPChangeModalFlavor.STATUS_TO_SUBSTITUTION: {
        return 'single-substitution';
      }

      case CMPChangeModalFlavor.STATUS_TO_INACTIVE: {
        return 'single-inactivation';
      }

      case CMPChangeModalFlavor.STATUS_TO_ACTIVE:
      case CMPChangeModalFlavor.REVERT_SUBSTITUTION: {
        return 'single-reactivation';
      }

      case CMPSpecificModal.SCHAEFFLER_SUBSTITUTION: {
        return 'change-to-schaeffler';
      }

      default: {
        return null;
      }
    }
  }

  /**
   * Constructs and returns a request data object based on the current form group values and any provided data.
   *
   * @private
   * @return {CMPData} The constructed request data object.
   * @memberof CustomerMaterialSingleModalComponent
   */
  private getRequestData(): CMPData {
    const requestData: CMPData = {
      ...this.data.data,
      ...this.formGroup.getRawValue(),
    };

    if (this.data.modal === CMPSpecificModal.SCHAEFFLER_SUBSTITUTION) {
      requestData.portfolioStatus = 'SI';
      requestData.successorMaterial = this.data.successorSchaefflerMaterial;
    }

    Object.keys(requestData).forEach((key) => {
      const value = (requestData as any)[key] as SelectableValue;
      if (SelectableValueUtils.isSelectableValue(value)) {
        (requestData as any)[key] = value.id;
      } else if (value === '') {
        (requestData as any)[key] = null;
      }
    });

    return requestData;
  }

  /**
   * Handles saving changes to a customer material entry in the portfolio by calling the appropriate service method based on the type of change being made and any special types specified.
   * Returns an observable that emits when the save operation is complete, with the result from the service method.
   *
   * @private
   * @param {SpecialSaveTypes} specialType - A special type of save operation to perform, if necessary.
   * @param {boolean} [confirmed] - Whether or not the user has confirmed a warning message displayed during the save operation.
   * @return {Observable<any>} An observable that emits when the save operation is complete.
   * @memberof CustomerMaterialSingleModalComponent
   */
  private save$(
    specialType: SpecialSaveTypes,
    confirmed?: boolean
  ): Observable<any> {
    this.loading.set(true);

    const requestData: CMPData = this.getRequestData();

    return this.cMPService
      .saveCMPChange(
        requestData,
        false,
        this.getActionURL(specialType),
        confirmed
      )
      .pipe(
        switchMap((result) => {
          // If the requested successor is not already in the portfolio of this customer,
          // the user has to confirm adding it. After confirmation, the request can run again with the confirmed param set.
          if (
            (requestData.portfolioStatus === 'SE' ||
              this.data.modal === CMPSpecificModal.SUBSTITUTION_PROPOSAL) &&
            result.overallStatus === 'WARNING' &&
            result.overallErrorMsg ===
              translate(
                'customer.material_portfolio.modal.substitution.warning.add_material'
              )
          ) {
            this.loading.set(false);

            return this.dialog
              .open(ConfirmationDialogComponent, {
                data: { description: result.overallErrorMsg },
                disableClose: true,
                width: '600px',
              })
              .afterClosed()
              .pipe(
                take(1),
                switchMap((wasConfirmed: boolean) =>
                  this.save$(specialType, wasConfirmed)
                ),
                takeUntilDestroyed(this.destroyRef)
              );
          }

          return of(result);
        }),
        tap((result) => {
          const userMessage = singlePostResultToUserMessage(
            result,
            errorsFromSAPtoMessage,
            translate(
              this.data.edit
                ? // General save message
                  'generic.validation.save.success'
                : // Create new save message
                  `customer_material_portfolio.phase_in_out_single_modal.save.success`
            )
          );

          this.snackbarService.openSnackBar(userMessage.message);
          this.loading.set(false);

          if (['success', 'warning'].includes(userMessage.variant)) {
            this.dialogRef.close(true);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      );
  }
}
