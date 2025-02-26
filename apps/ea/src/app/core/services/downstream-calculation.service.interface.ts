export type LubricationMethodType =
  | 'LB_GREASE_LUBRICATION'
  | 'LB_OIL_BATH_LUBRICATION'
  | 'LB_OIL_MIST_LUBRICATION'
  | 'LB_RECIRCULATING_OIL_LUBRICATION';

export type EmissionFactor = 'LB_ELECTRIC_ENERGY' | 'LB_FOSSIL_ENERGY';

export type ElectricityRegion =
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
  | 'LB_TURKEY'
  | 'LB_USA';

export type FossilFactor =
  | 'LB_GASOLINE_FOSSIL'
  | 'LB_DIESEL_FOSSIL'
  | 'LB_GASOLINE_E10'
  | 'LB_DIESEL_B7'
  | 'LB_LPG'
  | 'LB_CNG'
  | 'LB_CNG_BIOMETHANE';

export type MovementType = 'LB_ROTATING' | 'LB_OSCILLATING';

export type RotationType = 'LB_ROTATING_INNERRING' | 'LB_ROTATING_OUTERRING';

export interface DownstreamOperatingConditions {
  operatingTimeInHours: number;
  lubricationMethod: LubricationMethodType;
  fossilEmissionFactor: FossilFactor;

  temperature: number;
  isoVgClassCalculated?: 'LB_ISO_VG_CLASS';
  ny40?: number;
  ny100?: number;
  oilFlow?: number;
  oilTemperatureRise?: number;
  externalHeatFlow?: number;
  isoVgClass?: `LB_ISO_VG_${number}`; // e.g 'LB_ISO_VG_22''LB_ISO_VG_10';
  greaseType:
    | 'LB_FAG_BIO_2'
    | 'LB_FAG_FOOD_2'
    | 'LB_FAG_LOAD_150'
    | 'LB_FAG_LOAD_220'
    | 'LB_FAG_LOAD_400'
    | 'LB_FAG_LOAD_460'
    | 'LB_FAG_LOAD_1000'
    | 'LB_FAG_MULTI_2'
    | 'LB_FAG_MULTI_3'
    | 'LB_FAG_MULTITOP'
    | 'LB_FAG_SF_1'
    | 'LB_FAG_SF_2'
    | 'LB_FAG_SPEED_2_6'
    | 'LB_FAG_TEMP_90'
    | 'LB_FAG_TEMP_110'
    | 'LB_FAG_TEMP_120'
    | 'LB_FAG_TEMP_200'
    | 'LB_FAG_VIB_3';
  viscosityDefinition:
    | 'LB_ISO_VG_CLASS'
    | 'LB_CALCULATE_VISCOSITIES' // not currently selectable on the UI?
    | 'LB_ENTER_VISCOSITIES'
    | 'LB_ARCANOL_GREASE';
  emissionFactor: EmissionFactor;
  electricEmissionFactor: ElectricityRegion;
  rotationType: RotationType;
}

interface DownstreamLoadcase {
  designation: string;
  timePortion: number;
  axialLoad: number;
  radialLoad: number;
  operatingTemperature: number;
  movementType: MovementType;
  speed: number;
}

export interface DownstreamAPIRequest {
  operatingConditions: DownstreamOperatingConditions;
  loadcases: DownstreamLoadcase[];
}

type DownstreamErrorMessages = 'TEST_ERROR_MESSAGE';

interface DownstreamCalculationMessage<T> {
  id: T;
  category: string;
  message: string;
  addendum: string[];
}

export interface DownstreamAPIResponse {
  product: {
    designation: string;
    innerDiameter: number;
    outerDiameter: number;
    width: number;
    staticLoadRating: number;
    dynamicLoadRating: number;
    fatigueLoadLimit: number;
    limitingSpeedOil: number;
    limitingSpeedGrease: number;
  };
  inputData: DownstreamAPIRequest;

  co2Emissions: number;

  loadcaseResults: DownstreamCalculationLoadcaseResult[];
  errors?: DownstreamCalculationMessage<DownstreamErrorMessages>[];
}

export interface DownstreamCalculationLoadcaseResult {
  designation: string;
  operatingTimeInHours: number;
  co2Emissions: number;
  frictionalTorque: number;
  frictionalPowerLoss: number;
  thermallySafeOperatingSpeed: number;
}

export interface InputValue {
  designation: string;
  value: string;
  unit?: string;
  abbreviation?: string;
  hasNestedStructure: boolean;
}

export interface DownstreamApiInputs {
  bearing: {
    title: string;
    subItems: InputValue[];
    hasNestedStructure: boolean;
  };
  operatingConditions: {
    title: string;
    baseConditions: InputValue[];
    downstreamConditions: InputValue[];
    hasNestedStructure: boolean;
  };
  load: {
    title: string;
    hasNestedStructure: boolean;
    loadCases: {
      title: string;
      subItems: InputValue[];
      hasNestedStructure: boolean;
    }[];
  };
}
