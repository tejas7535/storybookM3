import { CalculationParametersState } from '@ea/core/store/models';

export const CALCULATION_PARAMETERS_STATE_MOCK: CalculationParametersState = {
  operationConditions: {
    rotation: {
      rotationalSpeed: 0,
      shiftAngle: 0,
      shiftFrequency: undefined,
      typeOfMotion: 'LB_ROTATING',
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
    operatingTemperature: 70,
    ambientTemperature: 20,
    contamination: 'LB_STANDARD_CLEANLINESS',
    conditionOfRotation: 'innerring',
    externalHeatFlow: 0,
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
