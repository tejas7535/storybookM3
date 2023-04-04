export interface CO2ServiceBearingData {
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

  /**
   * Viscosity at 40 degress
   */
  idL_VG: number;

  /**
   * Oil temperature
   */
  idL_OILTEMP: number;
}

export interface CO2ServiceLoadCaseData {
  idcO_DESIGNATION?: string; // "Loadcase 1",
  idslC_OPERATING_TIME_IN_HOURS: number; // 200,
  idlC_TYPE_OF_MOVEMENT: 'LB_ROTATING';
  idlC_OSCILLATION_ANGLE: number; //  10,
  idlC_MOVEMENT_FREQUENCY: number; // 20,
  idlC_SPEED: number; // 200,
  idlD_FX: number; // 100,
  idlD_FY: number; // 200,
  idlD_FZ: number; // 300
}

export type CO2ServiceCalculationResult = ResultSubordinate & {
  programName: string;
  programNameID: string;
  isBeta: boolean;
  method: string;
  methodID: string;

  companyInformation: unknown;
  timeStamp: string;
  programVersion: string;
  transactionFileName: string;
};

export interface ResultSubordinate {
  identifier: string;
  designation?: string;
  title?: string;
  titleID?: string;
  value?: string;
  unit?: string;
  entries?: [][];
  subordinates: ResultSubordinate[];
}
