import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';

import { Step } from '../models';

export const steps: Step[] = [
  {
    name: 'bearingSelection',
    index: 0,
    link: `${GreaseCalculationPath.BearingPath}`,
  },
  {
    name: 'parameters',
    index: 1,
    link: `${GreaseCalculationPath.ParametersPath}`,
  },
  {
    name: 'report',
    index: 2,
    link: `${GreaseCalculationPath.ResultPath}`,
  },
];
