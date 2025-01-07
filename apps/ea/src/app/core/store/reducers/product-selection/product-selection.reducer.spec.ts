import { Action, createAction, props } from '@ngrx/store';

import { ProductSelectionActions } from '../../actions';
import { Co2ApiSearchResult, ProductSelectionState } from '../../models';
import {
  initialState,
  productSelectionReducer,
  reducer,
} from './product-selection.reducer';

const MOCK_CO2_API_SEARCH_RESULT: Co2ApiSearchResult[] = [
  { bearinxId: 'abcd', epimId: '12345', designation: 'abcd' },
  { bearinxId: 'xyz', epimId: '9876', designation: 'xyz' },
];

describe('ProductSelectionReducer', () => {
  describe('Reducer function', () => {
    it('should return productSelectionReducer', () => {
      // prepare any action
      const action: Action = createAction(
        '[Mock] Action',
        props<{ query: string }>()
      );

      expect(reducer(initialState, action)).toEqual(
        productSelectionReducer(initialState, action)
      );
    });
  });

  describe('setBearingDesignation', () => {
    it('should set the bearing designation', () => {
      const originalState: ProductSelectionState = {
        ...initialState,
        bearingDesignation: 'abc',
        loadcaseTemplate: [],
        operatingConditionsTemplate: [],
      };

      const newState = productSelectionReducer(
        originalState,
        ProductSelectionActions.setBearingDesignation({
          bearingDesignation: 'def',
        })
      );

      expect(newState).toEqual({
        ...initialState,
        bearingDesignation: 'def',
      });
    });
  });

  describe('setBearingId', () => {
    it('should set the bearing id', () => {
      const originalState: ProductSelectionState = {
        ...initialState,
        bearingId: '123',
      };

      const newState = productSelectionReducer(
        originalState,
        ProductSelectionActions.setBearingId({ bearingId: '456' })
      );

      expect(newState).toEqual({
        ...initialState,
        bearingId: '456',
      });
    });
  });

  describe('setCalculationModuleInfo', () => {
    it('should set the module info', () => {
      const originalState: ProductSelectionState = {
        ...initialState,
      };

      const newState = productSelectionReducer(
        originalState,
        ProductSelectionActions.setCalculationModuleInfo({
          calculationModuleInfo: {
            catalogueCalculation: true,
            frictionCalculation: false,
          },
        })
      );

      expect(newState).toEqual({
        ...initialState,
        calculationModuleInfo: {
          catalogueCalculation: true,
          frictionCalculation: false,
        },
        error: {
          frictionApi: undefined,
        },
      });
    });
  });

  describe('setCanCalculate', () => {
    it('should set the co2DownstreamAvailable', () => {
      const originalState: ProductSelectionState = {
        ...initialState,
      };

      const newState = productSelectionReducer(
        originalState,
        ProductSelectionActions.setCanCalculate({
          co2DownstreamAvailable: true,
        })
      );

      expect(newState).toEqual({
        ...initialState,
        co2DownstreamAvailable: true,
      });
    });
  });

  describe('setProductFetchFailure', () => {
    it('should set the error', () => {
      const originalState: ProductSelectionState = {
        ...initialState,
        error: { moduleInfoApi: 'error' },
      };

      const newState = productSelectionReducer(
        originalState,
        ProductSelectionActions.setProductFetchFailure({
          error: { moduleInfoApi: 'error 2' },
        })
      );

      expect(newState).toEqual({
        ...initialState,
        error: { moduleInfoApi: 'error 2' },
      });
    });
  });

  describe('resetBearing', () => {
    it('should reset the bearing-related state to initial values', () => {
      const originalState: ProductSelectionState = {
        ...initialState,
        bearingResultList: MOCK_CO2_API_SEARCH_RESULT,
        loading: true,
      };
      const newState = productSelectionReducer(
        originalState,
        ProductSelectionActions.resetBearing()
      );
      expect(newState).toEqual(initialState);
    });
  });

  describe('searchBearing', () => {
    it('should set loading to true', () => {
      const originalState: ProductSelectionState = {
        ...initialState,
      };
      const newState = productSelectionReducer(
        originalState,
        ProductSelectionActions.searchBearing({ query: 'bearing' })
      );
      expect(newState.loading).toBe(true);
    });
  });

  describe('bearingSearchSuccess', () => {
    it('should update bearingResultList and set loading to false', () => {
      const originalState: ProductSelectionState = {
        ...initialState,
        loading: true,
      };
      const resultList = MOCK_CO2_API_SEARCH_RESULT;
      const newState = productSelectionReducer(
        originalState,
        ProductSelectionActions.bearingSearchSuccess({ resultList })
      );
      expect(newState.loading).toBe(false);
      expect(newState.bearingResultList).toEqual(resultList);
    });
  });
});
