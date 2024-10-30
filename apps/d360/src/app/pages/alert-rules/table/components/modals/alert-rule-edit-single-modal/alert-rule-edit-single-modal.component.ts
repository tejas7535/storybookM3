/* eslint-disable max-lines */
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { GridApi } from 'ag-grid-community';

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
import { SelectableValue } from '../../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { SingleAutocompleteOnTypeComponent } from '../../../../../../shared/components/inputs/autocomplete/single-autocomplete-on-type/single-autocomplete-on-type.component';
import { SingleAutocompletePreLoadedComponent } from '../../../../../../shared/components/inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { displayFnText } from '../../../../../../shared/components/inputs/display-functions.utils';
import { FilterDropdownComponent } from '../../../../../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { StyledGridSectionComponent } from '../../../../../../shared/components/styled-grid-section/styled-grid-section.component';
import { SelectableOptionsService } from '../../../../../../shared/services/selectable-options.service';
import {
  errorsFromSAPtoMessage,
  singlePostResultToUserMessage,
} from '../../../../../../shared/utils/error-handling';
import { SnackbarService } from '../../../../../../shared/utils/service/snackbar.service';
import { fillZeroOnValueFunc } from '../../../../../../shared/utils/validation/validation-helper';
import {
  execIntervalOptions,
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

@Component({
  selector: 'app-alert-rule-edit-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    StyledGridSectionComponent,
    MatGridList,
    LoadingSpinnerModule,
    MatGridTile,
    SingleAutocompletePreLoadedComponent,
    SharedTranslocoModule,
    MatDialogTitle,
    FilterDropdownComponent,
    SingleAutocompleteOnTypeComponent,
    PushPipe,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatError,
    MatSelect,
    MatOption,
    DatePickerComponent,
    CdkTextareaAutosize,
  ],
  templateUrl: './alert-rule-edit-single-modal.component.html',
  styleUrl: './alert-rule-edit-single-modal.component.scss',
})
export class AlertRuleEditSingleModalComponent implements OnInit {
  protected loading = this.selectableOptionsService.loading$;
  protected saveOptionLoading = false;
  protected showInputError = false;
  protected fromPickerErrorReason: string | null = null;
  protected toPickerErrorReason: string | null = null;
  protected threshold1Required = false;
  protected threshold2Required = false;
  protected threshold3Required = false;
  protected whenOptions: ExecDay[] = [];
  protected title = `alert_rules.edit_modal.title.${this.data.title as AlertRuleModalTitle}`;

  protected alertTypeData: AlertTypeDescription[] = [];

  // TODO check if this is necessary and use transloco settings if possible
  // const decimalSeparator = preferredDecimalSeparator === 'COMMA' ? ',' : '.';
  // const thousandSeparator = preferredDecimalSeparator === 'COMMA' ? '.' : ',';

  protected formGroup: FormGroup;

  protected alertTypeControl: FormControl<SelectableValue | string>;
  protected regionControl: FormControl<Partial<SelectableValue>>;
  protected demandPlannerControl: FormControl<SelectableValue | string>;
  protected sectorMgmtControl: FormControl<Partial<SelectableValue>>;
  protected salesAreaControl: FormControl<Partial<SelectableValue>>;
  protected salesOrgControl: FormControl<SelectableValue | string>;
  protected gkamControl: FormControl<SelectableValue | string>;
  protected productLineControl: FormControl<SelectableValue | string>;
  protected productionLineControl: FormControl<SelectableValue | string>;
  protected customerNumberControl: FormControl<SelectableValue | string>;
  protected materialClassificationControl: FormControl<
    Partial<SelectableValue>
  >;
  protected materialNumberControl: FormControl<SelectableValue | string>;
  protected threshold1Control: FormControl<string>;
  protected threshold2Control: FormControl<string>;
  protected threshold3Control: FormControl<string>;
  protected execIntervalControl: FormControl<ExecInterval>;
  protected whenOptionsControl: FormControl<ExecDay>;
  protected alertCommentControl: FormControl<string>;
  protected startDateControl: FormControl<Date>;
  protected endDateControl: FormControl<Date>;

