import { CO2ServiceBearingData } from '@ea/core/services/co2-service.interface';

export interface CalculationParametersState {
  operationConditions: CalculationParametersOperationConditions;
  energySource: CalculationParametersEnergySource;
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
  type: CO2ServiceBearingData['idscO_CO2_EMISSION_FACTOR_CALCULATION'];
  fossilOrigin?: CO2ServiceBearingData['idscO_CO2_EMISSION_FACTOR_FOSSIL_ORIGIN'];
  electricityRegion?: CO2ServiceBearingData['idscO_CO2_EMISSION_FACTOR_ELECTRICITY_REGIONAL'];
}
