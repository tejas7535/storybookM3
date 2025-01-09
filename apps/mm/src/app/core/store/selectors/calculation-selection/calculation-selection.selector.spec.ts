import { Bearing } from '../../models/calculation-selection-state.model';
import {
  getBearing,
  getBearingSeatId,
  getBearingSeats,
  getBearingSelectionLoading,
  getBearingsResultList,
  getCurrentStep,
  getMeasurementMethod,
  getMeasurementMethods,
  getMountingMethod,
  getMountingMethods,
  getStepperState,
  getSteps,
} from './calculation-selection.selector';

describe('Calculation Selection Selectors', () => {
  const initialState = {
    stepper: { currentStep: 2 },
    bearing: { id: 'bearing1' },
    bearingResultList: [{ id: 'result1' }],
    loading: true,
    bearingSeats: { selectedValueId: 'seat1', list: [{ id: 'seat1' }] },
    measurementMethods: {
      selectedValueId: 'method1',
      list: [{ id: 'method1' }],
    },
    mountingMethods: {
      selectedValueId: 'mounting1',
      list: [{ id: 'mounting1' }],
    },
  };

  const state = {
    calculationSelection: initialState,
  };

  it('should select the stepper state', () => {
    const result = getStepperState(state);
    expect(result).toEqual(initialState.stepper);
  });

  it('should select the current step', () => {
    const result = getCurrentStep(state);
    expect(result).toEqual(initialState.stepper.currentStep);
  });

  it('should select the bearing', () => {
    const result = getBearing(state);
    expect(result).toEqual(initialState.bearing);
  });

  it('should select the bearings result list', () => {
    const result = getBearingsResultList(state);
    expect(result).toEqual(initialState.bearingResultList);
  });

  it('should select the loading state', () => {
    const result = getBearingSelectionLoading(state);
    expect(result).toEqual(initialState.loading);
  });

  it('should select the bearing seat id', () => {
    const result = getBearingSeatId(state);
    expect(result).toEqual(initialState.bearingSeats.selectedValueId);
  });

  it('should select the bearing seats', () => {
    const result = getBearingSeats(state);
    expect(result).toEqual(initialState.bearingSeats);
  });

  it('should select the measurement method id', () => {
    const result = getMeasurementMethod(state);
    expect(result).toEqual(initialState.measurementMethods.selectedValueId);
  });

  it('should select the measurement methods', () => {
    const result = getMeasurementMethods(state);
    expect(result).toEqual(initialState.measurementMethods);
  });

  it('should select the mounting methods', () => {
    const result = getMountingMethods(state);
    expect(result).toEqual(initialState.mountingMethods);
  });

  it('should select the mounting method id', () => {
    const result = getMountingMethod(state);
    expect(result).toEqual(initialState.mountingMethods.selectedValueId);
  });

  describe('getSteps Selector', () => {
    const initState = {
      bearing: { id: 'bearing1' } as Partial<Bearing> as Bearing,
      bearingSeatId: 'seat1',
      mountingMethod: 'method1',
      measurementMethod: 'LB_AXIAL_DISPLACEMENT',
      isAvailable: true,
    };

    it('should return steps with correct properties', () => {
      const result = getSteps.projector(
        initState.bearing,
        initState.bearingSeatId,
        initState.mountingMethod,
        initState.measurementMethod,
        initState.isAvailable
      );

      expect(result).toMatchSnapshot();
    });
  });
});
