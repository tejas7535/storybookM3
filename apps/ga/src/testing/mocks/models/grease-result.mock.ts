import { LabelValue } from '@schaeffler/label-value';

import {
  CONCEPT1,
  GreaseResult,
  GreaseResultData,
  GreaseResultDataSourceItem,
  GreaseResultItem,
  GreaseSelectionResult,
  InitialLubricationResult,
  PerformanceResult,
  RelubricationResult,
  ResultSectionRaw,
} from '@ga/features/grease-calculation/calculation-result/models';

import { GREASE_CONCEPT1_SUITABILITY } from './grease-concept1-suitability.mock';

export const greaseResultDataItemValuesMock = (
  value: number | string,
  unit?: string
): string =>
  `<span>${value} g/${Math.round(
    +value / 24
  )} days</span><br><span class="text-low-emphasis">${value} ${unit}/${Math.round(
    +value / 24
  )} days</span>`;

export const greaseResultDataMock = (
  value: number | string,
  unit?: string
): GreaseResultData => [
  {
    title: 'initialGreaseQuantity',
    values: `<span>${(+value).toFixed(1)} g</span><br><span class="text-low-emphasis">${(+value).toFixed(1)} ${unit}</span>`,
  },
  {
    title: 'relubricationPer365days',
    values: `<span>${(+value * 365).toFixed(1)} g/365 days</span><br><span class="text-low-emphasis">${(
      +value * 365
    ).toFixed(1)} ${unit}/365 days</span>`,
    tooltip: 'relubricationQuantityPer365daysTooltip',
  },
  {
    title: 'relubricationQuantityPer1000OperatingHours',
    values: `<span>${((+value / 24) * 1000).toFixed(
      1
    )} g/hours</span><br><span class="text-low-emphasis">${(
      (+value / 24) *
      1000
    ).toFixed(1)} ${unit}/hours</span>`,
  },
  {
    title: 'greaseServiceLife',
    values: `~ ${Math.round(+value / 24)} days`,
  },
  {
    title: 'relubricationPer30days',
    values: `<span>${(+value * 30).toFixed(
      1
    )} g/30 days</span><br><span class="text-low-emphasis">${(
      +value * 30
    ).toFixed(1)} ${unit}/30 days</span>`,
  },
  {
    title: 'relubricationPer7days',
    values: `<span>${(+value * 7).toFixed(
      1
    )} g/7 days</span><br><span class="text-low-emphasis">${(
      +value * 7
    ).toFixed(1)} ${unit}/7 days</span>`,
  },
  {
    title: 'viscosityRatio',
    values: `${value}`,
  },
  {
    title: 'baseOilViscosityAt40',
    values: `${value} ${unit}`,
  },
  {
    title: 'lowerTemperatureLimit',
    values: `${value} ${unit}`,
    tooltip: 'lowerTemperatureLimitTooltip',
  },
  {
    title: 'upperTemperatureLimit',
    values: `${value} ${unit}`,
    tooltip: 'upperTemperatureLimitTooltip',
  },
  {
    title: 'additiveRequired',
    values: `${value}`,
    tooltip: 'additiveRequiredTooltip',
  },
  {
    title: 'effectiveEpAdditivation',
    values: `${value}`,
  },
  {
    title: 'density',
    values: `${value} ${unit}`,
  },
  {
    title: 'lowFriction',
    values: '0 (suitable)',
  },
  {
    title: 'suitableForVibrations',
    values: '0 (suitable)',
  },
  {
    title: 'supportForSeals',
    values: '0 (suitable)',
  },
  {
    title: 'h1Registration',
    values: `${value}`,
  },
];

export const greaseResultItemMock = (
  value: number | string,
  unit?: string
): GreaseResultItem[] => [
  {
    title: 'initialGreaseQuantity',
    value: +value,
    prefix: '',
    unit,
    secondaryValue: +value,
    secondaryPrefix: '',
    secondaryUnit: unit,
  },
  {
    title: 'relubricationPer365days',
    value: +value * 365,
    prefix: '',
    unit: 'g/365 days',
    secondaryValue: +value * 365,
    secondaryPrefix: '',
    secondaryUnit: `${unit}/365 days`,
    tooltip: 'relubricationQuantityPer365daysTooltip',
  },
  {
    title: 'relubricationQuantityPer1000OperatingHours',
    value: (+value / 24) * 1000,
    prefix: '',
    unit: 'g/hours',
    secondaryValue: (+value / 24) * 1000,
    secondaryPrefix: '',
    secondaryUnit: `${unit}/hours`,
  },
  {
    title: 'greaseServiceLife',
    value: Math.round(+value / 24),
    prefix: '~',
    unit: 'days',
  },
  {
    title: 'relubricationPer30days',
    value: Number.parseFloat((+value * 30).toFixed(1)),
    prefix: '',
    unit: 'g/30 days',
    secondaryValue: Number.parseFloat((+value * 30).toFixed(1)),
    secondaryPrefix: '',
    secondaryUnit: `${unit}/30 days`,
  },
  {
    title: 'relubricationPer7days',
    value: Number.parseFloat((+value * 7).toFixed(1)),
    prefix: '',
    unit: 'g/7 days',
    secondaryValue: Number.parseFloat((+value * 7).toFixed(1)),
    secondaryPrefix: '',
    secondaryUnit: `${unit}/7 days`,
  },
  {
    title: 'viscosityRatio',
    value: +value,
  },
  {
    title: 'baseOilViscosityAt40',
    value: +value,
    unit,
  },
  {
    title: 'lowerTemperatureLimit',
    value: +value,
    unit,
    tooltip: 'lowerTemperatureLimitTooltip',
  },
  {
    title: 'upperTemperatureLimit',
    value: +value,
    unit,
    tooltip: 'upperTemperatureLimitTooltip',
  },
  {
    title: 'additiveRequired',
    value: `${value}`,
    tooltip: 'additiveRequiredTooltip',
  },
  {
    title: 'effectiveEpAdditivation',
    value: `${value}`,
  },
  {
    title: 'density',
    value: +value,
    unit,
  },
  {
    title: 'lowFriction',
    value: '0 (suitable)',
  },
  {
    title: 'suitableForVibrations',
    value: '0 (suitable)',
  },
  {
    title: 'supportForSeals',
    value: '0 (suitable)',
  },
  {
    title: 'h1Registration',
    value: `${value}`,
  },
];

