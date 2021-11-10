import { Action } from '@ngrx/store';

import {
  SAP_PRICE_DETAIL_MOCK,
  SAP_PRICE_DETAILS_STATE_MOCK,
} from '../../../../../testing/mocks';
import {
  loadSapPriceDetails,
  loadSapPriceDetailsFailure,
  loadSapPriceDetailsSuccess,
} from '../../actions/sap-price-details/sap-price-details.actions';
import { reducer, sapPriceDetailsReducer } from './sap-price-details.reducer';

describe('SapPriceDetails Reducer', () => {
  describe('loadSapPriceDetails', () => {
    test('should set sapPriceDetailsLoading', () => {
      const gqPositionId = '1234';
      const action = loadSapPriceDetails({ gqPositionId });

      const state = sapPriceDetailsReducer(
        SAP_PRICE_DETAILS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...SAP_PRICE_DETAILS_STATE_MOCK,
        gqPositionId,
        sapPriceDetailsLoading: true,
        sapPriceDetails: [],
        errorMessage: undefined,
      });
    });
  });
  describe('loadSapPriceDetailsSuccess', () => {
    test('should set sapPriceDetails', () => {
      const sapPriceDetails = [SAP_PRICE_DETAIL_MOCK];
      const action = loadSapPriceDetailsSuccess({ sapPriceDetails });

      const state = sapPriceDetailsReducer(
        SAP_PRICE_DETAILS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...SAP_PRICE_DETAILS_STATE_MOCK,
        sapPriceDetails,
        errorMessage: undefined,
        sapPriceDetailsLoading: false,
      });
    });
  });
  describe('loadSapPriceDetailsFailure', () => {
    test('should set errorMessage', () => {
      const errorMessage = 'error';
      const action = loadSapPriceDetailsFailure({ errorMessage });

      const state = sapPriceDetailsReducer(
        SAP_PRICE_DETAILS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...SAP_PRICE_DETAILS_STATE_MOCK,
        errorMessage,
        sapPriceDetailsLoading: false,
        sapPriceDetails: [],
      });
    });
  });
  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      const action: Action = loadSapPriceDetails({ gqPositionId: '123' });
      expect(reducer(SAP_PRICE_DETAILS_STATE_MOCK, action)).toEqual(
        sapPriceDetailsReducer(SAP_PRICE_DETAILS_STATE_MOCK, action)
      );
    });
  });
});
