import { ListValue } from '@mm/shared/models/list-value.model';

import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { CalculationSelectionState } from '../../models/calculation-selection-state.model';
import {
  calculationSelectionReducer,
  initialState,
} from './calculation-selection.reducer';

describe('CalculationSelectionReducer', () => {
  describe('resetBearing action', () => {
    it('should reset state to initial state', () => {
      const modifiedState: CalculationSelectionState = {
        ...initialState,
        bearing: { bearingId: '123', title: 'Test Bearing' },
        loading: true,
      };

      const result = calculationSelectionReducer(
        modifiedState,
        CalculationSelectionActions.resetBearing()
      );

      expect(result).toEqual(initialState);
    });
  });

  describe('searchBearingList action', () => {
    it('should set loading to true and reset state', () => {
      const result = calculationSelectionReducer(
        initialState,
        CalculationSelectionActions.searchBearingList({
          query: '123',
        })
      );

      expect(result).toEqual({
        ...initialState,
        loading: true,
      });
    });
  });

  describe('searchBearingSuccess action', () => {
    it('should update bearingResultList and set loading to false', () => {
      const resultList = [{ id: '1', title: 'Bearing 1' }];
      const state = { ...initialState, loading: true };

      const result = calculationSelectionReducer(
        state,
        CalculationSelectionActions.searchBearingSuccess({ resultList })
      );

      expect(result).toEqual({
        ...initialState,
        bearingResultList: resultList,
        loading: false,
      });
    });
  });

  describe('setBearing action', () => {
    it('should update bearing property', () => {
      const bearingId = '123';
      const title = 'Test Bearing';

      const result = calculationSelectionReducer(
        initialState,
        CalculationSelectionActions.setBearing({ bearingId, title })
      );

      expect(result).toEqual({
        ...initialState,
        bearing: { bearingId, title },
      });
    });
  });

  describe('setCurrentStep action', () => {
    it('should update current step in stepper', () => {
      const step = 2;

      const result = calculationSelectionReducer(
        initialState,
        CalculationSelectionActions.setCurrentStep({ step })
      );

      expect(result).toEqual({
        ...initialState,
        stepper: {
          ...initialState.stepper,
          currentStep: step,
        },
      });
    });
  });

  describe('setBearingSeats action', () => {
    it('should update bearingSeats property', () => {
      const bearingSeats: ListValue[] = [{ id: '1', text: 'Seat 1' }];

      const result = calculationSelectionReducer(
        initialState,
        CalculationSelectionActions.setBearingSeats({ bearingSeats })
      );

      expect(result).toEqual({
        ...initialState,
        bearingSeats: {
          values: bearingSeats,
        },
      });
    });
  });

  describe('setBearingSeat action', () => {
    it('should update selected bearing seat and reset methods', () => {
      const bearingSeatId = '123';
      const stateWithSeats: CalculationSelectionState = {
        ...initialState,
        bearingSeats: {
          values: [{ id: '123', text: 'Seat 1' }],
        },
        measurementMethods: { values: [] },
        mountingMethods: { values: [] },
      };

      const result = calculationSelectionReducer(
        stateWithSeats,
        CalculationSelectionActions.setBearingSeat({ bearingSeatId })
      );

      expect(result).toEqual({
        ...initialState,
        bearingSeats: {
          values: [{ id: '123', text: 'Seat 1' }],
          selectedValueId: bearingSeatId,
        },
        measurementMethods: undefined,
        mountingMethods: undefined,
      });
    });
  });

  describe('fetchMeasurementMethods action', () => {
    it('should set loading to true', () => {
      const result = calculationSelectionReducer(
        initialState,
        CalculationSelectionActions.fetchMeasurementMethods()
      );

      expect(result).toEqual({
        ...initialState,
        loading: true,
      });
    });
  });

  describe('setMeasurementMethods action', () => {
    it('should update measurement methods and set loading to false', () => {
      const measurementMethods = [{ id: '1', text: 'Method 1' }];
      const state = { ...initialState, loading: true };

      const result = calculationSelectionReducer(
        state,
        CalculationSelectionActions.setMeasurementMethods({
          measurementMethods,
        })
      );

      expect(result).toEqual({
        ...initialState,
        measurementMethods: {
          values: measurementMethods,
        },
        loading: false,
      });
    });
  });

  describe('setMeasurementMethod action', () => {
    it('should update selected measurement method', () => {
      const measurementMethod = '123';
      const stateWithMethods: CalculationSelectionState = {
        ...initialState,
        measurementMethods: {
          values: [{ id: '123', text: 'Method 1' }],
        },
      };

      const result = calculationSelectionReducer(
        stateWithMethods,
        CalculationSelectionActions.setMeasurementMethod({ measurementMethod })
      );

      expect(result).toEqual({
        ...initialState,
        measurementMethods: {
          values: [{ id: '123', text: 'Method 1' }],
          selectedValueId: measurementMethod,
        },
      });
    });
  });

  describe('fetchMountingMethods action', () => {
    it('should set loading to true', () => {
      const result = calculationSelectionReducer(
        initialState,
        CalculationSelectionActions.fetchMountingMethods()
      );

      expect(result).toEqual({
        ...initialState,
        loading: true,
      });
    });
  });

  describe('setMountingMethods action', () => {
    it('should update mounting methods and set loading to false', () => {
      const mountingMethods: ListValue[] = [{ id: '1', text: 'Method 1' }];
      const state = { ...initialState, loading: true };

      const result = calculationSelectionReducer(
        state,
        CalculationSelectionActions.setMountingMethods({ mountingMethods })
      );

      expect(result).toEqual({
        ...initialState,
        mountingMethods: {
          values: mountingMethods,
        },
        loading: false,
      });
    });
  });

  describe('setMountingMethod action', () => {
    it('should update selected mounting method', () => {
      const mountingMethod = '123';
      const stateWithMethods: CalculationSelectionState = {
        ...initialState,
        mountingMethods: {
          values: [{ id: '123', text: 'Method 1' }],
        },
      };

      const result = calculationSelectionReducer(
        stateWithMethods,
        CalculationSelectionActions.setMountingMethod({ mountingMethod })
      );

      expect(result).toEqual({
        ...initialState,
        mountingMethods: {
          values: [{ id: '123', text: 'Method 1' }],
          selectedValueId: mountingMethod,
        },
      });
    });
  });
});
