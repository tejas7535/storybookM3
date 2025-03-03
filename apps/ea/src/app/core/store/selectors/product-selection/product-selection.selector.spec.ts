import { PRODUCT_SELECTION_STATE_MOCK, TEMPLATE_ITEM } from '@ea/testing/mocks';

import {
  getBearingDesignation,
  getBearingId,
  getLoadcaseTemplate,
  getOperatingConditionsTemplate,
  getTemplateItem,
  getTemplates,
  isBearingSupported,
  isCo2DownstreamCalculationPossible,
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

  describe('isBearingSupported', () => {
    it('should return if bearing designation is supported', () => {
      expect(
        isBearingSupported({
          ...mockState,
          productSelection: {
            ...PRODUCT_SELECTION_STATE_MOCK,
            bearingProductClass: 'IDO_CATALOGUE_BEARING',
          },
        })
      ).toEqual(true);

      expect(
        isBearingSupported({
          ...mockState,
          productSelection: {
            ...PRODUCT_SELECTION_STATE_MOCK,
            bearingProductClass: 'abc',
          },
        })
      ).toEqual(false);
    });
    it('should say the bearing is supported when the API is unreachable', () => {
      expect(
        isBearingSupported({
          ...mockState,
          productSelection: {
            ...PRODUCT_SELECTION_STATE_MOCK,
            error: { catalogApi: 'failed to fetch' },
          },
        })
      ).toEqual(true);
    });
  });

  describe('getBearingId', () => {
    it('should return bearing id', () => {
      expect(getBearingId(mockState)).toEqual(
        PRODUCT_SELECTION_STATE_MOCK.bearingId
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

  describe('getTemplates', () => {
    it('should return the templates', () => {
      expect(getTemplates(mockState)).toEqual({
        loadcaseTemplate: PRODUCT_SELECTION_STATE_MOCK.loadcaseTemplate,
        operatingConditionsTemplate:
          PRODUCT_SELECTION_STATE_MOCK.operatingConditionsTemplate,
      });
    });
  });

  describe('isCo2DownstreamCalculationPossible', () => {
    it('should return true if frictionCalculation in moduleInfo is true and model exists for designation', () => {
      expect(
        isCo2DownstreamCalculationPossible({
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingDesignation: 'designation',
            co2DownstreamAvailable: true,
          },
        })
      ).toEqual(true);
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
