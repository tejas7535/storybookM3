import { DownstreamAPIResponse } from '@ea/core/services/downstream-calculation.service.interface';

export const DOWNSTREAM_API_RESULT_MOCK: DownstreamAPIResponse = {
  product: {
    designation: 'NKI38/20-XL',
    innerDiameter: 38,
    outerDiameter: 53,
    width: 20,
    staticLoadRating: 51_000,
    dynamicLoadRating: 30_500,
    fatigueLoadLimit: 9100,
    limitingSpeedOil: 10_700,
    limitingSpeedGrease: 6400,
  },
  inputData: {
    operatingConditions: {
      operatingTimeInHours: 8766,
      lubricationMethod: 'LB_GREASE_LUBRICATION',
      temperature: 20,
      viscosityDefinition: 'LB_ARCANOL_GREASE',
      greaseType: 'LB_FAG_MULTI_2',
      emissionFactor: 'LB_ELECTRIC_ENERGY',
      fossilEmissionFactor: 'LB_GASOLINE_E10',
      electricEmissionFactor: 'LB_EUROPEAN_UNION',
      rotationType: 'LB_ROTATING_INNERRING',
    },
    loadcases: [
      {
        designation: '',
        timePortion: 100,
        axialLoad: 0,
        radialLoad: 950,
        operatingTemperature: 70,
        movementType: 'LB_ROTATING',
        speed: 950,
      },
    ],
  },
  co2Emissions: 7120,
  loadcaseResults: [
    {
      designation: '',
      operatingTimeInHours: 8766,
      co2Emissions: 7120.363,
      frictionalTorque: 0.03,
      frictionalPowerLoss: 3,
    },
  ],
};
