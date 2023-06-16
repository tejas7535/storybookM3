import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';

import { MATERIAL_SALESORG_MOCK } from '../../../../../testing/mocks/models';
import {
  loadMaterialSalesOrg,
  loadMaterialSalesOrgFailure,
  loadMaterialSalesOrgSuccess,
  MaterialSalesOrgActions,
} from './material-sales-org.actions';

describe('materialSalesOrg Action', () => {
  let action: MaterialSalesOrgActions;
  let errorMessage: string;

  beforeEach(() => {
    action = undefined;
    errorMessage = 'An error occurred';
  });

  describe('loadMaterialComparableCosts', () => {
    test('fetch', () => {
      const gqPositionId = '123';
      action = loadMaterialSalesOrg({ gqPositionId });
      expect(action).toEqual({
        gqPositionId,
        type: '[Detail View] Load Material Data For SalesOrg For Quotation Detail',
      });
    });
    test('fetch success', () => {
      const materialSalesOrg: MaterialSalesOrg = MATERIAL_SALESORG_MOCK;
      action = loadMaterialSalesOrgSuccess({
        materialSalesOrg,
      });
      expect(action).toEqual({
        materialSalesOrg,
        type: '[Detail View] Load Material Data For SalesOrgs For Quotation Detail Success',
      });
    });
    test('fetch failure', () => {
      action = loadMaterialSalesOrgFailure({ errorMessage });
      expect(action).toEqual({
        errorMessage,
        type: '[Detail View] Load Material Data For SalesOrgs For Quotation Detail Failure',
      });
    });
  });
});
