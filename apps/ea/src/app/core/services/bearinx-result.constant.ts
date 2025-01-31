// Designation field contains the loadcase name
export const LOADCASE_DESIGNATION_FIELD_NAME_TRANSLATION_KEY =
  'resultValues.designation';
export const LOADCASE_NAME_FIELD_NAME_TRANSLATION_KEY = 'resultValues.loadcase';
export const LOADCASES_TITLE_TRANSLATION_KEY =
  'calculationResultReport.downstreamInputs.load.loadTitle';
export const LOADCASE_TYPE_OF_MOTION_TRANSLATION_KEY =
  'operationConditions.rotatingCondition.typeOfMotion';

/*
 Abbreviations
*/
// Bearing behaviour
export const LH10 = 'Lh10';
export const LH_NM = 'Lh_nm';
export const P = 'P';
export const N = 'n';
export const S0_MIN = 'S0_min';
export const P0_MAX = 'P0_max';
export const TFG_MIN = 'tfG_min';
export const TFG_MAX = 'tfG_max';
export const TFR_MIN = 'tfR_min';
export const TFR_MAX = 'tfR_max';
// Load Factors and equivalent loads
export const P0 = 'P0';
export const P_I = 'P_i';
// Overrolling Frequencies
export const BPFO = 'BPFO';
export const BPFI = 'BPFI';
export const BSF = 'BSF';
export const RPFB = 'RPFB';
export const FTF = 'FTF';
// Friction
export const M0 = 'M0';
export const M1 = 'M1';
export const MR = 'MR';
export const NR = 'NR';
export const N_THETA = 'n_theta';
// Lubrication
export const NY = 'ny';
export const NY1 = 'ny1';
export const KAPPA = 'kappa';
export const A_ISO = 'a_ISO';

/*
 Subordinates
*/
// Subordinate names
export const STRING_OUTP_RESULTS = 'STRING_OUTP_RESULTS';
export const STRING_OUTP_RESULTS_OF_LOADCASES =
  'STRING_OUTP_RESULTS_OF_LOADCASES';
export const STRING_OUTP_BEARING_BEHAVIOUR = 'STRING_OUTP_BEARING_BEHAVIOUR';
export const STRING_OUTP_ROLLOVER_FREQUENCIES =
  'STRING_OUTP_ROLLOVER_FREQUENCIES';
export const STRING_OUTP_INPUT = 'STRING_OUTP_INPUT';
export const STRING_ERROR_BLOCK = 'STRING_ERROR_BLOCK';
export const STRING_WARNING_BLOCK = 'STRING_WARNING_BLOCK';
export const STRING_NOTE_BLOCK = 'STRING_NOTE_BLOCK';
export const STRING_OUTP_BASIC_FREQUENCIES_FACTOR =
  'STRING_OUTP_BASIC_FREQUENCIES_FACTOR';
export const STRING_OUTP_FRICTION_AND_THERMALLY_PERMISSABLE_SPEED =
  'STRING_OUTP_FRICTION_AND_THERMALLY_PERMISSABLE_SPEED';
export const STRING_OUTP_LUBRICATION = 'STRING_OUTP_LUBRICATION';
export const STRING_OUTP_INPUT_DATA_FOR_ALL_LOADCASES =
  'STRING_OUTP_INPUT_DATA_FOR_ALL_LOADCASES';
export const STRING_OUTP_LOADCASE_DATA = 'STRING_OUTP_LOADCASE_DATA';
export const STRING_OUTP_LOAD = 'STRING_OUTP_LOAD';
export const STRING_OUTP_LOAD_FACTORS_AND_EQUIVALENT_LOADS =
  'STRING_OUTP_LOAD_FACTORS_AND_EQUIVALENT_LOADS';
// Subordinate types
export const BLOCK = 'block';
export const TABLE = 'table';
export const VARIABLE_BLOCK = 'variableBlock';
export const VARIABLE_LINE = 'variableLine';
export const TEXT = 'text';

/*
 Lists
*/
export const BEARING_BEHAVIOUR_ABBREVIATIONS = [
  LH10,
  LH_NM,
  P,
  N,
  S0_MIN,
  P0_MAX,
  TFR_MIN,
  TFR_MAX,
  TFG_MIN,
  TFG_MAX,
];
export const BEARING_BEHAVIOUR_ABBREVIATIONS_KEY_MAPPING = new Map<
  string,
  string
>([
  ['Lh10', 'lh10'],
  ['Lh_nm', 'lh_nm'],
  ['P', 'p'],
  ['n', 'n'],
  ['S0_min', 'S0_min'],
  ['P0_max', 'P0_max'],
  ['tfG_min', 'lowerGuideIntervalServiceLife'],
  ['tfG_max', 'upperGuideIntervalServiceLife'],
  ['tfR_min', 'lowerGuideIntervalRelubrication'],
  ['tfR_max', 'upperGuideIntervalRelubrication'],
]);

export const OVERROLLING_FREQUENCIES_ABBREVIATIONS = [
  BPFO,
  BPFI,
  BSF,
  RPFB,
  FTF,
];

export enum LoadcaseValueType {
  LUBRICATION = 'loadcaseLubrication',
  FRICTION = 'loadcaseFriction',
  FACTORS_AND_EQUIVALENT_LOADS = 'loadcaseFactorsAndEquivalentLoads',
}

export const FRICTION_ABBREVIATIONS_KEY_MAPPING: Partial<
  Record<
    keyof Record<
      string,
      {
        unit: string;
        value: string;
        short?: string;
        title: string;
        loadcaseName: string;
      }
    >,
    string
  >
> = {
  speedDependentFrictionalTorque: M0,
  loadDependentFrictionalTorque: M1,
  totalFrictionalTorque: MR,
  totalFrictionalPowerLoss: NR,
  thermallySafeOperatingSpeed: N_THETA,
};

export const LUBRICATION_ABBREVIATIONS_KEY_MAPPING: Partial<
  Record<
    keyof Record<
      string,
      {
        unit: string;
        value: string;
        short?: string;
        title: string;
        loadcaseName: string;
      }
    >,
    string
  >
> = {
  operatingViscosity: NY,
  referenceViscosity: NY1,
  viscosityRatio: KAPPA,
  lifeAdjustmentFactor: A_ISO,
};

export const FACTORS_AND_EQUIVALENT_LOADS_KEY_MAPPING: Partial<
  Record<
    keyof Record<
      string,
      {
        unit: string;
        value: string;
        short?: string;
        title: string;
        loadcaseName: string;
      }
    >,
    string
  >
> = {
  p0: P0,
  p_i: P_I,
};
