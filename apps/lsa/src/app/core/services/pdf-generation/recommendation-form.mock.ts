import { PipeLength } from '@lsa/shared/constants/tube-length.enum';

import {
  LubricantType,
  LubricationPoints,
  Optime,
  PowerSupply,
} from '../../../shared/constants';
import { Grease } from '../../../shared/models';

export const MOCK_RECOMMENDATION_FORM = {
  lubricant: {
    lubricantType: LubricantType.Grease,
    grease: { id: 'MULTI2', title: 'Multi 2' } as Grease,
  },
  lubricationPoints: {
    lubricatonPoints: LubricationPoints.One,
    lubricationInterval: 'daily',
    pipeLength: PipeLength.Direct,
    optime: Optime.No,
  },
  application: {
    temperature: {
      min: 0,
      max: 55,
      title: '0 bis 55',
    },
    battery: PowerSupply.Battery,
  },
};
