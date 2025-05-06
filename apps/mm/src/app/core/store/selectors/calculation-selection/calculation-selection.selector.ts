import { LB_AXIAL_DISPLACEMENT } from '@mm/shared/constants/dialog-constant';
import { STEP_CONFIG } from '@mm/shared/constants/steps';
import { Step } from '@mm/shared/models/step.model';
import { createSelector } from '@ngrx/store';

import { getCalculationSelectionState } from '../../reducers';
import { getCalculationPerformed } from '../calculation-options/calculation-options.selector';
import { isResultAvailable } from '../calculation-result/calculation-result.selector';

export const getStepperState = createSelector(
  getCalculationSelectionState,
  (state) => state.stepper
);

export const getCurrentStep = createSelector(
  getStepperState,
  (stepper) => stepper?.currentStep
);

export const getBearing = createSelector(
  getCalculationSelectionState,
  (state) => state.bearing
);

export const getBearingsResultList = createSelector(
  getCalculationSelectionState,
  (state) => state.bearingResultList
);

export const getBearingSelectionLoading = createSelector(
  getCalculationSelectionState,
  (state): boolean => state.loading
);

export const getBearingSeatId = createSelector(
  getCalculationSelectionState,
  (state): string | undefined => state?.bearingSeats?.selectedValueId
);

export const getBearingSeats = createSelector(
  getCalculationSelectionState,
  (state) => state?.bearingSeats
);

export const getMeasurementMethod = createSelector(
  getCalculationSelectionState,
  (state) => state?.measurementMethods?.selectedValueId
);

export const getMeasurementMethods = createSelector(
  getCalculationSelectionState,
  (state) => state?.measurementMethods
);

export const getMountingMethods = createSelector(
  getCalculationSelectionState,
  (state) => state?.mountingMethods
);

export const getMountingMethod = createSelector(
  getCalculationSelectionState,
  (state) => state?.mountingMethods?.selectedValueId
);

export const isAxialDisplacement = createSelector(
  getMeasurementMethod,
  (measurementMethod) => measurementMethod === LB_AXIAL_DISPLACEMENT
);

export const getSteps = createSelector(
  getBearing,
  getBearingSeatId,
  getMountingMethod,
  isAxialDisplacement,
  getCalculationPerformed,
  isResultAvailable,

  (
    bearing,
    bearingSeatId,
    mountingMethod,
    isAxialBearing,
    optionsCalculationPerformed,
    isAvailable
  ): Step[] => {
    const steps: Step[] = [
      {
        ...STEP_CONFIG.BEARING,
        complete: bearing !== undefined,
      },
      {
        ...STEP_CONFIG.BEARING_SEAT,
        complete: !!bearingSeatId,
      },
      {
        ...STEP_CONFIG.MEASURING_MOUNTING,
        complete: !!mountingMethod,
      },
    ];

    if (isAxialBearing) {
      steps.push({
        ...STEP_CONFIG.CALCULATION_OPTIONS,
        complete: optionsCalculationPerformed,
      });
    }

    steps.push({
      ...STEP_CONFIG.RESULT,
      complete: isAvailable,
    });

    return steps;
  }
);
