import {
  PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS,
  PAGE_MOUNTING_MANAGER_SEAT,
  PAGE_RESULT,
  PROPERTY_PAGE_MOUNTING_SITUATION,
  RSY_PAGE_BEARING_TYPE,
} from './dialog-constant';

// Step types for dynamic step calculation
export enum StepType {
  BEARING = 'BEARING',
  BEARING_SEAT = 'BEARING_SEAT',
  MEASURING_MOUNTING = 'MEASURING_MOUNTING',
  CALCULATION_OPTIONS = 'CALCULATION_OPTIONS',
  RESULT = 'RESULT',
}

export const STEP_CONFIG = {
  BEARING: {
    name: RSY_PAGE_BEARING_TYPE,
    text: 'dialog.bearing',
  },
  BEARING_SEAT: {
    name: PAGE_MOUNTING_MANAGER_SEAT,
    text: 'dialog.bearingSeat',
  },
  MEASURING_MOUNTING: {
    name: PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS,
    text: 'dialog.measuringAndMounting',
  },
  CALCULATION_OPTIONS: {
    name: PROPERTY_PAGE_MOUNTING_SITUATION,
    text: 'dialog.calculationOptions',
  },
  RESULT: {
    name: PAGE_RESULT,
    text: 'dialog.report',
  },
};