  /**
   * Mit der Regel stellt der Demand Planner ein Todo für die Sales Kollegen zur Validierung des Forecasts ein, das passiert in Demand360 nur auf SP Materialien (prio 1) und mit niedrigere Prio auch für AP Materialien
   *  Daher werden nur AP und SP als Auswahlmöglichkeit angegeben
   * @protected
   */
  protected materialClassificationOptions: SelectableValue[] = [
    { id: 'AP', text: 'AP' },
    {
      id: 'SP',
      text: 'SP',
    },
  ];
  protected alertTypeDescriptionWithParameter: AlertTypeDescription | null =
    null;
  private currentCurrency: string;

  protected isAtLeastOneFieldSet: boolean;

  constructor(
    // private readonly snackbarService: SnackbarService,
    private readonly currencyService: CurrencyService,
    private readonly alertRuleService: AlertRulesService,
    protected readonly selectableOptionsService: SelectableOptionsService,
    @Inject(MAT_DIALOG_DATA) public data: AlertRuleModalProps,
    public dialogRef: MatDialogRef<AlertRuleEditSingleModalComponent>,
    private readonly fb: FormBuilder,
    private readonly snackbarService: SnackbarService
  ) {
    this.alertRuleService.getRuleTypeData().subscribe((response) => {
      this.alertTypeData = response;
      this.updateThresholds();
    });
    this.currencyService
      .getCurrentCurrency()
      .subscribe((currency) => (this.currentCurrency = currency));
    this.updateWhenOptions(this.data.alertRule.execInterval);
    this.updateIsAtLeastOneFieldSet();
    this.createAndInitializeFormGroup();
  }

  ngOnInit(): void {
    this.regionControl.valueChanges.subscribe((value) => {
      this.data.alertRule = { ...this.data.alertRule, region: value.id };
    });
    this.sectorMgmtControl.valueChanges.subscribe((value) => {
      this.data.alertRule = {
        ...this.data.alertRule,
        sectorManagement: value.id,
      };
      this.updateIsAtLeastOneFieldSet();
    });
    this.salesAreaControl.valueChanges.subscribe((value) => {
      this.data.alertRule = { ...this.data.alertRule, salesArea: value.id };
      this.updateIsAtLeastOneFieldSet();
    });
    this.materialClassificationControl.valueChanges.subscribe((value) => {
      this.data.alertRule = {
        ...this.data.alertRule,
        materialClassification: value.id,
      };
    });
    this.threshold1Control.valueChanges.subscribe((value) => {
      // TODO check if number should be localized
      this.data.alertRule = { ...this.data.alertRule, threshold1: value };
    });
    this.threshold2Control.valueChanges.subscribe((value) => {
      // TODO check if number should be localized
      this.data.alertRule = { ...this.data.alertRule, threshold2: value };
    });
    this.threshold3Control.valueChanges.subscribe((value) => {
      // TODO check if number should be localized
      this.data.alertRule = { ...this.data.alertRule, threshold3: value };
    });
    this.execIntervalControl.valueChanges.subscribe((value) => {
      this.updateWhenOptions(value);
      this.handleIntervalChange(value);
    });
    this.whenOptionsControl.valueChanges.subscribe((value) => {
      this.data.alertRule = { ...this.data.alertRule, execDay: value };
      // TODO check if this is handled by execIntervall or anywhere else
    });
    this.alertCommentControl.valueChanges.subscribe((value) => {
      this.data.alertRule = { ...this.data.alertRule, alertComment: value };
    });
    this.startDateControl.valueChanges.subscribe((value) => {
      this.data.alertRule = { ...this.data.alertRule, startDate: value };
    });
    this.endDateControl.valueChanges.subscribe((value) => {
      this.data.alertRule = { ...this.data.alertRule, endDate: value };
    });
  }

