/* eslint-disable max-lines */
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  Component,
  DestroyRef,
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
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { combineLatest, map, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { GridApi } from 'ag-grid-community';
import moment from 'moment';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AlertRulesService } from '../../../../../../feature/alert-rules/alert-rules.service';
import {
  AlertRule,
  AlertTypeDescription,
  ExecDay,
  ExecInterval,
} from '../../../../../../feature/alert-rules/model';
import { CurrencyService } from '../../../../../../feature/info/currency.service';
import { DatePickerComponent } from '../../../../../../shared/components/date-picker/date-picker.component';
import { SingleAutocompleteSelectedEvent } from '../../../../../../shared/components/inputs/autocomplete/model';
import {
  SelectableValue,
  SelectableValueUtils,
} from '../../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompleteOnTypeComponent } from '../../../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { SingleAutocompletePreLoadedComponent } from '../../../../../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { FilterDropdownComponent } from '../../../../../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { StyledGridSectionComponent } from '../../../../../../shared/components/styled-grid-section/styled-grid-section.component';
import { NumberSeparatorDirective } from '../../../../../../shared/directives';
import {
  OptionsLoadingResult,
  OptionsTypes,
  SelectableOptionsService,
} from '../../../../../../shared/services/selectable-options.service';
import { SnackbarService } from '../../../../../../shared/utils/service/snackbar.service';
import { ValidationHelper } from '../../../../../../shared/utils/validation/validation-helper';
import { DisplayFunctions } from './../../../../../../shared/components/inputs/display-functions.utils';
import { ValidateForm } from './../../../../../../shared/decorators';
import {
  errorsFromSAPtoMessage,
  singlePostResultToUserMessage,
  ToastResult,
} from './../../../../../../shared/utils/error-handling';
import {
  possibleWhenOptions,
  thresholdTypeWithParameter,
} from './alert-rule-options-config';

export type AlertRuleModalTitle = 'create' | 'edit';

// TODO check if all the props are necessary or if they can be simplified
export interface AlertRuleModalProps {
  open: boolean;
  gridApi: GridApi;
  alertRule: AlertRule;
  title: AlertRuleModalTitle;
}

