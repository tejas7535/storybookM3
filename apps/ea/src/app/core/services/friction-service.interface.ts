export interface FrictionServiceBearingData {
  idscO_CO2_EMISSION_FACTOR_CALCULATION:
    | 'LB_FOSSIL_ENERGY'
    | 'LB_ELECTRIC_ENERGY';
  idscO_CO2_EMISSION_FACTOR_FOSSIL_ORIGIN:
    | 'LB_GASOLINE_FOSSIL'
    | 'LB_DIESEL_FOSSIL'
    | 'LB_GASOLINE_E10'
    | 'LB_DIESEL_B7'
    | 'LB_LPG'
    | 'LB_CNG'
    | 'LB_CNG_BIOMETHANE';
  idscO_CO2_EMISSION_FACTOR_ELECTRICITY_REGIONAL:
    | 'LB_ARGENTINA'
    | 'LB_AUSTRALIA'
    | 'LB_BRAZIL'
    | 'LB_CANADA'
    | 'LB_CHINA'
    | 'LB_EUROPEAN_UNION'
    | 'LB_FRANCE'
    | 'LB_GERMANY'
    | 'LB_GREAT_BRITAIN'
    | 'LB_INDIA'
    | 'LB_INDONESIA'
    | 'LB_ITALY'
    | 'LB_JAPAN'
    | 'LB_MEXICO'
    | 'LB_RUSSIAN_FEDERATION'
    | 'LB_SOUTH_AFRICA'
    | 'LB_SOUTH_KOREA'
    | 'LB_TURKEYZLB_USA';
  idscO_LUBRICANT_DEFINITION_FLAG:
    | 'LB_DEFINITION_BY_GREASE'
    | 'LB_DEFINITION_BY_INPUT';
  idscO_DESIGNATION_OF_GREASE?: `LB_${string}`;
  idscO_LUBRICANT_TYPE: 'LB_GREASE_LUBRICATION' | 'LB_OIL_LUBRICATION';
  idscO_VISCOSITY_DEFINITION_FLAG:
    | 'LB_DEFINITION_BY_CLASS'
    | 'LB_DEFINITION_BY_GREASE'
    | 'LB_DEFINITION_BY_TWO_VISCOSITIES';

  /**
   * Viscosity at 40 degress
   */
  idL_VG?: number;

  /**
   * Oil temperature
   */
  idL_OILTEMP: number;
}

export interface FrictionServiceLoadCaseData {
  idcO_DESIGNATION?: string; // "Loadcase 1",
  idslC_OPERATING_TIME_IN_HOURS: number; // 200,
  idlC_TYPE_OF_MOVEMENT: 'LB_ROTATING' | 'LB_OSCILLATING';
  idlC_OSCILLATION_ANGLE: number; //  10,
  idlC_MOVEMENT_FREQUENCY: number; // 20,
  idlC_SPEED: number; // 200,
  idlD_FX: number; // 100,
  idlD_FY: number; // 200,
  idlD_FZ: number; // 300
}
