import { DownstreamCalculationState } from '@ea/core/store/models';

export const DOWNSTREAM_STATE_MOCK: DownstreamCalculationState = {
  isLoading: false,
  errors: [],
  warnings: [],
  notes: [],
  result: {
    co2Emissions: 10.296,
    loadcaseEmissions: {
      'Loadcase 1': {
        co2Emissions: 2.848,
        co2EmissionsUnit: 'kg',
        operatingTimeInHours: 3506.4,
        totalFrictionalPowerLoss: 3,
        totalFrictionalTorque: 0.03,
      },
      'Loadcase 2': {
        co2Emissions: 7.4478,
        co2EmissionsUnit: 'kg',
        operatingTimeInHours: 5259.6,
        totalFrictionalPowerLoss: 5,
        totalFrictionalTorque: 0.041,
      },
    },
  },
};
