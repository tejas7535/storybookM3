/* eslint-disable max-lines */
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { lastValueFrom, Observable, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { IRowNode } from 'ag-grid-community';

import { valueParserForSelectableOptions } from '../../../../../feature/alert-rules/alert-rule-value-parser';
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
import { validateSelectableOptions } from '../../../../../shared/utils/validation/data-validation';
import {
  validateCustomerNumber,
  validateMaterialNumber,
} from '../../../../../shared/utils/validation/filter-validation';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
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
  protected columnDefinitions = this.getMultiAlertRuleModalColumns({
    alertType: this.optionsService.get('alertTypesForRuleEditor').options,
    interval: this.optionsService.get('interval').options,
    execDay: this.optionsService.get('execDay').options,
    region: this.optionsService.get('region').options,
    demandPlanner: this.optionsService.get('demandPlanners').options,
    sectorManagement: this.optionsService.get('sectorMgmt').options,
    salesOrg: this.optionsService.get('salesOrg').options,
    salesArea: this.optionsService.get('salesArea').options,
    productLine: this.optionsService.get('productLine').options,
    gkam: this.optionsService.get('gkam').options,
  });

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
      this.apiCall(data, dryRun).pipe(
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
      if (response.result.messageType === 'ERROR') {
        errors.push({
          dataIdentifier: {
            // Ignore ID here because it will be changed for new Alert Rules
            type: response.type,
            region: response.region,
            salesArea: response.salesArea,
            salesOrg: response.salesOrg,
            customerNumber: response.customerNumber,
            materialNumber: response.materialNumber,
            materialClassification: response.materialClassification,
            sectorManagement: response.sectorManagement,
            demandPlannerId: response.demandPlannerId,
            productionLine: response.productionLine,
            productLine: response.productLine,
            gkamNumber: response.gkamNumber,
            demandPlanner: response.demandPlannerId,
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
      errors.push(...checkAlertRuleData(alertRule, this.thresholdRequirements))
    );

    return errors;
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
  > = getSpecialParseFunctions(
    this.optionsService.get('alertTypesForRuleEditor'),
    this.optionsService.get('region'),
    this.optionsService.get('salesArea'),
    this.optionsService.get('salesOrg'),
    this.optionsService.get('sectorMgmt'),
    this.optionsService.get('demandPlanners'),
    this.optionsService.get('gkam'),
    this.optionsService.get('productLine'),
    this.optionsService.get('interval'),
    this.optionsService.get('execDay')
  );

  /**
   * These are the Multi Alert Rule Column Definitions
   *
   * @param {{
   *     alertType: SelectableValue[];
   *     demandPlanner: SelectableValue[];
   *     execDay: SelectableValue[];
   *     gkam: SelectableValue[];
   *     interval: SelectableValue[];
   *     productLine: SelectableValue[];
   *     region: SelectableValue[];
   *     salesArea: SelectableValue[];
   *     salesOrg: SelectableValue[];
   *     sectorManagement: SelectableValue[];
   *   }} options
   * @return {ColumnForUploadTable<AlertRule>[]}
   * @memberof AbstractAlertRuleMultiModalComponent
   */
  protected getMultiAlertRuleModalColumns(options: {
    alertType: SelectableValue[];
    demandPlanner: SelectableValue[];
    execDay: SelectableValue[];
    gkam: SelectableValue[];
    interval: SelectableValue[];
    productLine: SelectableValue[];
    region: SelectableValue[];
    salesArea: SelectableValue[];
    salesOrg: SelectableValue[];
    sectorManagement: SelectableValue[];
  }): ColumnForUploadTable<AlertRule>[] {
    return [
      {
        field: 'type',
        headerNameFn: () => translate('alert_rules.edit_modal.label.type'),
        valueParser: valueParserForSelectableOptions(options.alertType),
        editable: true,
        validationFn: validateSelectableOptions(options.alertType),
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        cellRendererParams: {
          options: options.alertType,
          getLabel: DisplayFunctions.displayFnText,
        },
        minWidth: 300,
        cellEditor: 'agRichSelectCellEditor',
        cellEditorPopup: true,
        cellEditorParams: {
          cellRenderer: SelectableValueOrOriginalCellRendererComponent,
          values: options.alertType.map((option) => option.text),
        },
      },
      {
        field: 'region',
        headerNameFn: () => translate('alert_rules.edit_modal.label.region'),
        editable: true,
        valueParser: valueParserForSelectableOptions(options.region),
        validationFn: validateSelectableOptions(options.region),
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        cellRendererParams: { options: options.region },
      },
      {
        field: 'salesArea',
        headerNameFn: () =>
          translate('alert_rules.edit_modal.label.sales_area'),
        valueParser: valueParserForSelectableOptions(options.salesArea),
        editable: true,
        validationFn: validateSelectableOptions(options.salesArea),
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        cellRendererParams: {
          options: options.salesArea,
          values: options.salesArea.map((option) => option.text),
        },
      },
      {
        field: 'salesOrg',
        headerNameFn: () => translate('alert_rules.edit_modal.label.sales_org'),
        valueParser: valueParserForSelectableOptions(options.salesOrg),
        editable: true,
        validationFn: validateSelectableOptions(options.salesOrg),
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        cellRendererParams: {
          options: options.salesOrg,
          values: options.salesOrg.map((option) => option.text),
        },
      },

      {
        field: 'sectorManagement',
        headerNameFn: () =>
          translate('alert_rules.edit_modal.label.sector_management'),
        valueParser: valueParserForSelectableOptions(options.sectorManagement),
        editable: true,
        validationFn: validateSelectableOptions(options.sectorManagement),
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        cellRendererParams: {
          options: options.sectorManagement,
          values: options.sectorManagement.map((option) => option.text),
        },
      },

      {
        field: 'demandPlannerId',
        headerNameFn: () =>
          translate('alert_rules.edit_modal.label.demandPlannerId'),
        valueParser: valueParserForSelectableOptions(options.demandPlanner),
        editable: true,
        validationFn: validateSelectableOptions(options.demandPlanner),
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        cellRendererParams: {
          options: options.demandPlanner,
          values: options.demandPlanner.map((option) => option.text),
        },
      },
      {
        field: 'gkamNumber',
        headerNameFn: () =>
          translate('alert_rules.edit_modal.label.gkamNumber'),
        valueParser: valueParserForSelectableOptions(options.gkam),
        editable: true,
        validationFn: validateSelectableOptions(options.gkam),
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        cellRendererParams: {
          options: options.gkam,
          values: options.gkam.map((option) => option.text),
        },
      },
      {
        field: 'customerNumber',
        headerNameFn: () => translate('alert_rules.multi_modal.customer'),
        editable: true,
        validationFn: ValidationHelper.condenseErrorsFromValidation(
          validateCustomerNumber
        ),
      },
      {
        field: 'materialClassification',
        headerNameFn: () =>
          translate('alert_rules.edit_modal.label.materialClassification'),
        editable: true,
      },
      {
        field: 'productLine',
        headerNameFn: () =>
          translate('alert_rules.edit_modal.label.product_line'),
        valueParser: valueParserForSelectableOptions(options.productLine),
        editable: true,
        validationFn: validateSelectableOptions(options.productLine),
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        cellRendererParams: {
          options: options.productLine,
          values: options.productLine.map((option) => option.text),
        },
      },
      {
        field: 'productionLine',
        headerNameFn: () =>
          translate('alert_rules.edit_modal.label.production_line'),
        editable: true,
      },
      {
        field: 'materialNumber',
        headerNameFn: () => translate('alert_rules.multi_modal.material'),
        editable: true,
        validationFn: ValidationHelper.condenseErrorsFromValidation(
          validateMaterialNumber
        ),
      },
      {
        field: 'threshold1',
        headerNameFn: () => translate('rules.threshold1'),
        validationFn: (value: string, _rowData: IRowNode) =>
          ValidationHelper.detectLocaleAndValidateForLocalFloat(value),
        editable: true,
      },
      {
        field: 'threshold2',
        headerNameFn: () => translate('rules.threshold2'),
        validationFn: (value: string, _rowData: IRowNode) =>
          ValidationHelper.detectLocaleAndValidateForLocalFloat(value),
        editable: true,
      },
      {
        field: 'threshold3',
        headerNameFn: () => translate('rules.threshold3'),
        validationFn: (value: string, _rowData: IRowNode) =>
          ValidationHelper.detectLocaleAndValidateForLocalFloat(value),
        editable: true,
      },
      {
        field: 'startDate',
        headerNameFn: () => translate('alert_rules.edit_modal.label.start'),
        editable: true,
        validationFn:
          ValidationHelper.validateDateFormatAndGreaterEqualThanToday,
      },
      {
        field: 'execInterval',
        headerNameFn: () =>
          translate('alert_rules.edit_modal.label.interval.rootString'),
        valueParser: valueParserForSelectableOptions(options.interval),
        editable: true,
        validationFn: validateSelectableOptions(options.interval),
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        cellRendererParams: {
          options: options.interval,
          getLabel: DisplayFunctions.displayFnText,
        },
      },
      {
        field: 'execDay',
        headerNameFn: () =>
          translate('alert_rules.edit_modal.label.when.rootString'),
        valueParser: valueParserForSelectableOptions(options.execDay),
        editable: true,
        validationFn: validateSelectableOptions(options.execDay),
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        cellRendererParams: {
          options: options.execDay,
          getLabel: DisplayFunctions.displayFnText,
        },
      },
      {
        field: 'endDate',
        headerNameFn: () => translate('alert_rules.edit_modal.label.end'),
        editable: true,
        validationFn:
          ValidationHelper.validateDateFormatAndGreaterEqualThanToday,
      },
      {
        field: 'alertComment',
        headerNameFn: () => translate('alert_rules.edit_modal.label.comment'),
        editable: true,
      },
    ];
  }
}