/**
 * The AlertRuleEditSingleModal Component.
 *
 * @export
 * @class AlertRuleEditSingleModalComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-alert-rule-edit-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatGridListModule,
    StyledGridSectionComponent,
    LoadingSpinnerModule,
    SingleAutocompletePreLoadedComponent,
    SharedTranslocoModule,
    FilterDropdownComponent,
    SingleAutocompleteOnTypeComponent,
    PushPipe,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    CdkTextareaAutosize,
    DatePickerComponent,
    NumberSeparatorDirective,
    MatIcon,
  ],
  templateUrl: './alert-rule-edit-single-modal.component.html',
  styleUrl: './alert-rule-edit-single-modal.component.scss',
})
export class AlertRuleEditSingleModalComponent implements OnInit {
  /**
   * The CurrencyService instance.
   *
   * @private
   * @type {CurrencyService}
   * @memberof AlertRuleEditSingleModalComponent
   */
  private readonly currencyService: CurrencyService = inject(CurrencyService);

  /**
   * The AlertRulesService instance
   *
   * @private
   * @type {AlertRulesService}
   * @memberof AlertRuleEditSingleModalComponent
   */
  private readonly alertRuleService: AlertRulesService =
    inject(AlertRulesService);

  /**
   * The MatDialogRef instance
   *
   * @private
   * @type {MatDialogRef<AlertRuleEditSingleModalComponent>}
   * @memberof AlertRuleEditSingleModalComponent
   */
  private readonly dialogRef: MatDialogRef<AlertRuleEditSingleModalComponent> =
    inject(MatDialogRef);

  /**
   * The SnackbarService instance
   *
   * @private
   * @type {SnackbarService}
   * @memberof AlertRuleEditSingleModalComponent
   */
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  /**
   * A shortener for the translation for missingFields
   *
   * @protected
   * @type {string}
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected missingFields: string = translate(
    'generic.validation.missing_fields'
  );

  /**
   * A shortener for the translation strings for edit_modal.labels
   *
   *
   * @protected
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected translationStart = 'alert_rules.edit_modal.label';

  /**
   * The DestroyRef instance used for takeUntilDestroyed().
   *
   * @private
   * @type {DestroyRef}
   * @memberof AlertRuleEditSingleModalComponent
   */
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * For these fields, only one needs to be set in the form.
   *
   * @private
   * @type {string[]}
   * @memberof AlertRuleEditSingleModalComponent
   */
  private readonly conditionalRequired: string[] = [
    'salesArea',
    'salesOrg',
    'customerNumber',
    'sectorManagement',
    'demandPlannerId',
    'gkamNumber',
  ];

  /**
   * The SelectableOptionsService instance.
   *
   * @type {SelectableOptionsService}
   * @memberof AlertRuleEditSingleModalComponent
   */
  public readonly selectableOptionsService: SelectableOptionsService = inject(
    SelectableOptionsService
  );

  /**
   * The data passed via MatDialog
   *
   * @type {AlertRuleModalProps}
   * @memberof AlertRuleEditSingleModalComponent
   */
  public readonly data: AlertRuleModalProps = inject(MAT_DIALOG_DATA);

  /**
   * The available execIntervalOptions
   *
   * @protected
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected readonly execIntervalOptions =
    this.selectableOptionsService.get('interval');

  /**
   * A helper function to render the options in the HTML
   *
   * @protected
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected readonly displayFnText = DisplayFunctions.displayFnText;

  /**
   * A loading indicator
   *
   * @type {WritableSignal<boolean>}
   * @memberof AlertRuleEditSingleModalComponent
   */
  public loading: WritableSignal<boolean> = signal(false);

  /**
   * The current alert type data.
   *
   * @private
   * @type {AlertTypeDescription[]}
   * @memberof AlertRuleEditSingleModalComponent
   */
  private alertTypeData: AlertTypeDescription[] = [];

  /**
   * The exec day options getting rendered
   *
   * @protected
   * @type {ExecDay[]}
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected execDayOptions: ExecDay[] = [];

  /**
   * The title used in the dialog
   *
   * @protected
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected title = `alert_rules.edit_modal.title.${this.data.title as AlertRuleModalTitle}`;

  /**
   * The materialClassificationOptions getting rendered
   *
   * Hint:
   * Mit der Regel stellt der Demand Planner ein Todo für die Sales Kollegen zur Validierung des Forecasts ein, das passiert in Demand360 nur auf SP Materialien (prio 1) und mit niedrigere Prio auch für AP Materialien
   * Daher werden nur AP und SP als Auswahlmöglichkeit angegeben
   *
   * @protected
   * @type {SelectableValue[]}
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected materialClassificationOptions: SelectableValue[] = [
    { id: 'AP', text: 'AP' },
    { id: 'SP', text: 'SP' },
  ];
  /**
   * The alertTypeDescription for the current selected alertType.
   *
   * @protected
   * @type {(AlertTypeDescription | null)}
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected alertTypeDescription: AlertTypeDescription | null = null;

  /**
   * The current used currency.
   * Hint: not changeable right now.
   *
   * @private
   * @type {string}
   * @memberof AlertRuleEditSingleModalComponent
   */
  private currentCurrency: string;

  /**
   * The FormGroup
   *
   * @type {FormGroup}
   * @memberof AlertRuleEditSingleModalComponent
   */
  public readonly formGroup: FormGroup = new FormGroup(
    {
      alertComment: new FormControl(null),
      customerNumber: new FormControl(null, Validators.required), // @see this.conditionalRequired
      demandPlannerId: new FormControl(null, Validators.required), // @see this.conditionalRequired
      endDate: new FormControl(null, Validators.required),
      execInterval: new FormControl(null, Validators.required),
      execDay: new FormControl(null, Validators.required),
      gkamNumber: new FormControl(null, Validators.required), // @see this.conditionalRequired
      materialClassification: new FormControl(null),
      materialNumber: new FormControl(null),
      productionLine: new FormControl(null),
      productLine: new FormControl(null),
      region: new FormControl(null, Validators.required),
      salesArea: new FormControl(null, Validators.required), // @see this.conditionalRequired
      salesOrg: new FormControl(null, Validators.required), // @see this.conditionalRequired
      sectorManagement: new FormControl(null, Validators.required), // @see this.conditionalRequired
      startDate: new FormControl(null, Validators.required),
      threshold1: new FormControl(null),
      threshold2: new FormControl(null),
      threshold3: new FormControl(null),
      type: new FormControl(null, Validators.required),

      // not visible in form
      currency: new FormControl(null, Validators.required),
    },
    { validators: this.crossFieldValidator() }
  );

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.init();
  }

  /**
   * The init function to load the missing data.
   *
   * @private
   * @memberof AlertRuleEditSingleModalComponent
   */
  private init(): void {
    this.loading.set(true);

    combineLatest([
      this.alertRuleService.getRuleTypeData(),
      this.currencyService.getCurrentCurrency(),
    ])
      .pipe(
        // set results
        tap(([alertTypeData, currency]: [AlertTypeDescription[], string]) => {
          this.alertTypeData = alertTypeData;
          this.currentCurrency = currency;
        }),

        // set / init the rest afterwards
        tap(() => {
          // needs to run first
          this.setInitialValues();

          // set/update the exec days options
          this.setExecDays();

          // show/hide Thresholds
          this.updateThresholds();

          // set the required fields
          this.setIsAtLeastOneRequireStatus();
        }),

        // reset loading state
        tap(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Set the initial values.
   *
   * @private
   * @memberof AlertRuleEditSingleModalComponent
   */
  private setInitialValues(): void {
    this.formGroup.patchValue(
      {
        // set the defaults
        ...this.data.alertRule,

        // unused as visible form field
        currency: this.data.alertRule.currency || this.currentCurrency,
      },
      { emitEvent: false }
    );
  }

  /**
   * Returns the selectable options by key
   *
   * @protected
   * @param {keyof OptionsTypes} key
   * @return {OptionsLoadingResult}
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected getOptions(key: keyof OptionsTypes): OptionsLoadingResult {
    return this.selectableOptionsService.get(key);
  }

  /**
   * The callback used by all form fields to perform additional steps, like updating the required fields.
   *
   * @protected
   * @param {SingleAutocompleteSelectedEvent} { option: { id } }
   * @param {keyof AlertRule} key
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected updateForm(
    { option: { id } }: SingleAutocompleteSelectedEvent,
    key: keyof AlertRule
  ): void {
    // update the required fields
    if (this.conditionalRequired.includes(key)) {
      this.setIsAtLeastOneRequireStatus();
    }

    // update thresholds
    if (key === 'type') {
      this.applyRuleTypeChange({ id, text: '' });
      this.updateThresholds();
    }
  }

  /**
   * Add or remove the required validator, based on other input fields
   *
   * @private
   * @memberof AlertRuleEditSingleModalComponent
   */
  private setIsAtLeastOneRequireStatus(): void {
    // eslint-disable-next-line unicorn/no-array-reduce
    const isOptional: boolean = this.conditionalRequired.reduce(
      (previousValue: boolean, key: string) =>
        previousValue || !!this.formGroup.get(key)?.value,
      false
    );

    // update / set all required fields
    this.conditionalRequired.forEach((key: string) =>
      this.setOrRemoveRequired(!isOptional, this.formGroup.get(key))
    );
  }

  /**
   * A helper to set or remove the required validator. Used to avoid boilerplate code.
   *
   * @private
   * @param {boolean} required
   * @param {AbstractControl} control
   * @memberof AlertRuleEditSingleModalComponent
   */
  private setOrRemoveRequired(
    required: boolean,
    control: AbstractControl
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    required
      ? control?.setValidators(Validators.required)
      : control?.removeValidators(Validators.required);

    control?.updateValueAndValidity({ emitEvent: true });
  }

  /**
   * A helper to avoid boilerplate code in the HTML.
   *
   * @protected
   * @param {(1 | 2 | 3)} number
   * @return {string}
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected getThresholdDescription(number: 1 | 2 | 3): string {
    return this.alertTypeDescription?.[`threshold${number}Description`] ?? '';
  }

  /**
   * Update the threshold data
   *
   * @private
   * @memberof AlertRuleEditSingleModalComponent
   */
  private updateThresholds(): void {
    const data: AlertTypeDescription | undefined = this.alertTypeData.find(
      (typeData) => {
        const value: SelectableValue | null =
          SelectableValueUtils.toSelectableValueOrNull(
            this.formGroup.get('type')?.value,
            false
          ) as SelectableValue | null;

        return typeData.alertType === value?.id;
      }
    );

    const isRequired = (type: string) =>
      thresholdTypeWithParameter.includes(type || '');

    const check: boolean = data && isRequired(data?.threshold1Type);
    const required1: boolean = check ? isRequired(data.threshold1Type) : false;
    const required2: boolean = check ? isRequired(data.threshold2Type) : false;
    const required3: boolean = check ? isRequired(data.threshold3Type) : false;

    this.alertTypeDescription = check ? data : null;

    this.setOrRemoveRequired(required1, this.formGroup.get('threshold1'));
    this.setOrRemoveRequired(required2, this.formGroup.get('threshold2'));
    this.setOrRemoveRequired(required3, this.formGroup.get('threshold3'));

    /* eslint-disable @typescript-eslint/no-unused-expressions */
    !required1 && this.formGroup.get('threshold1').reset(null);
    !required2 && this.formGroup.get('threshold2').reset(null);
    !required3 && this.formGroup.get('threshold3').reset(null);
  }

  /**
   * Set the ExecDays options, based on the execInterval value
   *
   * @private
   * @memberof AlertRuleEditSingleModalComponent
   */
  private setExecDays(): void {
    const execInterval: ExecInterval | null =
      this.formGroup.get('execInterval')?.value?.id ?? null;

    this.execDayOptions = possibleWhenOptions?.[execInterval] || [];
  }

  /**
   * On execInterval changes, we can set default values for execDay
   *
   * @protected
   * @param {(SelectableValue | null)} value
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected onIntervalSelectionChange(value: SelectableValue | null): void {
    // cast to use the correct type
    const execInterval: ExecInterval = value?.id as ExecInterval;
    // update ExecDays first
    this.setExecDays();

    let execDay: 'M01' | 'M15' | 'W6' | 'D' | null = null;
    const currentExecDay = this.formGroup.get('execDay')?.value;

    switch (execInterval) {
      case 'M1':
      case 'M2':
      case 'M3':
      case 'M6': {
        execDay =
          !currentExecDay ||
          !possibleWhenOptions[execInterval as ExecInterval].includes(
            currentExecDay
          )
            ? 'M01'
            : currentExecDay ?? null;
        break;
      }

      case 'D1':
      case 'W1': {
        execDay = execInterval === 'W1' ? 'W6' : 'D';
        break;
      }

      default: {
        break;
      }
    }

    // Update the form control
    this.formGroup.get('execDay')?.patchValue(execDay);
  }

  /**
   * The form cross field validator to check the dates.
   *
   * @private
   * @return {ValidatorFn}
   * @memberof AlertRuleEditSingleModalComponent
   */
  private crossFieldValidator(): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const errors: { [key: string]: string[] } = {};

      // start- / endDate
      const startDate = formGroup.get('startDate')?.value;
      const endDate = formGroup.get('endDate')?.value;
      if (startDate && endDate && startDate > endDate) {
        errors.endDate = ['end-before-start'];
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  /**
   * Reset the thresholds, if we have a change in the alert rules.
   *
   * @private
   * @param {(SelectableValue | null)} value
   * @memberof AlertRuleEditSingleModalComponent
   */
  private applyRuleTypeChange(value: SelectableValue | null): void {
    if (this.formGroup.get('type')?.value !== value?.id) {
      this.formGroup.get('threshold1').reset(null);
      this.formGroup.get('threshold2').reset(null);
      this.formGroup.get('threshold3').reset(null);
    }
  }

  /**
   * Save the form.
   *
   * @protected
   * @return {void}
   * @memberof AlertRuleEditSingleModalComponent
   */
  @ValidateForm('formGroup')
  protected onSave(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.loading.set(true);

    const refinedAlertRule: AlertRule = {
      // use the initial values
      ...this.data.alertRule,

      // overwrite with the form values
      ...this.formGroup.getRawValue(),

      // saveMultiAlertRules expects a local date, so we need to convert here
      // This is because of the clipboard functionality of the multi modal. (Copy/Paste from Excel)
      startDate: ValidationHelper.localeService.localizeDate(
        moment(this.formGroup.getRawValue().startDate).format('YYYY-MM-DD')
      ),
      // saveMultiAlertRules expects a local date, so we need to convert here
      // This is because of the clipboard functionality of the multi modal. (Copy/Paste from Excel)
      endDate: ValidationHelper.localeService.localizeDate(
        moment(this.formGroup.getRawValue().endDate).format('YYYY-MM-DD')
      ),
    };

    Object.keys(refinedAlertRule).forEach((key) => {
      const value = (refinedAlertRule as any)[key] as SelectableValue;
      if (SelectableValueUtils.isSelectableValue(value)) {
        (refinedAlertRule as any)[key] = value.id;
      }
    });

    this.alertRuleService
      .saveMultiAlertRules([refinedAlertRule])
      .pipe(
        // Map result to ToastResult
        map((postResult) =>
          singlePostResultToUserMessage(
            postResult,
            errorsFromSAPtoMessage,
            translate('alert_rules.edit_modal.success.alert_rule_created', {})
          )
        ),

        tap((userMessage: ToastResult) => {
          // show SnackBar
          this.snackbarService.openSnackBar(userMessage.message);

          if (userMessage.variant === 'error') {
            this.loading.set(false);

            return;
          }

          // stop loader
          this.handleOnClose(true);
        }),

        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Close the open dialogs
   *
   * @protected
   * @param {boolean} reloadData
   * @memberof AlertRuleEditSingleModalComponent
   */
  protected handleOnClose(reloadData: boolean): void {
    this.dialogRef.close(reloadData);
  }
}
