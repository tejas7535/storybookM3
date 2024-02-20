import {
  LubricantType,
  LubricationPoints,
  Optime,
  PowerSupply,
  RelubricationInterval,
} from './shared/constants';
import {
  ApplicationFormValue,
  LubricantFormValue,
  LubricationPointsFormValue,
} from './shared/models';

export const mockLubricationPointsInput: LubricationPointsFormValue = {
  lubricationPoints: LubricationPoints.TwoToFour,
  lubricationInterval: RelubricationInterval.Year,
  lubricationQty: 60,
  pipeLength: {
    min: 1,
    max: 3,
    title: '1 - 3m',
  },
  optime: Optime.No,
};

export const mockLubricantInput: LubricantFormValue = {
  lubricantType: LubricantType.Arcanol,
  grease: { id: 'ARCANOL_MULTI2', name: 'Arcanol MULTI2' },
};

export const mockApplicationInput: ApplicationFormValue = {
  temperature: {
    min: 5,
    max: 15,
    title: '5°C to 15°C',
  },
  battery: PowerSupply.External,
};
