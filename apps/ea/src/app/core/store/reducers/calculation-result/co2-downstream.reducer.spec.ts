import {
  DownstreamApiInputs,
  DownstreamAPIResponse,
  DownstreamCalculationLoadcaseResult,
} from '@ea/core/services/downstream-calculation.service.interface';

import { CO2DownstreamCalculationActions } from '../../actions';
import { DownstreamCalculationState } from '../../models';
import {
  co2downstreamCalculationReducer,
  initialState,
} from './co2-downstream.reducer';

describe('co2downstreamCalculationReducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'Unknown' };
    const state = co2downstreamCalculationReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it('should set isLoading to true on fetchDownstreamCalculation', () => {
    const action = CO2DownstreamCalculationActions.fetchDownstreamCalculation();
    const state = co2downstreamCalculationReducer(initialState, action);

    expect(state.isLoading).toBe(true);
  });

  it('should reset to initial state on resetDownstreamCalculation', () => {
    const modifiedState: DownstreamCalculationState = {
      ...initialState,
      isLoading: true,
      errors: ['Some error'],
    };
    const action = CO2DownstreamCalculationActions.resetDownstreamCalculation();
    const state = co2downstreamCalculationReducer(modifiedState, action);

    expect(state).toBe(initialState);
  });

  it('should set errors on setCalculationFailure', () => {
    const errors = ['Test Error'];
    const action = CO2DownstreamCalculationActions.setCalculationFailure({
      errors,
    });
    const state = co2downstreamCalculationReducer(initialState, action);

    expect(state.errors).toEqual(errors);
    expect(state.isLoading).toBe(false);
  });

  it('should process loadcase results on setDownstreamCalculationResult', () => {
    const result = {
      co2Emissions: 1000,
      loadcaseResults: [
        {
          designation: 'Loadcase 1',
          co2Emissions: 2000,
          operatingTimeInHours: 10,
          frictionalPowerLoss: 100,
          frictionalTorque: 50,
        },
        {
          designation: 'Loadcase 2',
          co2Emissions: undefined,
          operatingTimeInHours: 10,
          frictionalPowerLoss: 100,
          frictionalTorque: 50,
        },
      ] as DownstreamCalculationLoadcaseResult[],
      errors: [],
    } as Partial<DownstreamAPIResponse> as DownstreamAPIResponse;

    const inputs = {
      bearing: {
        title: 'bearing',
        subItems: [],
      },
    } as Partial<DownstreamApiInputs> as DownstreamApiInputs;

    const action =
      CO2DownstreamCalculationActions.setDownstreamCalculationResult({
        result,
        inputs,
      });
    const state = co2downstreamCalculationReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.result).toEqual({
      co2Emissions: 1,
      loadcaseEmissions: {
        'Loadcase 1': {
          co2Emissions: 2,
          co2EmissionsUnit: 'kg',
          operatingTimeInHours: 10,
          totalFrictionalPowerLoss: 100,
          totalFrictionalTorque: 50,
        },
        'Loadcase 2': {
          co2Emissions: undefined,
          co2EmissionsUnit: '',
          operatingTimeInHours: 10,
          totalFrictionalPowerLoss: 100,
          totalFrictionalTorque: 50,
        },
      },
    });
  });
});
