import { FrictionServiceBearingData } from '@ea/core/services/friction-service.interface';
import { Greases } from '@ea/shared/constants/greases';

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
      selection: 'typeOfGrease' | 'isoVgClass' | 'viscosity';
      typeOfGrease: {
        typeOfGrease: typeof Greases[number]['value'];
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
      selection: 'isoVgClass' | 'viscosity';
      isoVgClass: {
        isoVgClass: number;
      };
      viscosity: {
        ny40: number;
        ny100: number;
      };
    };
    oilMist: {
      selection: 'isoVgClass' | 'viscosity';
      isoVgClass: {
        isoVgClass: number;
      };
      viscosity: {
        ny40: number;
        ny100: number;
      };
    };
    recirculatingOil: {
      selection: 'isoVgClass' | 'viscosity';
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
  | 'overrollingFrequency';

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
