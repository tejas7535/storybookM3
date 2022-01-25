import { Validators } from '@angular/forms';
import {
  DropdowOption,
  EnvironmentImpact,
  LoadLevels,
  Movement,
} from '../shared/models';

export const loadValidators = [
  Validators.min(0),
  Validators.max(1_000_000_000),
];

export const rotationalSpeedValidators = [
  Validators.required,
  Validators.min(0.001),
  Validators.max(1_000_000),
];

export const shiftFrequencyValidators = [
  Validators.required,
  Validators.min(0.001),
  Validators.max(1_000_000),
];

export const shiftAngleValidators = [
  Validators.required,
  Validators.min(0.001),
  Validators.max(10_000),
];

export const environmentImpactOptions: DropdowOption[] = [
  {
    id: EnvironmentImpact.low,
    text: 'parameters.low',
  },
  {
    id: EnvironmentImpact.moderate,
    text: 'parameters.moderate',
    default: true,
  },
  {
    id: EnvironmentImpact.high,
    text: 'parameters.high',
  },
];

export const typeOptions: DropdowOption[] = [
  {
    id: Movement.rotating,
    text: 'parameters.rotating',
    default: true,
  },
  {
    id: Movement.oscillating,
    text: 'parameters.oscillating',
  },
];

export const loadRatioOptions: DropdowOption[] = [
  {
    id: LoadLevels.LB_VERY_LOW,
    text: 'parameters.loadLevel.veryLow',
  },
  {
    id: LoadLevels.LB_LOW,
    text: 'parameters.loadLevel.low',
  },
  {
    id: LoadLevels.LB_MODERATE,
    text: 'parameters.loadLevel.moderate',
  },
  {
    id: LoadLevels.LB_HIGH,
    text: 'parameters.loadLevel.high',
  },
  {
    id: LoadLevels.LB_VERY_HIGH,
    text: 'parameters.loadLevel.veryHigh',
  },
];
