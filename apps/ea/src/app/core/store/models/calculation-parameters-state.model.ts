import { FrictionServiceBearingData } from '@ea/core/services/friction-service.interface';

export interface CalculationParametersState {
  operationConditions: CalculationParametersOperationConditions;
  energySource: CalculationParametersEnergySource;
  calculationTypes: CalculationParametersCalculationTypes;
}

export interface CalculationParametersOperationConditions {
  operatingTime: number;
  typeOfMovement: 'LB_ROTATING';

  rotationalSpeed: number;
  axialLoad: number;
  radialLoad: number;

  oilTemp: number;
  viscosity: number;

  oscillationAngle: number;
  movementFrequency: number;
}

export interface CalculationParametersEnergySource {
  type: FrictionServiceBearingData['idscO_CO2_EMISSION_FACTOR_CALCULATION'];
  fossilOrigin?: FrictionServiceBearingData['idscO_CO2_EMISSION_FACTOR_FOSSIL_ORIGIN'];
  electricityRegion?: FrictionServiceBearingData['idscO_CO2_EMISSION_FACTOR_ELECTRICITY_REGIONAL'];
}

export type CalculationParametersCalculationTypes = Record<
  'emission' | 'friction',
  { selected: boolean; visible: boolean; disabled: boolean }
>;

export interface CalculationParametersCalculationTypeConfig {
  name: keyof CalculationParametersCalculationTypes;
  selected: boolean;
  label: string;
  icon: string;
}
