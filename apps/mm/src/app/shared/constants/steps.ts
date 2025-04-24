import {
  PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS,
  PAGE_MOUNTING_MANAGER_SEAT,
  PAGE_RESULT,
  PROPERTY_PAGE_MOUNTING_SITUATION,
  RSY_PAGE_BEARING_TYPE,
} from './dialog-constant';

export const BEARING_STEP = 0;
export const BEARING_SEAT_STEP = 1;
export const MEASURING_MOUNTING_STEP = 2;
export const CALCULATION_OPTIONS_STEP = 3;
export const RADIAL_BEARINGS_RESULT_STEP = 3;
export const AXIAL_BEARINGS_RESULT_STEP = 4;

export const STEP_CONFIG = {
  BEARING: {
    name: RSY_PAGE_BEARING_TYPE,
    text: 'dialog.bearing',
    customContent: 'bearing-selection',
  },
  BEARING_SEAT: {
    name: PAGE_MOUNTING_MANAGER_SEAT,
    text: 'dialog.bearingSeat',
    customContent: 'bearing-seat',
  },
  MEASURING_MOUNTING: {
    name: PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS,
    text: 'dialog.measuringAndMounting',
    customContent: 'measuring-and-mounting',
  },
  CALCULATION_OPTIONS: {
    name: PROPERTY_PAGE_MOUNTING_SITUATION,
    text: 'dialog.calculationOptions',
    customContent: 'calculation-options',
  },
  RESULT: {
    name: PAGE_RESULT,
    text: 'dialog.report',
    customContent: 'calculation-result',
  },
};