  private createAndInitializeFormGroup() {
    this.alertTypeControl = this.fb.control(
      this.data.alertRule.type ?? '',
      Validators.required
    );
    this.regionControl = this.fb.control(
      { id: this.data.alertRule.region },
      Validators.required
    );
    this.demandPlannerControl = this.fb.control(
      this.data.alertRule.demandPlannerId
    );
    this.sectorMgmtControl = this.fb.control({
      id: this.data.alertRule.sectorManagement,
    });
    this.salesAreaControl = this.fb.control({
      id: this.data.alertRule.salesArea,
    });
    this.salesOrgControl = this.fb.control(this.data.alertRule.salesOrg);
    this.gkamControl = this.fb.control(this.data.alertRule.gkamNumber);
    this.productLineControl = this.fb.control(this.data.alertRule.productLine);
    this.productionLineControl = this.fb.control(
      this.data.alertRule.productionLine
    );
    this.customerNumberControl = this.fb.control(
      this.data.alertRule.customerNumber
    );
    this.materialClassificationControl = this.fb.control({
      id: this.data.alertRule.materialClassification,
    });
    this.materialNumberControl = this.fb.control(
      this.data.alertRule.materialNumber
    );
    this.threshold1Control = this.fb.control(this.data.alertRule.threshold1);
    this.threshold2Control = this.fb.control(this.data.alertRule.threshold2);
    this.threshold3Control = this.fb.control(this.data.alertRule.threshold3);
    this.execIntervalControl = this.fb.control(
      this.data.alertRule.execInterval,
      Validators.required
    );
    this.whenOptionsControl = this.fb.control(
      this.whenOptions.find((elem) => elem === this.data.alertRule.execDay),
      Validators.required
    );
    this.alertCommentControl = this.fb.control(
      this.data.alertRule.alertComment
    );
    this.startDateControl = this.fb.control(this.data.alertRule.startDate);
    this.endDateControl = this.fb.control(this.data.alertRule.endDate);

    this.formGroup = this.fb.group(
      {
        // Define your form controls here
        // TODO check validators, not all fields are required, i think there is a logic regarding to the alert type
        alertTypeControl: this.alertTypeControl,
        regionControl: this.regionControl,
        demandPlannerControl: this.demandPlannerControl,
        sectorMgmtControl: this.sectorMgmtControl,
        salesAreaControl: this.salesAreaControl,
        salesOrgControl: this.salesOrgControl,
        gkamControl: this.gkamControl,
        productLineControl: this.productLineControl,
        productionLineControl: this.productionLineControl,
        customerNumberControl: this.customerNumberControl,
        materialClassificationControl: this.materialClassificationControl,
        materialNumberControl: this.materialNumberControl,
        threshold1Control: this.threshold1Control,
        threshold2Control: this.threshold2Control,
        threshold3Control: this.threshold3Control,
        execIntervalControl: this.execIntervalControl,
        whenOptionsControl: this.whenOptionsControl,
        alertCommentControl: this.alertCommentControl,
        startDateControl: this.startDateControl,
        endDateControl: this.endDateControl,
      },
      { validators: this.editSingleModalValidator() }
    );
  }

  private updateIsAtLeastOneFieldSet() {
    // TODO check if it is necessary to also validate the FormControl values here or this property is only used initially
    this.isAtLeastOneFieldSet =
      !this.data.alertRule.salesArea &&
      !this.data.alertRule.salesOrg &&
      !this.data.alertRule.customerNumber &&
      !this.data.alertRule.sectorManagement &&
      !this.data.alertRule.demandPlannerId &&
      !this.data.alertRule.gkamNumber;
  }

  private updateThresholds(): void {
    const typeDescription = this.alertTypeData.find(
      (element) => element.alertType === this.data.alertRule.type
    );

    const isThresholdRequired = (thresholdType: string) =>
      thresholdTypeWithParameter.includes(thresholdType || '');

    if (
      typeDescription &&
      thresholdTypeWithParameter.includes(typeDescription?.threshold1Type)
    ) {
      const { threshold1Type, threshold2Type, threshold3Type } =
        typeDescription;
      this.alertTypeDescriptionWithParameter = typeDescription;
      this.threshold1Required = isThresholdRequired(threshold1Type);
      this.threshold2Required = isThresholdRequired(threshold2Type);
      this.threshold3Required = isThresholdRequired(threshold3Type);
      this.updateThresholdControlStatus();

      return;
    }

    this.alertTypeDescriptionWithParameter = null;
    this.threshold1Required = false;
    this.threshold2Required = false;
    this.threshold3Required = false;
    this.updateThresholdControlStatus();
  }

  private updateThresholdControlStatus() {
    if (this.threshold1Required) {
      this.threshold1Control.enable();
    } else {
      this.threshold1Control.disable();
    }

    if (this.threshold2Required) {
      this.threshold2Control.enable();
    } else {
      this.threshold2Control.disable();
    }

    if (this.threshold3Required) {
      this.threshold3Control.enable();
    } else {
      this.threshold3Control.disable();
    }
  }

