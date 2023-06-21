import { CalculationParametersState } from '@ea/core/store/models';

export const CALCULATION_PARAMETERS_STATE_MOCK: CalculationParametersState = {
  operationConditions: {
    rotation: {
      rotationalSpeed: 0,
      typeOfMovement: 'LB_ROTATING',
    },
    load: {
      axialLoad: 0,
      radialLoad: undefined,
    },
    lubrication: {
      lubricationSelection: 'grease',
      grease: {
        selection: 'isoVgClass',
        isoVgClass: { isoVgClass: undefined },
        typeOfGrease: { typeOfGrease: undefined },
        viscosity: { ny100: undefined, ny40: undefined },
      },
      oilBath: {
        selection: 'isoVgClass',
        isoVgClass: { isoVgClass: undefined },
        viscosity: { ny100: undefined, ny40: undefined },
      },
      oilMist: {
        selection: 'isoVgClass',
        isoVgClass: { isoVgClass: undefined },
        viscosity: { ny100: undefined, ny40: undefined },
      },
      recirculatingOil: {
        selection: 'isoVgClass',
        isoVgClass: { isoVgClass: undefined },
        viscosity: { ny100: undefined, ny40: undefined },
      },
    },
    operatingTime: 2000,
    oilTemp: 70,
    movementFrequency: 0,
    oscillationAngle: 0,
  },
  energySource: {
    type: 'LB_ELECTRIC_ENERGY',
    electricityRegion: 'LB_GERMANY',
  },
  calculationTypes: {
    emission: {
      disabled: true,
      selected: true,
      visible: true,
    },
    frictionalPowerloss: {
      disabled: false,
      selected: true,
      visible: true,
    },
    lubrication: {
      disabled: false,
      selected: false,
      visible: false,
    },
    overrollingFrequency: {
      disabled: false,
      selected: false,
      visible: false,
    },
    ratingLife: {
      disabled: false,
      selected: false,
      visible: false,
    },
  },
  isInputInvalid: false,
};
