import { InitialResultSectionData } from '../models/result-section.model';

export const initialResultSections: InitialResultSectionData = {
  initialLubrication: {
    title: 'initialLubrication',
    mainValue: 'initialGreaseQuantity',
    badgeClass: 'bg-surface-container',
    concept1: false,
    extendable: false,
  },
  performance: {
    title: 'performance',
    mainValue: 'viscosityRatio',
    badgeClass: 'bg-success-container text-on-success-container',
    concept1: false,
    extendable: true,
  },
  relubrication: {
    title: 'relubrication',
    mainValue: 'relubricationQuantityPer1000OperatingHours',
    badgeClass: 'bg-surface-container',
    concept1: true,
    extendable: true,
  },
  greaseSelection: {
    title: 'greaseSelection',
    mainValue: 'greaseServiceLife',
    badgeClass: 'bg-surface-container',
    concept1: false,
    extendable: true,
  },
};

export const performanceKeys = [
  'viscosityRatio',
  'applicationSpeedFactor',
  'effectiveEpAdditivation',
  'additiveRequired',
  'lowFriction',
  'suitableForVibrations',
  'supportForSeals',
];

export const relubricationKeys = [
  'relubricationQuantityPer1000OperatingHours',
  'relubricationPer365days',
  'relubricationPer30days',
  'relubricationPer7days',
  'concept1',
  'quantityOfRelubrication',
  'maximumManualRelubricationPerInterval',
  'relubricationInterval',
];

export const greaseSelectionKeys = [
  'greaseServiceLife',
  'baseOilViscosityAt40',
  'lowerTemperatureLimit',
  'upperTemperatureLimit',
  'density',
  'h1Registration',
];
