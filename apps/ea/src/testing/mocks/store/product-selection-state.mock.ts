import { ProductSelectionState } from '@ea/core/store/models';

export const LOADCASE_ITEM: ProductSelectionState['loadcaseTemplate'][number] =
  {
    id: 'abc',
    maximum: 0,
    minimum: 10,
    options: [],
  };
export const OPERATING_CONDITIONS_ITEM: ProductSelectionState['operatingConditionsTemplate'][number] =
  {
    id: 'cde',
    maximum: 1,
    minimum: 10,
    options: [],
  };

export const PRODUCT_SELECTION_STATE_MOCK: ProductSelectionState = {
  bearingDesignation: 'my-bearing',
  bearingId: 'bearing-id',
  calculationModuleInfo: {
    catalogueCalculation: true,
    frictionCalculation: false,
  },
  loadcaseTemplate: [LOADCASE_ITEM],
  operatingConditionsTemplate: [OPERATING_CONDITIONS_ITEM],
};
