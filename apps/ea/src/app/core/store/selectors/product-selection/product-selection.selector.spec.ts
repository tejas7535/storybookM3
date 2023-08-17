import {
  LOADCASE_ITEM,
  OPERATING_CONDITIONS_ITEM,
  PRODUCT_SELECTION_STATE_MOCK,
} from '@ea/testing/mocks';

import {
  getBearingDesignation,
  getBearingId,
  getCalculationModuleInfo,
  getLoadcaseTemplate,
  getLoadCaseTemplateItem,
  getOperatingConditionsTemplate,
  getOperatingConditionsTemplateItem,
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
      expect(
        getLoadCaseTemplateItem({ itemId: LOADCASE_ITEM.id })(mockState)
      ).toEqual(LOADCASE_ITEM);
    });
  });

  describe('getOperatingConditionsTemplateItem', () => {
    it('should return operating conditions template item', () => {
      expect(
        getOperatingConditionsTemplateItem({
          itemId: OPERATING_CONDITIONS_ITEM.id,
        })(mockState)
      ).toEqual(OPERATING_CONDITIONS_ITEM);
    });
  });
});
