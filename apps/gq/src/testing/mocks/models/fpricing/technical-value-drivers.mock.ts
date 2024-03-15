import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';
import { ProductType } from '@gq/shared/models';
import { TechnicalValueDriver } from '@gq/shared/models/f-pricing/technical-value-driver.interface';

export const TECHNICAL_VALUE_DRIVERS_MOCK: TechnicalValueDriver = {
  productType: ProductType.CRB,
  topHeatTreatmentValue: 's1',
  topToleranceClassValue: 'P1',
  clearanceAxial: 'c1',
  heatTreatmentSurcharge: 0.05,
  clearanceAxialSurcharge: 0.08,
  clearanceRadialSurcharge: 0.05,
  engineeringEffortSurcharge: 0.01,
  toleranceClassSurcharge: 0.04,
};

export const TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK: TableItem[] = [
  {
    description: 'translate it',
    id: 1,
    value: 0.05,
    editableValue: 5,
    editableValueUnit: '%',
    additionalDescription: 'translate it',
  },
  {
    description: 'translate it',
    id: 2,
    value: 0.04,
    editableValue: 5,
    editableValueUnit: '%',
    additionalDescription: 'translate it',
  },
  {
    description: 'translate it',
    id: 3,
    value: 0.05,
    editableValue: 5,
    editableValueUnit: '%',
    additionalDescription: 'translate it',
  },
  {
    description: 'translate it',
    id: 4,
    value: 0.08,
    editableValue: 5,
    editableValueUnit: '%',
    additionalDescription: 'translate it',
  },
  {
    description: 'translate it',
    id: 5,
    value: 0.01,
    editableValue: 5,
    editableValueUnit: '%',
    additionalDescription: 'translate it',
  },
];

export const TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK_AFTER_MAPPING: TableItem[] =
  [
    { ...TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK[0], value: 'mappedValue' },
    { ...TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK[1], value: 'mappedValue' },
    { ...TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK[2], value: 'mappedValue' },
    { ...TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK[3], value: 'mappedValue' },
    { ...TECHNICAL_VALUE_DRIVERS_FOR_DISPLAY_MOCK[4], value: 'mappedValue' },
  ];
