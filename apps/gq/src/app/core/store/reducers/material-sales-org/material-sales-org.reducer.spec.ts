import { MATERIAL_SALESORG_MOCK } from '../../../../../testing/mocks/models';
import { MATERIAL_SALES_ORG_STATE_MOCK } from '../../../../../testing/mocks/state';
import {
  loadMaterialSalesOrg,
  loadMaterialSalesOrgFailure,
  loadMaterialSalesOrgSuccess,
} from '../../actions';
import { materialSalesOrgReducer } from './material-sales-org.reducer';

describe('materialSalesOrgReducer', () => {
  describe('loadMaterialSalesOrg', () => {
    test('should set loadMaterialSalesOrgLoading', () => {
      const gqPositionId = '1234';

      expect(
        materialSalesOrgReducer(
          MATERIAL_SALES_ORG_STATE_MOCK,
          loadMaterialSalesOrg({ gqPositionId })
        )
      ).toEqual({
        ...MATERIAL_SALES_ORG_STATE_MOCK,
        gqPositionId,
        materialSalesOrgLoading: true,
      });
    });
  });
  describe('loadMaterialComparableCostsSuccess', () => {
    test('should set materialComparableCosts', () => {
      const materialSalesOrg = MATERIAL_SALESORG_MOCK;

      expect(
        materialSalesOrgReducer(
          MATERIAL_SALES_ORG_STATE_MOCK,
          loadMaterialSalesOrgSuccess({
            materialSalesOrg,
          })
        )
      ).toEqual({
        ...MATERIAL_SALES_ORG_STATE_MOCK,
        materialSalesOrg,
      });
    });
  });
  describe('loadMaterialComparableCostsFailure', () => {
    test('should set errorMessage', () => {
      const errorMessage = 'error';

      expect(
        materialSalesOrgReducer(
          MATERIAL_SALES_ORG_STATE_MOCK,
          loadMaterialSalesOrgFailure({ errorMessage })
        )
      ).toEqual({
        ...MATERIAL_SALES_ORG_STATE_MOCK,
        errorMessage,
      });
    });
  });
});
