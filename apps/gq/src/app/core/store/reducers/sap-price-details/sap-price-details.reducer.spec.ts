import { Action } from '@ngrx/store';

import {
  EXTENDED_SAP_PRICE_DETAIL_MOCK,
  SAP_PRICE_DETAIL_ZMIN_MOCK,
  SAP_PRICE_DETAILS_STATE_MOCK,
} from '../../../../../testing/mocks';
import {
  loadExtendedSapPriceConditionDetails,
  loadExtendedSapPriceConditionDetailsFailure,
  loadExtendedSapPriceConditionDetailsSuccess,
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
      const sapPriceDetails = [SAP_PRICE_DETAIL_ZMIN_MOCK];
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
  describe('loadExtendedSapPriceConditionDetails', () => {
    test('should set extendedSapPriceConditionDetails', () => {
      const quotationNumber = 1234;
      const action = loadExtendedSapPriceConditionDetails({ quotationNumber });

      const state = sapPriceDetailsReducer(
        SAP_PRICE_DETAILS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...SAP_PRICE_DETAILS_STATE_MOCK,
        sapPriceDetailsLoading: true,
        errorMessage: undefined,
      });
    });
  });
  describe('loadExtendedSapPriceDetailsSuccess', () => {
    test('should set extendedSapPriceDetails', () => {
      const extendedSapPriceConditionDetails = [EXTENDED_SAP_PRICE_DETAIL_MOCK];
      const action = loadExtendedSapPriceConditionDetailsSuccess({
        extendedSapPriceConditionDetails,
      });

      const state = sapPriceDetailsReducer(
        SAP_PRICE_DETAILS_STATE_MOCK,
        action
      );

      expect(state).toEqual({
        ...SAP_PRICE_DETAILS_STATE_MOCK,
        extendedSapPriceConditionDetails,
        errorMessage: undefined,
        sapPriceDetailsLoading: false,
      });
    });
  });

  describe('loadExtendedSapPriceDetailsFailure', () => {
    test('should set errorMessage', () => {
      const errorMessage = 'error';
      const action = loadExtendedSapPriceConditionDetailsFailure({
        errorMessage,
      });

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
});
