import { PRODUCT_SELECTION_STATE_MOCK, TEMPLATE_ITEM } from '@ea/testing/mocks';

import {
  getBearingDesignation,
  getBearingId,
  getCalculationModuleInfo,
  getLoadcaseTemplate,
  getOperatingConditionsTemplate,
  getTemplateItem,
} from './product-selection.selector';

describe('Product Selection Selector', () => {
  const mockState = {
    productSelection: {
      ...PRODUCT_SELECTION_STATE_MOCK,
    },
  };

  describe('getBearingDesignation', () => {
    it('should return bearing designation', () => {
      expect(getBearingDesignation(mockState)).toEqual(
        PRODUCT_SELECTION_STATE_MOCK.bearingDesignation
      );
    });
  });

  describe('getBearingId', () => {
    it('should return bearing id', () => {
      expect(getBearingId(mockState)).toEqual(
        PRODUCT_SELECTION_STATE_MOCK.bearingId
      );
    });
  });

  describe('getCalculationModuleInfo', () => {
    it('should return module info', () => {
      expect(getCalculationModuleInfo(mockState)).toEqual(
        PRODUCT_SELECTION_STATE_MOCK.calculationModuleInfo
      );
    });
  });

  describe('getLoadcaseTemplate', () => {
    it('should return load case template', () => {
      expect(getLoadcaseTemplate(mockState)).toEqual(
        PRODUCT_SELECTION_STATE_MOCK.loadcaseTemplate
      );
    });
  });

  describe('getOperatingConditionsTemplate', () => {
    it('should return operating conditions template', () => {
      expect(getOperatingConditionsTemplate(mockState)).toEqual(
        PRODUCT_SELECTION_STATE_MOCK.operatingConditionsTemplate
      );
    });
  });

  describe('getLoadCaseTemplateItem', () => {
    it('should return load case template item', () => {
      expect(getTemplateItem({ itemId: TEMPLATE_ITEM.id })(mockState)).toEqual(
        TEMPLATE_ITEM
      );
    });
  });
});
