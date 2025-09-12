import { LB_AXIAL_DISPLACEMENT } from '@mm/shared/constants/dialog-constant';
import { StepType } from '@mm/shared/constants/steps';

import {
  getAvailableSteps,
  getBearing,
  getBearingSeatId,
  getBearingSeats,
  getBearingSeatStepIndex,
  getBearingSelectionLoading,
  getBearingsResultList,
  getCalculationOptionsStepIndex,
  getCurrentStep,
  getMeasurementMethod,
  getMeasurementMethods,
  getMeasuringMountingStepIndex,
  getMountingMethod,
  getMountingMethods,
  getResultStepIndex,
  getStepperState,
  getStoredStepConfiguration,
  getStoredStepIndices,
  getStoredSteps,
  isAxialDisplacement,
  isThermal,
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

  describe('Step Configuration Selectors', () => {
    const stepConfigurationState = {
      calculationSelection: {
        stepper: {
          currentStep: 2,
          stepConfiguration: {
            steps: [
              { type: StepType.BEARING, name: 'bearing', text: 'Bearing' },
              {
                type: StepType.BEARING_SEAT,
                name: 'seat',
                text: 'Bearing Seat',
              },
              {
                type: StepType.MEASURING_MOUNTING,
                name: 'mounting',
                text: 'Mounting',
              },
              { type: StepType.RESULT, name: 'result', text: 'Result' },
            ],
            stepIndices: {
              [StepType.BEARING]: 0,
              [StepType.BEARING_SEAT]: 1,
              [StepType.MEASURING_MOUNTING]: 2,
              [StepType.CALCULATION_OPTIONS]: -1,
              [StepType.RESULT]: 3,
            },
            availableSteps: [
              StepType.BEARING,
              StepType.BEARING_SEAT,
              StepType.MEASURING_MOUNTING,
              StepType.RESULT,
            ],
          },
        },
      },
    };

    describe('getStoredStepConfiguration', () => {
      it('should return step configuration when it exists', () => {
        const result = getStoredStepConfiguration(stepConfigurationState);
        expect(result).toEqual(
          stepConfigurationState.calculationSelection.stepper.stepConfiguration
        );
      });

      it('should return undefined when step configuration does not exist', () => {
        const emptyState = {
          calculationSelection: { stepper: { currentStep: 0 } },
        };
        const result = getStoredStepConfiguration(emptyState);
        expect(result).toBeUndefined();
      });

      it('should return undefined when stepper does not exist', () => {
        const emptyState = { calculationSelection: {} };
        const result = getStoredStepConfiguration(emptyState);
        expect(result).toBeUndefined();
      });
    });

    describe('getStoredStepIndices', () => {
      it('should return step indices when configuration exists', () => {
        const result = getStoredStepIndices(stepConfigurationState);
        expect(result).toEqual({
          [StepType.BEARING]: 0,
          [StepType.BEARING_SEAT]: 1,
          [StepType.MEASURING_MOUNTING]: 2,
          [StepType.CALCULATION_OPTIONS]: -1,
          [StepType.RESULT]: 3,
        });
      });

      it('should return empty object when configuration does not exist', () => {
        const emptyState = { calculationSelection: { stepper: {} } };
        const result = getStoredStepIndices(emptyState);
        expect(result).toEqual({});
      });
    });

    describe('getBearingSeatStepIndex', () => {
      it('should return bearing seat step index when available', () => {
        const result = getBearingSeatStepIndex(stepConfigurationState);
        expect(result).toBe(1);
      });

      it('should return undefined when bearing seat step is not available', () => {
        const stateWithoutSeat = {
          calculationSelection: {
            stepper: {
              stepConfiguration: {
                stepIndices: {
                  [StepType.BEARING_SEAT]: -1,
                },
              },
            },
          },
        };
        const result = getBearingSeatStepIndex(stateWithoutSeat);
        expect(result).toBeUndefined();
      });

      it('should return undefined when step indices are empty', () => {
        const emptyState = { calculationSelection: { stepper: {} } };
        const result = getBearingSeatStepIndex(emptyState);
        expect(result).toBeUndefined();
      });

      it('should return undefined when index is exactly -1', () => {
        const stateWithNegativeIndex = {
          calculationSelection: {
            stepper: {
              stepConfiguration: {
                stepIndices: {
                  [StepType.BEARING_SEAT]: -1,
                },
              },
            },
          },
        };
        const result = getBearingSeatStepIndex(stateWithNegativeIndex);
        expect(result).toBeUndefined();
      });

      it('should return index when it is 0', () => {
        const stateWithZeroIndex = {
          calculationSelection: {
            stepper: {
              stepConfiguration: {
                stepIndices: {
                  [StepType.BEARING_SEAT]: 0,
                },
              },
            },
          },
        };
        const result = getBearingSeatStepIndex(stateWithZeroIndex);
        expect(result).toBe(0);
      });
    });

    describe('getMeasuringMountingStepIndex', () => {
      it('should return measuring mounting step index when available', () => {
        const result = getMeasuringMountingStepIndex(stepConfigurationState);
        expect(result).toBe(2);
      });

      it('should return undefined when measuring mounting step is not available', () => {
        const stateWithoutMounting = {
          calculationSelection: {
            stepper: {
              stepConfiguration: {
                stepIndices: {
                  [StepType.MEASURING_MOUNTING]: -1,
                },
              },
            },
          },
        };
        const result = getMeasuringMountingStepIndex(stateWithoutMounting);
        expect(result).toBeUndefined();
      });

      it('should handle undefined stepIndices gracefully', () => {
        const stateWithoutIndices = {
          calculationSelection: {
            stepper: {
              stepConfiguration: {},
            },
          },
        };
        const result = getMeasuringMountingStepIndex(stateWithoutIndices);
        expect(result).toBeUndefined();
      });
    });

    describe('getCalculationOptionsStepIndex', () => {
      it('should return calculation options step index when available', () => {
        const stateWithOptions = {
          calculationSelection: {
            stepper: {
              stepConfiguration: {
                stepIndices: {
                  [StepType.CALCULATION_OPTIONS]: 2,
                },
              },
            },
          },
        };
        const result = getCalculationOptionsStepIndex(stateWithOptions);
        expect(result).toBe(2);
      });

      it('should return undefined when calculation options step is not available', () => {
        const result = getCalculationOptionsStepIndex(stepConfigurationState);
        expect(result).toBeUndefined();
      });
    });

    describe('getResultStepIndex', () => {
      it('should return result step index when available', () => {
        const result = getResultStepIndex(stepConfigurationState);
        expect(result).toBe(3);
      });

      it('should return undefined when result step is not available', () => {
        const stateWithoutResult = {
          calculationSelection: {
            stepper: {
              stepConfiguration: {
                stepIndices: {
                  [StepType.RESULT]: -1,
                },
              },
            },
          },
        };
        const result = getResultStepIndex(stateWithoutResult);
        expect(result).toBeUndefined();
      });
    });

    describe('getAvailableSteps', () => {
      it('should return available steps when configuration exists', () => {
        const result = getAvailableSteps(stepConfigurationState);
        expect(result).toEqual([
          StepType.BEARING,
          StepType.BEARING_SEAT,
          StepType.MEASURING_MOUNTING,
          StepType.RESULT,
        ]);
      });

      it('should return empty array when configuration does not exist', () => {
        const emptyState = { calculationSelection: { stepper: {} } };
        const result = getAvailableSteps(emptyState);
        expect(result).toEqual([]);
      });
    });

    describe('getStoredSteps', () => {
      it('should return steps when configuration exists', () => {
        const result = getStoredSteps(stepConfigurationState);
        expect(result).toEqual([
          { type: StepType.BEARING, name: 'bearing', text: 'Bearing' },
          { type: StepType.BEARING_SEAT, name: 'seat', text: 'Bearing Seat' },
          {
            type: StepType.MEASURING_MOUNTING,
            name: 'mounting',
            text: 'Mounting',
          },
          { type: StepType.RESULT, name: 'result', text: 'Result' },
        ]);
      });

      it('should return empty array when configuration does not exist', () => {
        const emptyState = { calculationSelection: { stepper: {} } };
        const result = getStoredSteps(emptyState);
        expect(result).toEqual([]);
      });
    });
  });

  describe('isThermal Selector', () => {
    it('should return true when bearing is thermal', () => {
      const stateWithThermalBearing = {
        bearing: { isThermal: true },
      };
      const result = isThermal.projector(stateWithThermalBearing as any);
      expect(result).toBe(true);
    });

    it('should return false when bearing is not thermal', () => {
      const stateWithoutThermalBearing = {
        bearing: { isThermal: false },
      };
      const result = isThermal.projector(stateWithoutThermalBearing as any);
      expect(result).toBe(false);
    });

    it('should handle undefined bearing gracefully', () => {
      const emptyState = {};
      const result = isThermal.projector(emptyState as any);
      expect(result).toBeUndefined();
    });
  });
});
