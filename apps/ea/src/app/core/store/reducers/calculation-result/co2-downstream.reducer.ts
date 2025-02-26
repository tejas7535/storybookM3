import { DownstreamCalculationLoadcaseResult } from '@ea/core/services/downstream-calculation.service.interface';
import { createReducer, on } from '@ngrx/store';

import { CO2DownstreamCalculationActions } from '../../actions';
import { DownstreamCalculationState, LoadCaseEmission } from '../../models';

export const initialState: DownstreamCalculationState = {
  isLoading: false,
  errors: [],
  warnings: [],
  notes: [],
};

const convertFromGramsToKilograms = (value: number): number => value / 1000;

const processLoadcaseResultData = (
  loadcaseResultData: DownstreamCalculationLoadcaseResult[]
): { [key: string]: LoadCaseEmission } => {
  const loadcases: { [key: string]: LoadCaseEmission } = {};
  for (const lcr of loadcaseResultData) {
    loadcases[`${lcr.designation}`] = {
      co2Emissions: lcr.co2Emissions
        ? convertFromGramsToKilograms(lcr.co2Emissions)
        : lcr.co2Emissions,
      co2EmissionsUnit: lcr.co2Emissions ? 'kg' : '',
      operatingTimeInHours: lcr.operatingTimeInHours,
      totalFrictionalPowerLoss: lcr.frictionalPowerLoss,
      totalFrictionalTorque: lcr.frictionalTorque,
      thermallySafeOperatingSpeed: lcr.thermallySafeOperatingSpeed,
    };
  }

  return loadcases;
};

export const co2downstreamCalculationReducer = createReducer(
  initialState,
  on(
    CO2DownstreamCalculationActions.resetDownstreamCalculation,
    (_state): DownstreamCalculationState => initialState
  ),
  on(
    CO2DownstreamCalculationActions.fetchDownstreamCalculation,
    (state): DownstreamCalculationState => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    CO2DownstreamCalculationActions.setDownstreamCalculationResult,
    (state, { result, inputs }): DownstreamCalculationState => {
      const loadcases = processLoadcaseResultData(result.loadcaseResults);

      return {
        ...state,
        errors: [],
        isLoading: false,
        result: {
          co2Emissions: result.co2Emissions
            ? convertFromGramsToKilograms(result.co2Emissions)
            : result.co2Emissions,
          loadcaseEmissions: loadcases,
        },
        inputs,
      };
    }
  ),
  on(
    CO2DownstreamCalculationActions.setCalculationFailure,
    (state, { errors }): DownstreamCalculationState => ({
      ...state,
      result: undefined,
      isLoading: false,
      inputs: undefined,
      errors,
    })
  )
);
