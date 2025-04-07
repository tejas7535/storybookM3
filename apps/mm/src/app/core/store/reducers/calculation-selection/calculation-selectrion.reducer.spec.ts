import { BearingOption } from '@mm/shared/models';
import { ListValue } from '@mm/shared/models/list-value.model';

import { CalculationSelectionActions } from '../../actions/calculation-selection';
import {
  calculationSelectionReducer,
  initialState,
} from './calculation-selection.reducer';

describe('Calculation Selection Reducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'Unknown' } as any;
    const state = calculationSelectionReducer(undefined, action);
    expect(state).toBe(initialState);
  });

  it('should reset bearing', () => {
    const action = CalculationSelectionActions.resetBearing();
    const state = calculationSelectionReducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  it('should set loading to true on searchBearingList', () => {
    const action = CalculationSelectionActions.searchBearingList({
      query: '123',
    });
    const state = calculationSelectionReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('should set bearingResultList and loading to false on searchBearingSuccess', () => {
    const resultList: BearingOption[] = [
      { id: 'bearing1', title: '1' },
      { id: 'bearing2', title: '2' },
    ];
    const action = CalculationSelectionActions.searchBearingSuccess({
      resultList,
    });
    const state = calculationSelectionReducer(initialState, action);
    expect(state.bearingResultList).toEqual(resultList);
    expect(state.loading).toBe(false);
  });

  it('should set bearing on setBearing', () => {
    const bearingId = 'bearing1';
    const title = 'Bearing 1';
    const action = CalculationSelectionActions.setBearing({ bearingId, title });
    const state = calculationSelectionReducer(initialState, action);
    expect(state.bearing).toEqual({ bearingId, title });
  });

  it('should set current step on setCurrentStep', () => {
    const step = 2;
    const action = CalculationSelectionActions.setCurrentStep({ step });
    const state = calculationSelectionReducer(initialState, action);
    expect(state.stepper?.currentStep).toBe(step);
  });

  it('should set bearing seats on setBearingSeats', () => {
    const bearingSeats: ListValue[] = [
      { id: 'seat1', text: '1' },
      { id: 'seat2', text: '2' },
    ];
    const action = CalculationSelectionActions.setBearingSeats({
      bearingSeats,
    });
    const state = calculationSelectionReducer(initialState, action);
    expect(state.bearingSeats?.values).toEqual(bearingSeats);
  });

  it('should set selected bearing seat on setBearingSeat', () => {
    const bearingSeatId = 'seat1';
    const action = CalculationSelectionActions.setBearingSeat({
      bearingSeatId,
    });
    const state = calculationSelectionReducer(initialState, action);
    expect(state.bearingSeats?.selectedValueId).toBe(bearingSeatId);
  });
  it('should set measurement methods on setMeasurementMethods', () => {
    const measurementMethods: ListValue[] = [
      { id: 'method1', text: '1' },
      { id: 'method2', text: '2' },
    ];
    const action = CalculationSelectionActions.setMeasurementMethods({
      measurementMethods,
    });
    const state = calculationSelectionReducer(initialState, action);
    expect(state.measurementMethods?.values).toEqual(measurementMethods);
  });

  it('should set selected measurement method on setMeasurementMethod', () => {
    const measurementMethod = 'method1';
    const action = CalculationSelectionActions.setMeasurementMethod({
      measurementMethod,
    });
    const state = calculationSelectionReducer(initialState, action);
    expect(state.measurementMethods?.selectedValueId).toBe(measurementMethod);
  });

  it('should set mounting methods on setMountingMethods', () => {
    const mountingMethods: ListValue[] = [
      { id: 'method1', text: '1' },
      { id: 'method2', text: '2' },
    ];
    const action = CalculationSelectionActions.setMountingMethods({
      mountingMethods,
    });
    const state = calculationSelectionReducer(initialState, action);
    expect(state.mountingMethods?.values).toEqual(mountingMethods);
  });

  it('should set selected mounting method on setMountingMethod', () => {
    const mountingMethod = 'method1';
    const action = CalculationSelectionActions.setMountingMethod({
      mountingMethod,
    });
    const state = calculationSelectionReducer(initialState, action);
    expect(state.mountingMethods?.selectedValueId).toBe(mountingMethod);
  });
});
