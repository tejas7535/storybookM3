import {
  LubricantType,
  LubricationPoints,
  Optime,
  PowerSupply,
  RelubricationInterval,
} from '@lsa/shared/constants';
import { PipeLength } from '@lsa/shared/constants/tube-length.enum';
import {
  ApplicationFormValue,
  LubricantFormValue,
  LubricationPointsFormValue,
} from '@lsa/shared/models';

export const mockLubricationPointsInput: LubricationPointsFormValue = {
  lubricationPoints: LubricationPoints.TwoToFour,
  lubricationInterval: RelubricationInterval.Year,
  lubricationQty: 60,
  pipeLength: PipeLength.Direct,
  optime: Optime.No,
};

export const mockLubricantInput: LubricantFormValue = {
  lubricantType: LubricantType.Arcanol,
  grease: { id: 'ARCANOL_MULTI2', title: 'Arcanol MULTI2' },
};

export const mockApplicationInput: ApplicationFormValue = {
  temperature: {
    min: 5,
    max: 15,
    title: '5°C to 15°C',
  },
  battery: PowerSupply.External,
};
