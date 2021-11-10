import { SAP_PRICE_DETAILS_STATE_MOCK } from '../../../../../testing/mocks';
import * as sapPriceDetailsSelectors from './sap-price-details.selector';

describe('SapPriceDetails Selector', () => {
  const fakeState = SAP_PRICE_DETAILS_STATE_MOCK;

  describe('getSapPriceDetails', () => {
    test('should return sapPriceDetails', () => {
      expect(
        sapPriceDetailsSelectors.getSapPriceDetails.projector(fakeState)
      ).toEqual(fakeState.sapPriceDetails);
    });
  });
  describe('getSapPriceDetailsLoading', () => {
    test('should return sapPriceDetailsLoading', () => {
      expect(
        sapPriceDetailsSelectors.getSapPriceDetailsLoading.projector(fakeState)
      ).toEqual(fakeState.sapPriceDetailsLoading);
    });
  });
});
