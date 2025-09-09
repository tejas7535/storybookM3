/* eslint-disable max-lines */
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { lastValueFrom, Observable, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { IRowNode, ValueGetterParams } from 'ag-grid-enterprise';

import { parseSelectableValueIfPossible } from '../../../../../feature/alert-rules/alert-rule-value-parser';
import { AlertRulesService } from '../../../../../feature/alert-rules/alert-rules.service';
import {
  AlertRule,
  AlertRuleSaveResponse,
} from '../../../../../feature/alert-rules/model';
import { SelectableValueOrOriginalCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/selectable-value-or-original/selectable-value-or-original.component';
import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../../../../shared/components/inputs/display-functions.utils';
import { AbstractTableUploadModalComponent } from '../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component';
import { ColumnForUploadTable } from '../../../../../shared/components/table-upload-modal/models';
import { SelectableOptionsService } from '../../../../../shared/services/selectable-options.service';
import {
  errorsFromSAPtoMessage,
  PostResult,
} from '../../../../../shared/utils/error-handling';
import { combineParseFunctionsForFields } from '../../../../../shared/utils/parse-values';
import { validateSelectableOptions } from '../../../../../shared/utils/validation/data-validation';
import {
  validateCustomerNumber,
  validateMaterialNumber,
} from '../../../../../shared/utils/validation/filter-validation';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
import { DateOrOriginalCellRendererComponent } from './../../../../../shared/components/ag-grid/cell-renderer/date-or-original-cell-renderer/date-or-original-cell-renderer.component';
import { MessageType } from './../../../../../shared/models/message-type.enum';
import {
  getThresholdRequirements,
  ThresholdsRequiredForAlertType,
} from './alert-rule-edit-single-modal/alert-rule-options-config';
import {
  checkAlertRuleData,
  ErrorMessage,
  getSpecialParseFunctions,
} from './alert-rule-logic-helper';

/**
 * The AbstractAlertRuleMultiModal Component.
 *
 * Used to wrap all shared logic for:
 * - AlertRuleEditMultiModalComponent
 * - AlertRuleDeleteMultiModalComponent
 *
 * @export
 * @abstract
 * @class AbstractAlertRuleMultiModalComponent
 * @extends {AbstractTableUploadModalComponent<AlertRule, AlertRuleSaveResponse>}
 * @implements {OnInit}
 */
@Component({ template: '' })
export abstract class AbstractAlertRuleMultiModalComponent
  extends AbstractTableUploadModalComponent<AlertRule, AlertRuleSaveResponse>
  implements OnInit
{
  /**
   * The SelectableOptionsService instance.
   *
   * @private
   * @type {SelectableOptionsService}
   * @memberof AbstractAlertRuleMultiModalComponent
   */
  private readonly optionsService: SelectableOptionsService = inject(
    SelectableOptionsService
  );

  /**
   * The AlertRulesService instance.
   *
   * @protected
   * @type {AlertRulesService}
   * @memberof AbstractAlertRuleMultiModalComponent
   */
  protected readonly alertRuleService: AlertRulesService =
    inject(AlertRulesService);

  /**
   * The TranslocoLocaleService instance.
   *
   * @protected
   * @type {TranslocoLocaleService}
   * @memberof AbstractAlertRuleMultiModalComponent
   */
  protected readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  /**
   * The available threshold requirements.
   *
   * @protected
   * @type {ThresholdsRequiredForAlertType[]}
   * @memberof AbstractAlertRuleMultiModalComponent
   */
  protected thresholdRequirements: ThresholdsRequiredForAlertType[] = [];

  /** @inheritdoc */
  protected maxRows: 500;

  /** @inheritdoc */
  protected get columnDefinitions(): ColumnForUploadTable<AlertRule>[] {
    return this.getMultiAlertRuleModalColumns({
      alertType: this.optionsService.get('alertTypesForRuleEditor').options,
      interval: this.optionsService.get('interval').options,
      execDay: this.optionsService.get('execDay').options,
      region: this.optionsService.get('region').options,
    });
  }

  /**
   * This apiCall is used during the apply function.
   *
   * @protected
   * @abstract
   * @param {AlertRule[]} data
   * @param {boolean} dryRun
   * @return {Observable<PostResult<AlertRuleSaveResponse>>}
   * @memberof AbstractAlertRuleMultiModalComponent
   */
  protected abstract apiCall(
    data: AlertRule[],
    dryRun: boolean
  ): Observable<PostResult<AlertRuleSaveResponse>>;

  /** @inheritdoc */
  protected applyFunction(
    data: AlertRule[],
    dryRun: boolean
  ): Promise<PostResult<AlertRuleSaveResponse>> {
    return lastValueFrom(
      this.apiCall(this.parse(data), dryRun).pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
    );
  }

  /** @inheritdoc */
  protected parseErrorsFromResult(
    result: PostResult<AlertRuleSaveResponse>
  ): ErrorMessage<AlertRule>[] {
    const errors: ErrorMessage<AlertRule>[] = [];
    result.response.forEach((response) => {
      if (response.result.messageType === MessageType.Error) {
        errors.push({
          dataIdentifier: {
            // Ignore ID here because it will be changed for new Alert Rules
            type: response.type,
            region: response.region,
            customerNumber: response.customerNumber,
            materialNumber: response.materialNumber,
          },
          errorMessage: errorsFromSAPtoMessage(response.result),
        });
      }
    });

    return errors;
  }

  /** @inheritdoc */
  protected checkDataForErrors(data: AlertRule[]): ErrorMessage<AlertRule>[] {
    const errors: ErrorMessage<AlertRule>[] = [];

    data.forEach((alertRule) =>
      errors.push(
        ...checkAlertRuleData(
          this.parse(alertRule),
          alertRule,
          this.thresholdRequirements
        )
      )
    );

    return errors;
  }

  private parse(data: AlertRule | AlertRule[]): any {
    if (Array.isArray(data)) {
      // If the input is an array, parse each AlertRule recursively
      return data.map((alertRule) => this.parse(alertRule));
    }

    // If the input is a single AlertRule, parse it
    const alertRule: AlertRule = { ...data };
    const parser = combineParseFunctionsForFields(
      this.specialParseFunctionsForFields
    );
    Object.keys(data).forEach((fieldName) => {
      (alertRule as any)[fieldName] = parser(
        fieldName,
        (data as any)[fieldName]
      );
    });

    return alertRule;
  }

  /** @inheritdoc */
  public override ngOnInit(): void {
    this.alertRuleService
      .getRuleTypeData()
      .pipe(
        tap(
          (result) =>
            (this.thresholdRequirements = getThresholdRequirements(result))
        )
      )
      .subscribe();

    super.ngOnInit();
  }

  /** @inheritdoc */
  protected specialParseFunctionsForFields: Map<
    keyof AlertRule,
    (value: string) => string
  > = getSpecialParseFunctions({
    alertTypes: this.optionsService.get('alertTypesForRuleEditor'),
    regionOptions: this.optionsService.get('region'),
    intervalOpts: this.optionsService.get('interval'),
    whenOpts: this.optionsService.get('execDay'),
  });

  /**
   * These are the Multi Alert Rule Column Definitions
   *
   * @param {{
   *     alertType: SelectableValue[];
   *     execDay: SelectableValue[];
   *     interval: SelectableValue[];
   *     region: SelectableValue[];
   *   }} options
   * @return {ColumnForUploadTable<AlertRule>[]}
   * @memberof AbstractAlertRuleMultiModalComponent
   */
  protected getMultiAlertRuleModalColumns(options: {
    alertType: SelectableValue[];
    execDay: SelectableValue[];
    interval: SelectableValue[];
    region: SelectableValue[];
  }): ColumnForUploadTable<AlertRule>[] {
    const getColDef = ({
      headerName,
      field,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      options,
      minWidth,
    }: {
      headerName: string;
      field: keyof AlertRule;
      options: SelectableValue[];
      minWidth?: number;
    }): ColumnForUploadTable<AlertRule> => ({
      field,
      headerName: translate(`alert_rules.edit_modal.label.${headerName}`),
      editable: true,
      validationFn: validateSelectableOptions(options),
      valueGetter: (params: ValueGetterParams) =>
        parseSelectableValueIfPossible(options)(params.data[field]),
      cellRenderer: SelectableValueOrOriginalCellRendererComponent,
      cellRendererParams: {
        options,
        getLabel: DisplayFunctions.displayFnText,
      },
      cellEditor: 'agRichSelectCellEditor',
      cellEditorPopup: true,
      cellEditorParams: {
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        values: options.map((option: any) => option.text),
      },
      ...(minWidth ? { minWidth } : {}),
    });

    return [
      getColDef({
        field: 'type',
        headerName: 'type',
        options: options.alertType,
        minWidth: 300,
      }),
      getColDef({
        field: 'region',
        headerName: 'region',
        options: options.region,
      }),
      {
        field: 'customerNumber',
        headerName: translate('alert_rules.multi_modal.customer'),
        editable: true,
        validationFn: ValidationHelper.condenseErrorsFromValidation(
          validateCustomerNumber
        ),
      },
      {
        field: 'materialNumber',
        headerName: translate('alert_rules.multi_modal.material'),
        editable: true,
        validationFn: ValidationHelper.condenseErrorsFromValidation(
          validateMaterialNumber
        ),
      },
      {
        field: 'threshold1',
        headerName: translate('rules.threshold1'),
        validationFn: (value: string, _rowData: IRowNode) =>
          ValidationHelper.detectLocaleAndValidateForLocalFloat(value),
        editable: true,
      },
      {
        field: 'threshold2',
        headerName: translate('rules.threshold2'),
        validationFn: (value: string, _rowData: IRowNode) =>
          ValidationHelper.detectLocaleAndValidateForLocalFloat(value),
        editable: true,
      },
      {
        field: 'threshold3',
        headerName: translate('rules.threshold3'),
        validationFn: (value: string, _rowData: IRowNode) =>
          ValidationHelper.detectLocaleAndValidateForLocalFloat(value),
        editable: true,
      },
      {
        field: 'startDate',
        headerName: translate('alert_rules.edit_modal.label.start'),
        editable: true,
        validationFn:
          this.modalMode === 'save'
            ? ValidationHelper.validateDateFormatAndGreaterEqualThanToday
            : undefined,
        cellRenderer: DateOrOriginalCellRendererComponent,
      },
      getColDef({
        field: 'execInterval',
        headerName: 'interval.rootString',
        options: options.interval,
      }),
      getColDef({
        field: 'execDay',
        headerName: 'when.rootString',
        options: options.execDay,
      }),
      {
        field: 'endDate',
        headerName: translate('alert_rules.edit_modal.label.end'),
        editable: true,
        validationFn:
          this.modalMode === 'save'
            ? ValidationHelper.validateDateFormatAndGreaterEqualThanToday
            : undefined,
        cellRenderer: DateOrOriginalCellRendererComponent,
      },
      {
        field: 'alertComment',
        headerName: translate('alert_rules.edit_modal.label.remark'),
        editable: true,
      },
    ];
  }
}
