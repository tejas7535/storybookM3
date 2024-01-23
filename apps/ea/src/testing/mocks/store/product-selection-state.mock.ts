import { ProductSelectionState } from '@ea/core/store/models';

export const TEMPLATE_ITEM: ProductSelectionState['loadcaseTemplate'][number] =
  {
    id: 'abc',
    maximum: 0,
    minimum: 10,
    options: [],
    editable: true,
    visible: true,
    precision: 3,
    unit: 'abc',
    defaultValue: '2',
  };

export const PRODUCT_SELECTION_STATE_MOCK: ProductSelectionState = {
  bearingDesignation: 'my-bearing',
  bearingId: 'bearing-id',
  bearingResultList: [],
  calculationModuleInfo: {
    catalogueCalculation: true,
    frictionCalculation: false,
  },
  loadcaseTemplate: [{ ...TEMPLATE_ITEM }],
  operatingConditionsTemplate: [{ ...TEMPLATE_ITEM }],
};
