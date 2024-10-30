// We get the threshold types from SAP (as a number as a string). Types 1 or 2 means we can change them.
import {
  AlertTypeDescription,
  ExecDay,
  ExecInterval,
} from '../../../../../../feature/alert-rules/model';

export const thresholdTypeWithParameter: readonly string[] = [
  '1',
  '2',
] as const;

export const thresholdAlerts = [
  'threshold1',
  'threshold2',
  'threshold3',
] as const;
export type ThresholdAlerts = (typeof thresholdAlerts)[number];

export type PossibleWhenOptionsType = {
  [key in ExecInterval]: ExecDay[];
};

export const possibleWhenOptions: PossibleWhenOptionsType = {
  M1: ['M01', 'M15'] as ExecDay[],
  M2: ['M01', 'M15'] as ExecDay[],
  M3: ['M01', 'M15'] as ExecDay[],
  M6: ['M01', 'M15'] as ExecDay[],
  W1: ['W6'] as ExecDay[],
  D1: ['D'] as ExecDay[],
} as const;

export const execIntervalOptions = ['M1', 'M2', 'M3', 'M6', 'W1', 'D1'];
export const whenOptions = ['M01', 'M15', 'W6', 'D'];

export interface ThresholdsRequiredForAlertType {
  alertType: string | undefined;
  threshold1: boolean;
  threshold2: boolean;
  threshold3: boolean;
}

export function getThresholdRequirements(
  alertRuleDescriptions: AlertTypeDescription[] | undefined
) {
  if (!alertRuleDescriptions) {
    return [
      {
        alertType: undefined,
        threshold1: false,
        threshold2: false,
        threshold3: false,
      },
    ];
  }

  return alertRuleDescriptions.map((alertTypeDefinition) => ({
    alertType: alertTypeDefinition.alertType,
    threshold1: thresholdTypeWithParameter.includes(
      alertTypeDefinition.threshold1Type
    ),
    threshold2: thresholdTypeWithParameter.includes(
      alertTypeDefinition.threshold2Type
    ),
    threshold3: thresholdTypeWithParameter.includes(
      alertTypeDefinition.threshold3Type
    ),
  }));
}
