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
        environmentalInfluence: undefined,
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
        oilTemperatureDifference: 0,
        oilFlow: undefined,
        externalHeatFlow: 0,
      },
    },
    operatingTemperature: 70,
    ambientTemperature: 20,
    contamination: 'LB_STANDARD_CLEANLINESS',
    conditionOfRotation: 'innerring',
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
