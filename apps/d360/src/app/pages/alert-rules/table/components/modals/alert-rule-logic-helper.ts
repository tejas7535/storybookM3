import { translate } from '@jsverse/transloco';

import { AlertRule } from '../../../../../feature/alert-rules/model';
import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { OptionsLoadingResult } from '../../../../../shared/services/selectable-options.service';
import {
  possibleWhenOptions,
  thresholdAlerts,
  ThresholdsRequiredForAlertType,
} from './alert-rule-edit-single-modal/alert-rule-options-config';

// TODO remove this and use this from the TableUploadModal
export interface ErrorMessage<DATA> {
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

const mandatoryDeleteFieldsAlertRule: (keyof Partial<AlertRule>)[] = [
  'region',
  'generation',
  'customerNumber',
  'materialNumber',
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
// and to asure no typos in the keys
const keyFieldTranslations = [
  () => translate('alert_rules.edit_modal.label.sales_area', {}),
  () => translate('alert_rules.edit_modal.label.sales_org', {}),
  () => translate('globalSelection.customer', {}),
  () => translate('alert_rules.edit_modal.label.sector_management', {}),
  () => translate('alert_rules.edit_modal.label.demandPlannerId', {}),
  () => translate('alert_rules.edit_modal.label.gkamNumber', {}),
];

/**
 * Implemented Checks:
 1. All 6 of the mandatory fields are filled
 2. At least one of the 6 key fields is filled
 3. Alert type and filled thresholds match
 4. Interval and Exec Day match
 * @param alertRule
 * @param thresholdRequirements
 */
export function checkAlertRuleData(
  alertRule: AlertRule,
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
    const allowedOptions = possibleWhenOptions[alertRule.execInterval];
    if (!allowedOptions.includes(alertRule.execDay)) {
      errors.push({
        dataIdentifier: alertRule,
        specificField: 'execDay',
        errorMessage: translate(
          'alert_rules.multi_modal.error.execDay_not_valid',
          {}
        ),
      });
    }
  }

  return errors;
}

export function mandatoryDeleteFieldCheckAlertRule(
  alertRule: AlertRule
): ErrorMessage<AlertRule>[] {
  const errors: ErrorMessage<AlertRule>[] = [];

  mandatoryDeleteFieldsAlertRule.forEach((mandatoryField) => {
    if (!alertRule[mandatoryField]) {
      errors.push({
        dataIdentifier: alertRule,
        specificField: mandatoryField,
        errorMessage: translate('generic.validation.missing_fields', {}),
      });
    }
  });

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
        errorMessage: translate('generic.validation.missing_fields', {}),
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
      errorMessage: translate('generic.validation.missing_fields', {}),
    };
  }

  return undefined;
}

export function getSpecialParseFunctions(
  alertTypes: OptionsLoadingResult,
  regionOptions: OptionsLoadingResult,
  salesAreaOptions: OptionsLoadingResult,
  salesOrgOptions: OptionsLoadingResult,
  sectorManagementOptions: OptionsLoadingResult,
  demandPlannerOptions: OptionsLoadingResult,
  gkamOptions: OptionsLoadingResult,
  productLineOptions: OptionsLoadingResult,
  intervalOpts: {
    id: string;
    text: string;
  }[],
  whenOpts: { id: string; text: string }[]
): Map<keyof AlertRule, (value: string) => string> {
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
    ['execInterval', parseSelectableValueIfPossible(intervalOpts)],
    ['execDay', parseSelectableValueIfPossible(whenOpts)],
    // TODO try to handle this in the service / component
    // ['startDate', parseDateIfPossible],
    // ['endDate', parseDateIfPossible],
  ]);
}

const parseSelectableValueIfPossible =
  (options: SelectableValue[]) =>
  (value: string): string => {
    const foundOpt = options?.find(
      (opt) =>
        opt.id.toLowerCase() === value.toLowerCase() ||
        (opt.text.toLocaleLowerCase() === value.toLowerCase() && value !== '')
    );

    return foundOpt ? foundOpt.id : value;
  };
