import { translate } from '@jsverse/transloco';

import { AlertRule } from '../../../../../feature/alert-rules/model';
import { OptionsLoadingResult } from '../../../../../shared/services/selectable-options.service';
import { parseDateIfPossible } from '../../../../../shared/utils/parse-values';
import { parseSelectableValueIfPossible } from './../../../../../feature/alert-rules/alert-rule-value-parser';
import {
  possibleWhenOptions,
  thresholdAlerts,
  ThresholdsRequiredForAlertType,
} from './alert-rule-edit-single-modal/alert-rule-options-config';

export interface ErrorMessage<DATA> {
  id?: string;
  dataIdentifier: Partial<DATA>;
  specificField?: keyof DATA;
  errorMessage: string;
}

const mandatoryFieldsAlertRule: (keyof Partial<AlertRule>)[] = [
  'type',
  'region',
  'customerNumber',
  'materialNumber',
  'execInterval',
  'execDay',
  'startDate',
  'endDate',
] as const;

const keyFieldsAlertRule: (keyof Partial<AlertRule>)[] = [
  'salesArea',
  'salesOrg',
  'customerNumber',
  'sectorManagement',
  'demandPlannerId',
  'gkamNumber',
] as const;

// Use functions to avoid calling the translation function while the languages are not ready
// and to ensure no typos in the keys
const keyFieldTranslations = [
  () => translate('alert_rules.edit_modal.label.sales_area'),
  () => translate('alert_rules.edit_modal.label.sales_org'),
  () => translate('alert_rules.edit_modal.label.customer'),
  () => translate('alert_rules.edit_modal.label.sector_management'),
  () => translate('alert_rules.edit_modal.label.demandPlannerId'),
  () => translate('alert_rules.edit_modal.label.gkamNumber'),
];

/**
 * Validates the provided alert rule data and returns a list of error messages if any issues are found.
 *
 * The function performs the following checks:
 * - Ensures mandatory fields are present in the alert rule.
 * - Validates key fields in the alert rule.
 * - Checks if the thresholds in the alert rule meet the requirements for the specified alert type.
 * - Verifies that the `execDay` value is valid for the given `execInterval`.
 *
 * @param {AlertRule} alertRule  - The alert rule object to validate.
 * @param {AlertRule} alertRuleOriginal  - The original alert rule object, used for error identification.
 * @param {ThresholdsRequiredForAlertType[]} thresholdRequirements  - A list of threshold requirements specific to alert types.
 *
 * @returns {ErrorMessage<AlertRule>[]} An array of error messages indicating validation issues with the alert rule.
 *
 */
export function checkAlertRuleData(
  alertRule: AlertRule,
  alertRuleOriginal: AlertRule,
  thresholdRequirements: ThresholdsRequiredForAlertType[]
): ErrorMessage<AlertRule>[] {
  const errors: ErrorMessage<AlertRule>[] = [];

  errors.push(
    ...mandatoryFieldCheckAlertRule(alertRule),
    ...keyFieldCheckAlertRule(alertRule)
  );

  const correctThresholdRequirement = thresholdRequirements.find(
    (thresholdRequirement) => thresholdRequirement.alertType === alertRule.type
  );
  if (alertRule.type && correctThresholdRequirement) {
    thresholdAlerts.forEach((threshold) => {
      const thresholdError = thresholdRequirementCheckAlertRule(
        threshold,
        alertRule,
        correctThresholdRequirement
      );
      if (thresholdError) {
        errors.push(thresholdError);
      }
    });
  }

  if (alertRule.execInterval && alertRule.execDay) {
    const allowedOptions = possibleWhenOptions?.[alertRule.execInterval];
    if (!(allowedOptions || []).includes(alertRule.execDay)) {
      errors.push({
        dataIdentifier: alertRuleOriginal,
        specificField: 'execDay',
        errorMessage: translate(
          'alert_rules.multi_modal.error.execDay_not_valid'
        ),
      });
    }
  }

  return errors;
}

