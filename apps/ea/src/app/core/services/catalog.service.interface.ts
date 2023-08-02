import { NumberString } from '@ea/shared/helper';

export interface CatalogServiceBasicFrequenciesResult {
  data: {
    status: string;
    message: string;
    results: [
      {
        id: string;
        title: string;
        fields: Frequency[];
      }
    ];
  };
}

export interface Frequency {
  id: string;
  title: string;
  abbreviation: string;
  conditions?: { visible: boolean; editable: boolean };
  values?: [
    {
      content: string;
      index: number;
      unit: string;
    }
  ];
}

export interface CatalogServiceBaseOperatingConditions {
  IDL_CONDITION_OF_ROTATION: 'LB_ROTATING_INNERRING' | 'LB_ROTATING_OUTERRING';
  IDL_LUBRICATION_METHOD:
    | 'LB_GREASE_LUBRICATION'
    | 'LB_OIL_BATH_LUBRICATION'
    | 'LB_OIL_MIST_LUBRICATION'
    | 'LB_RECIRCULATING_OIL_LUBRICATION';
  IDL_INFLUENCE_OF_AMBIENT:
    | 'LB_LOW_AMBIENT_INFLUENCE'
    | 'LB_AVERAGE_AMBIENT_INFLUENCE'
    | 'LB_HIGH_AMBIENT_INFLUENCE';

  IDL_EXTERNAL_HEAT_FLOW: NumberString;
  IDL_CLEANESS_VALUE:
    | 'LB_EXTREM_CLEANLINESS'
    | 'LB_HIGH_CLEANLINESS'
    | 'LB_STANDARD_CLEANLINESS'
    | 'LB_SLIGHT_CONTAMINATION'
    | 'LB_TYPICAL_CONTAMINATION'
    | 'LB_HEAVY_CONTAMINATION'
    | 'LB_VERY_HEAVY_CONTAMINATION';
  /**
   * Ambient temperature, e.g. 20
   */
  IDSLC_TEMPERATURE: NumberString;
  IDL_DEFINITION_OF_VISCOSITY:
    | 'LB_ISO_VG_CLASS'
    | 'LB_ARCANOL_GREASE'
    | 'LB_ENTER_VISCOSITIES';
  // | 'LB_CALCULATE_VISCOSITIES' Not currently used

  /**
   * Only used for LB_CALCULATE_VISCOSITIES
   */
  // IDL_OILTEMP?: NumberString;
  // IDL_SPEED_WITHOUT_SIGN: NumberString;
  // IDL_ISO_VG_CLASS_CALCULATED?: string;
}

export interface CatalogServiceOperatingConditionsISOClass {
  IDL_DEFINITION_OF_VISCOSITY: 'LB_ISO_VG_CLASS';
  IDL_ISO_VG_CLASS: 'LB_PLEASE_SELECT' | `LB_ISO_VG_${number}`; // e.g 'LB_ISO_VG_22'
}

export interface CatalogServiceOperatingConditionsGrease {
  IDL_DEFINITION_OF_VISCOSITY: 'LB_ARCANOL_GREASE';
  IDL_GREASE: `LB_${string}`; // e.g. 'LB_FAG_MULTITOP'
}

export interface CatalogServiceOperatingConditionsEnterViscosities {
  IDL_DEFINITION_OF_VISCOSITY: 'LB_ENTER_VISCOSITIES';
  IDL_NY_40: NumberString;
  IDL_NY_100: NumberString;
}

export type CatalogServiceOperatingConditions =
  CatalogServiceBaseOperatingConditions &
    (
      | CatalogServiceOperatingConditionsISOClass
      | CatalogServiceOperatingConditionsGrease
      | CatalogServiceOperatingConditionsEnterViscosities
    );

export interface CatalogServiceLoadCaseData {
  IDCO_DESIGNATION: string; // choosen name of this load case
  IDSLC_TIME_PORTION: NumberString; // 0 - 100 (%)
  IDSLC_AXIAL_LOAD: NumberString;
  IDSLC_RADIAL_LOAD: NumberString;
  IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE: NumberString;
  IDSLC_TYPE_OF_MOVEMENT: 'LB_ROTATING' | 'LB_OSCILLATING';
  IDLC_SPEED: NumberString; // for LB_ROTATING
  IDSLC_MOVEMENT_FREQUENCY: NumberString; // for LB_OSCILLATING
  IDSLC_OPERATING_ANGLE: NumberString; // for LB_OSCILLATING
}

export interface CatalogServiceCalculationResult {
  data: CatalogServiceCalculationResultData;
  state: boolean;
  _links: CatalogServiceCalculationResultLink[];
}

export interface CatalogServiceCalculationResultLink {
  rel: string;
  href: string;
}

export interface CatalogServiceCalculationResultData {
  status: string;
  message: string;
  results: null;
  errors: CatalogServiceCalculationResultHint[];
  warnings: CatalogServiceCalculationResultHint[];
  messages: CatalogServiceCalculationResultHint[];
}

export interface CatalogServiceCalculationResultHint {
  message: string;
  userStrings: string[];
}
