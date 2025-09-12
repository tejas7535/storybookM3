import { LB_AXIAL_DISPLACEMENT } from '@mm/shared/constants/dialog-constant';
import { StepType } from '@mm/shared/constants/steps';
import { createSelector } from '@ngrx/store';

import { getCalculationSelectionState } from '../../reducers';

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

export const getStoredStepConfiguration = createSelector(
  getStepperState,
  (stepper) => stepper?.stepConfiguration
);

export const getStoredStepIndices = createSelector(
  getStoredStepConfiguration,
  (config): Record<StepType, number> =>
    config?.stepIndices || ({} as Record<StepType, number>)
);

export const getBearingStepIndex = createSelector(
  getStoredStepIndices,
  (indices): number | undefined =>
    indices[StepType.BEARING] >= 0 ? indices[StepType.BEARING] : undefined
);

export const getBearingSeatStepIndex = createSelector(
  getStoredStepIndices,
  (indices): number | undefined =>
    indices[StepType.BEARING_SEAT] >= 0
      ? indices[StepType.BEARING_SEAT]
      : undefined
);

export const getMeasuringMountingStepIndex = createSelector(
  getStoredStepIndices,
  (indices): number | undefined =>
    indices[StepType.MEASURING_MOUNTING] >= 0
      ? indices[StepType.MEASURING_MOUNTING]
      : undefined
);

export const getCalculationOptionsStepIndex = createSelector(
  getStoredStepIndices,
  (indices): number | undefined =>
    indices[StepType.CALCULATION_OPTIONS] >= 0
      ? indices[StepType.CALCULATION_OPTIONS]
      : undefined
);

export const getResultStepIndex = createSelector(
  getStoredStepIndices,
  (indices): number | undefined =>
    indices[StepType.RESULT] >= 0 ? indices[StepType.RESULT] : undefined
);

export const getAvailableSteps = createSelector(
  getStoredStepConfiguration,
  (stepConfiguration) => stepConfiguration?.availableSteps || []
);

export const getStoredSteps = createSelector(
  getStoredStepConfiguration,
  (config) => config?.steps || []
);

export const isThermal = createSelector(
  getCalculationSelectionState,
  (state) => state?.bearing?.isThermal
);
