import { CalculationParameters } from '@ea/shared/models';

export const CALCULATION_PARAMETERS_MOCK: CalculationParameters = {
  bearingData: {
    idscO_CO2_EMISSION_FACTOR_CALCULATION: 'LB_FOSSIL_ENERGY',
    idscO_CO2_EMISSION_FACTOR_FOSSIL_ORIGIN: 'LB_GASOLINE_E10',
    idscO_CO2_EMISSION_FACTOR_ELECTRICITY_REGIONAL: 'LB_EUROPEAN_UNION',
    idL_VG: 80,
    idL_OILTEMP: 70,
  },
  loadcaseData: [
    {
      idcO_DESIGNATION: 'Loadcase 1',
      idslC_OPERATING_TIME_IN_HOURS: 200,
      idlC_TYPE_OF_MOVEMENT: 'LB_ROTATING',
      idlC_OSCILLATION_ANGLE: 10,
      idlC_MOVEMENT_FREQUENCY: 20,
      idlC_SPEED: 200,
      idlD_FX: 100,
      idlD_FY: 200,
      idlD_FZ: 300,
    },
  ],
};
