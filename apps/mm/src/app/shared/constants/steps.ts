import { Step } from '../models/step.model';
import {
  PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS,
  PAGE_MOUNTING_MANAGER_SEAT,
  PAGE_RESULT,
  PROPERTY_PAGE_MOUNTING_SITUATION,
  RSY_PAGE_BEARING_TYPE,
} from './dialog-constant';

export const steps: Step[] = [
  {
    index: 0,
    name: RSY_PAGE_BEARING_TYPE,
    text: 'dialog.bearing',
    customContent: 'bearing-selection',
  },
  {
    index: 1,
    name: PAGE_MOUNTING_MANAGER_SEAT,
    text: 'dialog.bearingSeat',
    customContent: 'bearing-seat',
  },
  {
    index: 2,
    name: PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS,
    text: 'dialog.measuringAndMounting',
    customContent: 'measuring-and-mounting',
  },
  {
    index: 3,
    name: PROPERTY_PAGE_MOUNTING_SITUATION,
    text: 'dialog.calculationOptions',
    customContent: 'calculation-options',
  },
  {
    index: 4,
    name: PAGE_RESULT,
    text: 'dialog.report',
    customContent: 'calculation-result',
  },
];
