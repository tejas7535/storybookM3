const createInvertedMap = (map: Map<string, string>): Map<string, string> => {
  const invertedArray: [string, string][] = [...map].map(
    (a) => a.reverse() as [string, string]
  );

  return new Map<string, string>(invertedArray);
};
export const CATALOG_OPERATION_CONDITIONS_KEY_MAPPING = new Map<string, string>(
  [
    ['IDSLC_TEMPERATURE', 'ambientTemperature'],
    ['IDL_CONDITION_OF_ROTATION', 'conditionOfRotation'],
    ['IDL_CLEANESS_VALUE', 'contamination'],
  ]
);
export const CATALOG_OPERATION_CONDITIONS_VALUE_MAPPING = createInvertedMap(
  CATALOG_OPERATION_CONDITIONS_KEY_MAPPING
);

export const CATALOG_LOADCASE_DATA_KEY_MAPPING = new Map<string, string>([
  ['IDCO_DESIGNATION', 'loadCaseName'],
  ['IDSLC_TIME_PORTION', 'operatingTime'],
  ['IDSLC_MEAN_BEARING_OPERATING_TEMPERATURE', 'operatingTemperature'],
]);
export const CATALOG_LOADCASE_DATA_VALUE_MAPPING = createInvertedMap(
  CATALOG_LOADCASE_DATA_KEY_MAPPING
);

export const CATALOG_LOADCASE_DATA_LOAD_KEY_MAPPING = new Map<string, string>([
  ['IDSLC_AXIAL_LOAD', 'axialLoad'],
  ['IDSLC_RADIAL_LOAD', 'radialLoad'],
]);
export const CATALOG_LOADCASE_DATA_LOAD_VALUE_MAPPING = createInvertedMap(
  CATALOG_LOADCASE_DATA_LOAD_KEY_MAPPING
);

export const CATALOG_LOADCASE_DATA_ROTATION_KEY_MAPPING = new Map<
  string,
  string
>([
  ['IDSLC_TYPE_OF_MOVEMENT', 'typeOfMotion'],
  ['IDLC_SPEED', 'rotationalSpeed'],
  ['IDSLC_MOVEMENT_FREQUENCY', 'shiftFrequency'],
  ['IDSLC_OPERATING_ANGLE', 'shiftAngle'],
]);
export const CATALOG_LOADCASE_DATA_ROTATION_VALUE_MAPPING = createInvertedMap(
  CATALOG_LOADCASE_DATA_ROTATION_KEY_MAPPING
);

export const CATALOG_LUBRICATION_METHOD_KEY_MAPPING = new Map<string, string>([
  ['LB_GREASE_LUBRICATION', 'grease'],
  ['LB_OIL_BATH_LUBRICATION', 'oilBath'],
  ['LB_OIL_MIST_LUBRICATION', 'oilMist'],
  ['LB_RECIRCULATING_OIL_LUBRICATION', 'recirculatingOil'],
]);
export const CATALOG_LUBRICATION_METHOD_VALUE_MAPPING = createInvertedMap(
  CATALOG_LUBRICATION_METHOD_KEY_MAPPING
);

export const CATALOG_COMBINED_KEY_VALUES = new Map<string, string>([
  ...CATALOG_OPERATION_CONDITIONS_KEY_MAPPING.entries(),
  ...CATALOG_OPERATION_CONDITIONS_VALUE_MAPPING.entries(),
  ...CATALOG_LOADCASE_DATA_KEY_MAPPING.entries(),
  ...CATALOG_LOADCASE_DATA_VALUE_MAPPING.entries(),
  ...CATALOG_LOADCASE_DATA_LOAD_KEY_MAPPING.entries(),
  ...CATALOG_LOADCASE_DATA_LOAD_VALUE_MAPPING.entries(),
  ...CATALOG_LOADCASE_DATA_ROTATION_KEY_MAPPING.entries(),
  ...CATALOG_LOADCASE_DATA_ROTATION_VALUE_MAPPING.entries(),
  ...CATALOG_LUBRICATION_METHOD_KEY_MAPPING.entries(),
  ...CATALOG_LUBRICATION_METHOD_VALUE_MAPPING.entries(),
]);

export const CATALOG_VALUES_DEFAULT_VALUE_SKIP = ['operatingTime'];
