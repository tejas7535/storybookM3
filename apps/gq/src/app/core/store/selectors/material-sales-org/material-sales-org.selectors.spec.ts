import { MATERIAL_SALESORG_MOCK } from '../../../../../testing/mocks';
import { MATERIAL_SALES_ORG_STATE_MOCK } from '../../../../../testing/mocks/state';
import * as materialSalesOrgSelectors from './material-sales-org.selector';

describe('material-sales-org Selector', () => {
  const fakeState = MATERIAL_SALES_ORG_STATE_MOCK;

  describe('get material-sales-org', () => {
    test('should return material sales org', () => {
      expect(
        materialSalesOrgSelectors.getMaterialSalesOrg.projector(fakeState)
      ).toEqual(fakeState.materialSalesOrg);
    });
  });
  describe('get material-sales-org loading', () => {
    test('should return material-sales-org Loading', () => {
      expect(
        materialSalesOrgSelectors.getMaterialSalesOrgLoading.projector(
          fakeState
        )
      ).toEqual(fakeState.materialSalesOrgLoading);
    });
  });
  describe('get material-sales-org available', () => {
    test('should return false if materialSalesOrg is undefined', () => {
      expect(
        materialSalesOrgSelectors.getMaterialSalesOrgDataAvailable.projector(
          fakeState
        )
      ).toBeFalsy();
    });
    test('should return false if materialSalesOrg is empty', () => {
      expect(
        materialSalesOrgSelectors.getMaterialSalesOrgDataAvailable.projector({
          ...MATERIAL_SALES_ORG_STATE_MOCK,
          materialSalesOrg: {},
        })
      ).toBeFalsy();
    });
    test('should return true on available materialSalesOrg', () => {
      expect(
        materialSalesOrgSelectors.getMaterialSalesOrgDataAvailable.projector({
          ...MATERIAL_SALES_ORG_STATE_MOCK,
          materialSalesOrg: MATERIAL_SALESORG_MOCK,
        })
      ).toBeTruthy();
    });
  });
});
