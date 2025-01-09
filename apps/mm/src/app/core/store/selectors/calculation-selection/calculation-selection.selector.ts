import {
  PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS,
  PAGE_MOUNTING_MANAGER_SEAT,
  PAGE_RESULT,
  PROPERTY_PAGE_MOUNTING_SITUATION,
  RSY_PAGE_BEARING_TYPE,
} from '@mm/shared/constants/dialog-constant';
import { steps } from '@mm/shared/constants/steps';
import { createSelector } from '@ngrx/store';

import { getCalculationSelectionState } from '../../reducers';
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
  (state) => state.loading
);

export const getBearingSeatId = createSelector(
  getCalculationSelectionState,
  (state) => state?.bearingSeats?.selectedValueId
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

export const getSteps = createSelector(
  getBearing,
  getBearingSeatId,
  getMountingMethod,
  getMeasurementMethod,
  isResultAvailable,
  (bearing, bearingSeatId, mountingMethod, measurementMethod, isAvailable) =>
    steps.map((step) => {
      switch (step.name) {
        case RSY_PAGE_BEARING_TYPE:
          return {
            ...step,
            editable: true,
            enabled: true,
            complete: bearing,
          };
        case PAGE_MOUNTING_MANAGER_SEAT:
          return {
            ...step,
            enabled: true,
            complete: bearingSeatId,
            editable: true,
          };
        case PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS:
          return {
            ...step,
            enabled: true,
            editable: true,
            complete: mountingMethod,
          };
        case PROPERTY_PAGE_MOUNTING_SITUATION:
          return {
            ...step,
            enabled:
              measurementMethod &&
              measurementMethod === 'LB_AXIAL_DISPLACEMENT',
            editable: true,
            complete:
              (measurementMethod &&
                measurementMethod !== 'LB_AXIAL_DISPLACEMENT') ||
              isAvailable,
          };
        case PAGE_RESULT:
          return {
            ...step,
            enabled: true,
            editable: true,
            complete: false,
          };
        default:
          return step;
      }
    })
);
