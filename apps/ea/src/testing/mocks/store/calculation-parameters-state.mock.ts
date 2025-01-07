import { CalculationParametersState } from '@ea/core/store/models';

export const CALCULATION_PARAMETERS_STATE_MOCK: CalculationParametersState = {
  operationConditions: {
    loadCaseData: [
      {
        load: {
          axialLoad: 0,
          radialLoad: undefined,
        },
        rotation: {
          rotationalSpeed: 0,
          shiftAngle: 0,
          shiftFrequency: undefined,
          typeOfMotion: 'LB_ROTATING',
        },
        operatingTemperature: 70,
        operatingTime: undefined,
        loadCaseName: 'Workload',
      },
    ],
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

    ambientTemperature: 20,
    contamination: 'LB_STANDARD_CLEANLINESS',
    conditionOfRotation: 'innerring',
    selectedLoadcase: 0,
    time: 2000,
    energySource: {
      type: 'fossil',
      electric: {
        electricityRegion: 'LB_GERMANY',
      },
      fossil: {
        fossilOrigin: 'LB_GASOLINE_E10',
      },
    },
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
