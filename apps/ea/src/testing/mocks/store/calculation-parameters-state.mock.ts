import { CalculationParametersState } from '@ea/core/store/models';

export const CALCULATION_PARAMETERS_STATE_MOCK: CalculationParametersState = {
  operationConditions: {
    rotationalSpeed: 1,
    axialLoad: 0,
    radialLoad: undefined,
    movementFrequency: 0,
    oilTemp: 70,
    operatingTime: 2000,
    oscillationAngle: 0,
    typeOfMovement: 'LB_ROTATING',
    viscosity: 110,
  },
  energySource: {
    type: 'LB_ELECTRIC_ENERGY',
    electricityRegion: 'LB_GERMANY',
  },
};
