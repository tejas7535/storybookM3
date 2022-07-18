import { Step } from '@ga/shared/models';

export const INVALID_STEP_MOCK: Step = {
  name: 'unknown step',
  index: 4,
  link: 'mock_link',
};

export const STEPS_MOCK: Step[] = [
  {
    enabled: false,
    index: 0,
    link: 'bearing',
    name: 'bearingSelection',
  },
  {
    enabled: true,
    index: 1,
    link: 'parameters',
    name: 'parameters',
  },
  {
    enabled: true,
    index: 2,
    link: 'result',
    name: 'report',
  },
];
