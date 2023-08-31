import { QuotationDetail } from '@gq/shared/models';

import { MATERIAL_COST_DETAILS_MOCK } from '../../../../../testing/mocks';
import * as materialCostDetailsSelectors from './material-cost-details.selectors';

describe('Material Cost Details Selectors', () => {
  const fakeState = {
    materialCostDetails: {
      materialCostDetails: MATERIAL_COST_DETAILS_MOCK,
      materialCostDetailsLoading: false,
      errorMessage: 'errorMessage',
    },
  };

  describe('getMaterialCostDetails', () => {
    test('should return materialCostDetails', () => {
      expect(
        materialCostDetailsSelectors.getMaterialCostDetails.projector(
          fakeState.materialCostDetails
        )
      ).toEqual(fakeState.materialCostDetails.materialCostDetails);
    });
  });
  describe('getMaterialCostDetailsLoading', () => {
    test('should return materialCostDetails loading', () => {
      expect(
        materialCostDetailsSelectors.getMaterialCostDetailsLoading.projector(
          fakeState.materialCostDetails
        )
      ).toEqual(fakeState.materialCostDetails.materialCostDetailsLoading);
    });
  });
  describe('getMaterialCostUpdateAvl', () => {
    test('should return true if gpcYear differs', () => {
      expect(
        materialCostDetailsSelectors.getMaterialCostUpdateAvl.projector(
          fakeState.materialCostDetails.materialCostDetails,
          { gpcYear: 2023, sqvDate: '2022-01-01' } as QuotationDetail
        )
      ).toBeTruthy();
    });
    test('should return true if sqvDate differs', () => {
      expect(
        materialCostDetailsSelectors.getMaterialCostUpdateAvl.projector(
          fakeState.materialCostDetails.materialCostDetails,
          { gpcYear: 2022, sqvDate: '2022-01-05' } as QuotationDetail
        )
      ).toBeTruthy();
    });

    test('should return false if sqvDate and gpcYear and gpc value match', () => {
      expect(
        materialCostDetailsSelectors.getMaterialCostUpdateAvl.projector(
          fakeState.materialCostDetails.materialCostDetails,
          { gpcYear: 2022, sqvDate: '2022-01-01', gpc: 456 } as QuotationDetail
        )
      ).toBeFalsy();
    });

    test('should return false if cost details undefined', () => {
      expect(
        materialCostDetailsSelectors.getMaterialCostUpdateAvl.projector(
          undefined,
          { gpcYear: 2022, sqvDate: '2022-01-01' } as QuotationDetail
        )
      ).toBeFalsy();
    });

    test('should return true if selected detail not fully defined', () => {
      expect(
        materialCostDetailsSelectors.getMaterialCostUpdateAvl.projector(
          fakeState.materialCostDetails.materialCostDetails,
          undefined as unknown as QuotationDetail
        )
      ).toBeTruthy();
    });

    test('should return true if gpc value differs', () => {
      expect(
        materialCostDetailsSelectors.getMaterialCostUpdateAvl.projector(
          fakeState.materialCostDetails.materialCostDetails,
          { gpcYear: 2022, sqvDate: '2022-01-01', gpc: 432 } as QuotationDetail
        )
      ).toBeTruthy();
    });
  });
});
