import { FrictionServiceBearingData } from '@ea/core/services/friction-service.interface';

export interface CalculationParametersState {
  operationConditions: CalculationParametersOperationConditions;
  energySource: CalculationParametersEnergySource;
  calculationTypes: CalculationParametersCalculationTypes;
  isInputInvalid: boolean;
}

export interface CalculationParametersOperationConditions {
  operatingTime: number;

  load: {
    axialLoad: number;
    radialLoad: number;
  };
  rotation: {
    rotationalSpeed: number;
    typeOfMovement: 'LB_ROTATING';
  };

  lubrication: {
    lubricationSelection: 'grease' | 'oilBath' | 'oilMist' | 'recirculatingOil';
    grease: {
      greaseSelection: 'typeOfGrease' | 'isoVgClass' | 'viscosity';
      typeOfGrease: {
        typeOfGrease: string;
      };
      isoVgClass: {
        isoVgClass: number;
      };
      viscosity: {
        ny40: number;
        ny100: number;
      };
    };
    oilBath: {
      oilBathSelection: 'isoVgClass' | 'viscosity';
      isoVgClass: {
        isoVgClass: number;
      };
      viscosity: {
        ny40: number;
        ny100: number;
      };
    };
    oilMist: {
      oilMistSelection: 'isoVgClass' | 'viscosity';
      isoVgClass: {
        isoVgClass: number;
      };
      viscosity: {
        ny40: number;
        ny100: number;
      };
    };
    recirculatingOil: {
      recirculatingOilSelection: 'isoVgClass' | 'viscosity';
      isoVgClass: {
        isoVgClass: number;
      };
      viscosity: {
        ny40: number;
        ny100: number;
      };
    };
  };

  oscillationAngle: number;
  movementFrequency: number;

  oilTemp: number;
}

export type CalculationType =
  | 'frictionalPowerloss'
  | 'ratingLife'
  | 'lubrication'
  | 'emission'
  | 'overrollingFrequencies';

export interface CalculationParametersEnergySource {
  type: FrictionServiceBearingData['idscO_CO2_EMISSION_FACTOR_CALCULATION'];
  fossilOrigin?: FrictionServiceBearingData['idscO_CO2_EMISSION_FACTOR_FOSSIL_ORIGIN'];
  electricityRegion?: FrictionServiceBearingData['idscO_CO2_EMISSION_FACTOR_ELECTRICITY_REGIONAL'];
}

export type CalculationParametersCalculationTypes = Record<
  CalculationType,
  { selected: boolean; visible: boolean; disabled: boolean }
>;

export interface CalculationParametersCalculationTypeConfig {
  name: CalculationType;
  selected: boolean;
  label: string;
  svgIcon?: string;
  icon?: string;
}