  private updateWhenOptions(execInterval: ExecInterval | null) {
    if (!execInterval) {
      return;
    }
    const options = possibleWhenOptions[execInterval];
    this.whenOptions = options || [];
  }

  private handleIntervalChange(execInterval: ExecInterval) {
    switch (execInterval) {
      case 'M1':
      case 'M2':
      case 'M3':
      case 'M6': {
        this.data.alertRule =
          !this.data.alertRule.execDay ||
          !possibleWhenOptions[execInterval].includes(
            this.data.alertRule.execDay
          )
            ? {
                ...this.data.alertRule,
                execDay: 'M01',
                execInterval,
              }
            : { ...this.data.alertRule, execInterval };
        break;
      }
      case 'W1': {
        // There is only one option here so we can set it directly
        this.data.alertRule = {
          ...this.data.alertRule,
          execDay: 'W6',
          execInterval,
        };
        break;
      }
      case 'D1': {
        // There is only one option here so we can set it directly
        this.data.alertRule = {
          ...this.data.alertRule,
          execDay: 'D',
          execInterval,
        };
        break;
      }
      default: {
        this.updateWhenOptions(null);
        this.data.alertRule = {
          ...this.data.alertRule,
          execDay: null,
          execInterval,
        };
        break;
      }
    }
  }

  // @ts-expect-error: ignore unused method for now
  private getEndDateErrorText() {
    if (!this.data.alertRule.endDate) {
      return [translate('generic.validation.missing_fields', {})];
    }

    if (
      this.data.alertRule.startDate &&
      this.data.alertRule.endDate &&
      this.data.alertRule.endDate < this.data.alertRule.startDate
    ) {
      return [translate('error.toDateAfterFromDate', {})];
    }

    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }

  private applyRuleTypeChange(value: SelectableValue | null) {
    if (this.data.alertRule.type === value?.id) {
      return;
    }

    this.data.alertRule = {
      ...this.data.alertRule,
      type: value && value.id ? value.id : null,
      threshold1: null,
      threshold2: null,
      threshold3: null,
      currency: this.data.alertRule.currency || this.currentCurrency,
    };

    this.threshold1Control.setValue(null);
    this.threshold2Control.setValue(null);
    this.threshold3Control.setValue(null);

    this.showInputError = false;
  }

  /* eslint-disable complexity */
  protected handleSave() {
    if (
      (this.formGroup.dirty || this.formGroup.touched) &&
      this.formGroup.valid
    ) {
      // TODO update data and return
    }

    if (
      !this.data.alertRule.region ||
      !this.data.alertRule.type ||
      !this.data.alertRule.execInterval ||
      !this.data.alertRule.execDay ||
      !this.data.alertRule.startDate ||
      !this.data.alertRule.endDate ||
      this.isAtLeastOneFieldSet
    ) {
      // TODO implement
      // snackbar.enqueueSnackbar(t('generic.validation.missing_fields', {}), {
      //   variant: 'error',
      // });
      this.snackbarService.openSnackBar(
        translate('generic.validation.missing_fields')
      );
      this.showInputError = true;

      return;
    }

    if (
      this.toPickerErrorReason ||
      this.fromPickerErrorReason ||
      this.data.alertRule.startDate > this.data.alertRule.endDate ||
      (Number.isNaN(this.data.alertRule.threshold1) &&
        this.threshold1Required) ||
      (Number.isNaN(this.data.alertRule.threshold2) &&
        this.threshold2Required) ||
      (!this.data.alertRule.threshold3 && this.threshold3Required)
    ) {
      // TODO implement
      // snackbar.enqueueSnackbar(t('generic.validation.check_inputs', {}), {
      //   variant: 'error',
      // });
      this.snackbarService.openSnackBar(
        translate('generic.validation.check_inputs')
      );
      this.showInputError = true;

      return;
    }

    this.showInputError = false;

    this.saveOptionLoading = true;

    const refinedAlertRule: AlertRule = {
      ...this.data.alertRule,
      // TODO check if this values are SelectableValues or strings --> Should be Selectable after fix and then use .id
      gkamNumber:
        this.data.alertRule.gkamNumber &&
        fillZeroOnValueFunc(6, this.data.alertRule.gkamNumber),
      materialNumber:
        this.data.alertRule.materialNumber &&
        fillZeroOnValueFunc(15, this.data.alertRule.materialNumber),
      customerNumber:
        this.data.alertRule.customerNumber &&
        fillZeroOnValueFunc(10, this.data.alertRule.customerNumber),
    };

    this.alertRuleService
      .saveMultiAlertRules([refinedAlertRule])
      .subscribe((postResult) => {
        const userMessage = singlePostResultToUserMessage(
          postResult,
          errorsFromSAPtoMessage,
          translate('alert_rules.edit_modal.success.alert_rule_created', {})
        );
        // TODO implement
        // snackbar.enqueueSnackbar(userMessage.message, { variant: userMessage.variant });
        this.snackbarService.openSnackBar(userMessage.message);

        if (userMessage.variant !== 'error') {
          this.alertRuleService
            .getAlertRuleData()
            .subscribe((response) =>
              this.data.gridApi.setRowData(response.content)
            );
          this.handleOnClose();
        }
        this.saveOptionLoading = false;
      });
  }