export function mandatoryFieldCheckAlertRule(
  alertRule: AlertRule
): ErrorMessage<AlertRule>[] {
  const errors: ErrorMessage<AlertRule>[] = [];

  mandatoryFieldsAlertRule.forEach((mandatoryField) => {
    if (!alertRule[mandatoryField]) {
      errors.push({
        dataIdentifier: alertRule,
        specificField: mandatoryField,
        errorMessage: translate('generic.validation.missing_fields'),
      });
    }
  });

  return errors;
}

export function keyFieldCheckAlertRule(
  alertRule: AlertRule
): ErrorMessage<AlertRule>[] {
  const errors: ErrorMessage<AlertRule>[] = [];

  const keyFieldContent = keyFieldsAlertRule.map(
    (keyField) => alertRule[keyField]
  );
  if (keyFieldContent.every((keyfieldContentValue) => !keyfieldContentValue)) {
    // Use an error without specificField to mark the whole row as error
    errors.push({
      dataIdentifier: alertRule,
      errorMessage: translate('generic.validation.at_least_one_of', {
        fieldlist: keyFieldTranslations
          .map((transFunc) => transFunc())
          .join(', '),
      }),
    });
  }

  return errors;
}

export function thresholdRequirementCheckAlertRule(
  threshold: 'threshold1' | 'threshold2' | 'threshold3',
  alertRule: AlertRule,
  correctThresholdRequirement: ThresholdsRequiredForAlertType
): ErrorMessage<AlertRule> | undefined {
  if (correctThresholdRequirement[threshold] && !alertRule[threshold]) {
    return {
      dataIdentifier: alertRule,
      specificField: threshold,
      errorMessage: translate('generic.validation.missing_fields'),
    };
  }

  return undefined;
}

export function getSpecialParseFunctions({
  alertTypes,
  regionOptions,
  salesAreaOptions,
  salesOrgOptions,
  sectorManagementOptions,
  demandPlannerOptions,
  gkamOptions,
  productLineOptions,
  intervalOpts,
  whenOpts,
  materialClassification,
}: {
  alertTypes: OptionsLoadingResult;
  regionOptions: OptionsLoadingResult;
  salesAreaOptions: OptionsLoadingResult;
  salesOrgOptions: OptionsLoadingResult;
  sectorManagementOptions: OptionsLoadingResult;
  demandPlannerOptions: OptionsLoadingResult;
  gkamOptions: OptionsLoadingResult;
  productLineOptions: OptionsLoadingResult;
  intervalOpts: OptionsLoadingResult;
  whenOpts: OptionsLoadingResult;
  materialClassification: OptionsLoadingResult;
}): Map<keyof AlertRule, (value: string) => string> {
  return new Map([
    ['type', parseSelectableValueIfPossible(alertTypes.options)],
    ['region', parseSelectableValueIfPossible(regionOptions.options)],
    ['salesArea', parseSelectableValueIfPossible(salesAreaOptions.options)],
    ['salesOrg', parseSelectableValueIfPossible(salesOrgOptions.options)],
    [
      'sectorManagement',
      parseSelectableValueIfPossible(sectorManagementOptions.options),
    ],
    [
      'demandPlannerId',
      parseSelectableValueIfPossible(demandPlannerOptions.options),
    ],
    ['gkamNumber', parseSelectableValueIfPossible(gkamOptions.options)],
    ['productLine', parseSelectableValueIfPossible(productLineOptions.options)],
    ['execInterval', parseSelectableValueIfPossible(intervalOpts.options)],
    ['execDay', parseSelectableValueIfPossible(whenOpts.options)],
    [
      'materialClassification',
      parseSelectableValueIfPossible(materialClassification.options),
    ],
    ['startDate', (value: string) => parseDateIfPossible(value)],
    ['endDate', (value: string) => parseDateIfPossible(value)],
  ]);
}
