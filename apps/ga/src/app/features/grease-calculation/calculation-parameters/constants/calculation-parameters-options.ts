import {
  DropdownOption,
  EnvironmentImpact,
  LoadLevels,
  Movement,
} from '@ga/shared/models';

export const environmentImpactOptions: DropdownOption[] = [
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

export const typeOptions: DropdownOption[] = [
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

export const loadRatioOptions: DropdownOption[] = [
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