  protected handleOnClose() {
    // Reset valid state on close
    this.showInputError = false;
    this.fromPickerErrorReason = null;
    this.toPickerErrorReason = null;
    this.alertTypeDescriptionWithParameter = null;
    this.data.alertRule = {
      id: '00000000-0000-0000-0000-000000000000',
      startDate: new Date(Date.now()),
      endDate: new Date('9999-12-31'),
    };
    this.dialogRef.close();
  }

  protected readonly execIntervalOptions = execIntervalOptions;
  protected readonly displayFnText = displayFnText;

  private editSingleModalValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const startDate = this.startDateControl;
      const endDate = group.get('endDateControl');
      const threshold1 = group.get('threshold1Control');
      const threshold2 = group.get('threshold2Control');
      const threshold3 = group.get('threshold3Control');

      const errors: { [key: string]: string[] } = {};

      if (!startDate || !startDate.value) {
        errors.startDate = [translate('generic.validation.missing_fields')];
      }

      if (!endDate || !endDate.value) {
        errors.endDate = [translate('generic.validation.missing_fields')];
      }

      if (startDate.value && endDate.value && startDate.value > endDate.value) {
        errors.endDate = [translate('error.toDateAfterFromDate', {})];
      }

      if (threshold1.value && Number.isNaN(threshold1.value)) {
        errors.threshold1 = [translate('generic.validation.invalid_number')];
      }

      if (threshold2.value && Number.isNaN(threshold2.value)) {
        errors.threshold2 = [translate('generic.validation.invalid_number')];
      }

      if (threshold3.value && Number.isNaN(threshold3.value)) {
        errors.threshold3 = [translate('generic.validation.invalid_number')];
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  handleAlertTypeChange($event: SingleAutocompleteSelectedEvent) {
    this.applyRuleTypeChange($event.option);
    this.updateThresholds();
  }

  handleSalesOrgChange($event: SingleAutocompleteSelectedEvent) {
    this.data.alertRule = {
      ...this.data.alertRule,
      salesOrg: $event.option.id,
    };
    this.updateIsAtLeastOneFieldSet();
  }

  handleDemandPlannerChange($event: SingleAutocompleteSelectedEvent) {
    this.data.alertRule = {
      ...this.data.alertRule,
      demandPlannerId: $event.option.id,
    };
    this.updateIsAtLeastOneFieldSet();
  }

  handleGkamChange($event: SingleAutocompleteSelectedEvent) {
    this.data.alertRule = {
      ...this.data.alertRule,
      gkamNumber: $event.option.id,
    };
    this.updateIsAtLeastOneFieldSet();
  }

  handleCustomerNumberChange($event: SingleAutocompleteSelectedEvent) {
    this.data.alertRule = {
      ...this.data.alertRule,
      customerNumber: $event.option.id,
    };
    this.updateIsAtLeastOneFieldSet();
  }

  handleProductLineChange($event: SingleAutocompleteSelectedEvent) {
    this.data.alertRule = {
      ...this.data.alertRule,
      productLine: $event.option.id,
    };
  }

  handleProductionLineChange(_: SingleAutocompleteSelectedEvent) {
    // TODO implement
  }

  handleMaterialNumberChange($event: SingleAutocompleteSelectedEvent) {
    this.data.alertRule = {
      ...this.data.alertRule,
      materialNumber: $event.option.id,
    };
  }
}
