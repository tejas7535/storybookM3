import { LB_AXIAL_DISPLACEMENT } from '@mm/shared/constants/dialog-constant';

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
  isAxialDisplacement,
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

  describe('isAxialDisplacement Selector', () => {
    it('should return true when measurement method is LB_AXIAL_DISPLACEMENT', () => {
      const result = isAxialDisplacement.projector(LB_AXIAL_DISPLACEMENT);
      expect(result).toBe(true);
    });

    it('should return false when measurement method is not LB_AXIAL_DISPLACEMENT', () => {
      const result = isAxialDisplacement.projector('OTHER_METHOD');
      expect(result).toBe(false);
    });
  });

  describe('getSteps Selector', () => {
    it('should create steps with calculation options when isAxialBearing is true', () => {
      const bearing = { id: 'bearing1' } as Partial<Bearing> as Bearing;
      const bearingSeatId = 'seat1';
      const mountingMethod = 'method1';
      const isAxialBearing = true;
      const isAvailable = true;
      const optionsCalculationPerformed = true;

      const steps = getSteps.projector(
        bearing,
        bearingSeatId,
        mountingMethod,
        isAxialBearing,
        optionsCalculationPerformed,
        isAvailable
      );

      expect(steps).toMatchSnapshot();
    });

    it('should create steps without calculation options when isAxialBearing is false', () => {
      const bearing = { id: 'bearing1' } as Partial<Bearing> as Bearing;
      const bearingSeatId = 'seat1';
      const mountingMethod = 'method1';
      const isAxialBearing = false;
      const isAvailable = true;
      const optionsCalculationPerformed = true;

      const steps = getSteps.projector(
        bearing,
        bearingSeatId,
        mountingMethod,
        isAxialBearing,
        optionsCalculationPerformed,
        isAvailable
      );

      expect(steps).toMatchSnapshot();
    });

    it('should mark steps as incomplete when conditions are not met', () => {
      const bearing: Bearing = undefined;
      const bearingSeatId = '';
      const mountingMethod = '';
      const isAxialBearing = false;
      const isAvailable = false;
      const optionsCalculationPerformed = false;

      const steps = getSteps.projector(
        bearing,
        bearingSeatId,
        mountingMethod,
        isAxialBearing,
        optionsCalculationPerformed,
        isAvailable
      );

      expect(steps).toMatchSnapshot();
    });
  });
});
