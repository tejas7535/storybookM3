import { Validators } from '@angular/forms';

export const loadValidators = [
  Validators.required,
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
