import { DownstreamApiInputs } from '@ea/core/services/downstream-calculation.service.interface';

export const FrictionKeys: string[] = ['NR', 'MR', 'n_theta'];

export interface DownstreamCalculationState {
  isLoading: boolean;
  errors: string[];
  warnings: string[];
  notes: string[];

  result?: DownstreamCalculationResult;
  inputs?: DownstreamApiInputs;
}

export interface DownstreamCalculationResult {
  co2Emissions?: number;
  loadcaseEmissions?: {
    [key: string]: LoadCaseEmission;
  };
}

export interface LoadCaseEmission {
  co2Emissions: number;
  co2EmissionsUnit: string;
  totalFrictionalPowerLoss: number;
  totalFrictionalTorque: number;
  operatingTimeInHours: number;
  thermallySafeOperatingSpeed: number;
}
