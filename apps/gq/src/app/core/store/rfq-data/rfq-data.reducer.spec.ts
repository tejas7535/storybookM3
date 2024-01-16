import { RfqData } from '@gq/shared/models';
import { RfqStatus } from '@gq/shared/models/quotation-detail/rfq-status.enum';

import {
  QUOTATION_DETAIL_MOCK,
  RFQ_DATA_MOCK,
} from '../../../../testing/mocks';
import { RfqDataActions } from './rfq-data.actions';
import { initialState, rfqDataFeature } from './rfq-data.reducer';

describe('RfqDataReducer', () => {
  describe('get RfqData', () => {
    test('should set loading to true', () => {
      const action = RfqDataActions.getRfqData({
        sapId: '123',
        quotationItemId: 10,
      });
      const state = rfqDataFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        rfqDataLoading: true,
      });
    });

    test('should set loading to false and set rfqData', () => {
      const item: RfqData = {
        sapId: '123',
        currency: 'EUR',
        quotationItemId: 10,
        productionPlantNumber: '123',
        rfqId: '8512-12',
        materialNumber15: '009547-15-00',
      } as RfqData;
      const action = RfqDataActions.getRfqDataSuccess({
        item,
      });
      const state = rfqDataFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        rfqData: item,
        rfqDataLoading: false,
      });
    });

    test('should set ErrorMessage', () => {
      const errorMessage = 'this is an error message';
      const action = RfqDataActions.getRfqDataFailure({
        errorMessage,
      });
      const state = rfqDataFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        errorMessage,
        rfqDataLoading: false,
      });
    });

    test('should reset state', () => {
      const action = RfqDataActions.resetRfqData();
      const state = rfqDataFeature.reducer(
        { ...initialState, rfqData: { gqPositionId: '1234' } as RfqData },
        action
      );
      expect(state).toEqual(initialState);
    });
  });

  describe('ExtraSelectors', () => {
    test('should return true when rfqData and quotationDetail.rfqData are different', () => {
      expect(
        rfqDataFeature.getRfqDataUpdateAvl.projector(
          RFQ_DATA_MOCK,
          QUOTATION_DETAIL_MOCK
        )
      ).toBe(true);
    });

    test('should return false when rfqData and quotationDetail.rfqData are equal', () => {
      expect(
        rfqDataFeature.getRfqDataUpdateAvl.projector(
          {
            ...RFQ_DATA_MOCK,
            sqv: 1,
            status: RfqStatus.OPEN,
            productionPlantNumber: '123',
          },
          {
            ...QUOTATION_DETAIL_MOCK,
            rfqData: {
              ...QUOTATION_DETAIL_MOCK.rfqData,
              sqv: 1,
              status: RfqStatus.OPEN,
              productionPlant: {
                ...QUOTATION_DETAIL_MOCK.rfqData.productionPlant,
                plantNumber: '123',
              },
            },
          }
        )
      ).toBe(false);
    });
  });
});
