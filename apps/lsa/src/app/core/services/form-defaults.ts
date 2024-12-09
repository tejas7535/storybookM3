import {
  LubricantType,
  LubricationPoints,
  Optime,
  PowerSupply,
  RelubricationInterval,
} from '@lsa/shared/constants';
import { PipeLength } from '@lsa/shared/constants/tube-length.enum';
import { LSAInterval } from '@lsa/shared/models';

export const DEFAULT_FORM_VALS = {
  lubricationPoints: {
    lubricationPoints: LubricationPoints.One,
    lubricationInterval: RelubricationInterval.Year,
    lubricationQty: 60,
    optime: Optime.NoPreference,
    pipeLength: PipeLength.Direct,
  },
  lubricant: {
    lubricantType: LubricantType.Arcanol,
    grease: { id: 'ARCANOL_MULTI2', title: 'Arcanol MULTI2' },
  },
  application: {
    temperature: { min: 0, max: 30, title: '' } as LSAInterval,
    battery: PowerSupply.NoPreference,
  },
};