export const greaseResultMock: GreaseResult = {
  mainTitle: 'Arcanol MULTI2',
  subTitle: 'Mineral oil',
  isSufficient: true,
  isPreferred: false,
  isRecommended: false,
  isMiscible: false,
} as GreaseResult;

export const initialLubricationMock: ResultSectionRaw &
  InitialLubricationResult = {
  initialGreaseQuantity: {
    title: 'initialGreaseQuantity',
    value: 100,
    prefix: '',
    unit: 'g',
    secondaryValue: 100,
    secondaryPrefix: '',
    secondaryUnit: 'g',
  },
};

export const performanceMock: ResultSectionRaw & PerformanceResult = {
  viscosityRatio: {
    title: 'viscosityRatio',
    value: 0.8,
  },
  additiveRequired: {
    title: 'additiveRequired',
    value: '0 (suitable)',
    tooltip: 'additiveRequiredTooltip',
  },
  lowFriction: {
    title: 'lowFriction',
    value: '0 (suitable)',
  },
  suitableForVibrations: {
    title: 'suitableForVibrations',
    value: '0 (suitable)',
  },
  supportForSeals: {
    title: 'supportForSeals',
    value: '0 (suitable)',
  },
  effectiveEpAdditivation: {
    title: 'effectiveEpAdditivation',
    value: '0 (suitable)',
  },
};

export const relubricationMock: ResultSectionRaw & RelubricationResult = {
  relubricationQuantityPer1000OperatingHours: {
    title: 'relubricationQuantityPer1000OperatingHours',
    value: 50,
    prefix: '',
    unit: 'g/hours',
    secondaryValue: 50,
    secondaryPrefix: '',
    secondaryUnit: 'g/hours',
  },
  relubricationPer365Days: {
    title: 'relubricationPer365Days',
    value: 200,
    prefix: '',
    unit: 'g/365 days',
    secondaryValue: 200,
    secondaryPrefix: '',
    secondaryUnit: 'g/365 days',
    tooltip: 'relubricationQuantityPer365daysTooltip',
  },
  relubricationPer30Days: {
    title: 'relubricationPer30Days',
    value: 20,
    prefix: '',
    unit: 'g/30 days',
    secondaryValue: 20,
    secondaryPrefix: '',
    secondaryUnit: 'g/30 days',
  },
  concept1: {
    title: CONCEPT1,
    custom: {
      selector: CONCEPT1,
      data: GREASE_CONCEPT1_SUITABILITY,
    },
  },
  maximumManualRelubricationPerInterval: {
    title: 'maximumManualRelubricationPerInterval',
    value: 100,
    prefix: '',
    unit: 'g',
    secondaryValue: 100,
    secondaryPrefix: '',
    secondaryUnit: 'g',
  },
  relubricationInterval: {
    title: 'relubricationInterval',
    value: 30,
    prefix: '',
    unit: 'days',
    secondaryValue: 30,
    secondaryPrefix: '',
    secondaryUnit: 'days',
  },
  relubricationPer7Days: {
    title: 'relubricationPer7Days',
    value: 10,
    prefix: '',
    unit: 'g/7 days',
    secondaryValue: 10,
    secondaryPrefix: '',
    secondaryUnit: 'g/7 days',
  },
};

export const greaseSelectionMock: ResultSectionRaw & GreaseSelectionResult = {
  greaseServiceLife: {
    title: 'greaseServiceLife',
    value: 100,
    prefix: '~',
    unit: 'days',
  },
  baseOilViscosityAt40: {
    title: 'baseOilViscosityAt40',
    value: 100,
    unit: 'mm²/s',
  },
  lowerTemperatureLimit: {
    title: 'lowerTemperatureLimit',
    value: -20,
    unit: '°C',
    tooltip: 'lowerTemperatureLimitTooltip',
  },
  upperTemperatureLimit: {
    title: 'upperTemperatureLimit',
    value: 120,
    unit: '°C',
    tooltip: 'upperTemperatureLimitTooltip',
  },
  density: {
    title: 'density',
    value: 0.9,
    unit: 'g/cm³',
  },
  h1Registration: {
    title: 'h1Registration',
    value: '0 (suitable)',
  },
};

export const greaseResultConcept1Mock: GreaseResultDataSourceItem = {
  title: 'concept1',
  custom: {
    selector: CONCEPT1,
    data: GREASE_CONCEPT1_SUITABILITY,
  },
};

export const CONCEPT1_LABEL_VALUE_MOCK: LabelValue[] = [
  {
    label: 'mockLabel',
    value: 'mockValue',
  },
  {
    label: CONCEPT1,
    custom: {
      selector: CONCEPT1,
      data: GREASE_CONCEPT1_SUITABILITY,
    },
  },
];
