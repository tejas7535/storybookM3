import { LabelValue } from '@schaeffler/label-value';

import {
  CONCEPT1,
  GreaseResult,
  GreaseResultData,
  GreaseResultDataSourceItem,
} from '@ga/features/grease-calculation/calculation-result/models';

import { GREASE_CONCEPT1_SUITABILITY } from './grease-concept1-suitability.mock';
import {
  dataItemUnitMock,
  dataItemValueNumberMock,
} from './grease-report-subordinate-data.mock';

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
    values: `<span>${value} g</span><br><span class="text-low-emphasis">${value} ${unit}</span>`,
  },
  {
    title: 'relubricationPer365days',
    values: `<span>${
      +value * 365
    } g/365 days</span><br><span class="text-low-emphasis">${
      +value * 365
    } ${unit}/365 days</span>`,
    tooltip: 'relubricationQuantityPer365daysTooltip',
  },
  {
    title: 'relubricationQuantityPer1000OperatingHours',
    values: `<span>${
      (+value / 24) * 1000
    } g/hours</span><br><span class="text-low-emphasis">${
      (+value / 24) * 1000
    } ${unit}/hours</span>`,
  },
  {
    title: 'greaseServiceLife',
    values: `~ ${Math.round(+value / 24)} days`,
  },
  {
    title: 'relubricationPer30days',
    values: `<span>${
      +value * 30
    } g/30 days</span><br><span class="text-low-emphasis">${
      +value * 30
    } ${unit}/30 days</span>`,
  },
  {
    title: 'relubricationPer7days',
    values: `<span>${
      +value * 7
    } g/7 days</span><br><span class="text-low-emphasis">${
      +value * 7
    } ${unit}/7 days</span>`,
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

export const greaseResultMock: GreaseResult = {
  mainTitle: 'Arcanol MULTI2',
  subTitle: 'Mineral oil',
  isSufficient: true,
  dataSource: greaseResultDataMock(dataItemValueNumberMock, dataItemUnitMock),
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
