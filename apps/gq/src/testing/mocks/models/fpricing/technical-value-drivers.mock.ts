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
    value: '5%',
    editableValue: 5,
    editableValueUnit: '%',
    additionalDescription: 'translate it',
  },
  {
    description: 'translate it',
    id: 2,
    value: '4%',
    editableValue: 5,
    editableValueUnit: '%',
    additionalDescription: 'translate it',
  },
  {
    description: 'translate it',
    id: 3,
    value: '5%',
    editableValue: 5,
    editableValueUnit: '%',
    additionalDescription: 'translate it',
  },
  {
    description: 'translate it',
    id: 4,
    value: '8%',
    editableValue: 5,
    editableValueUnit: '%',
    additionalDescription: 'translate it',
  },
  {
    description: 'translate it',
    id: 5,
    value: '1%',
    editableValue: 5,
    editableValueUnit: '%',
    additionalDescription: 'translate it',
  },
];
