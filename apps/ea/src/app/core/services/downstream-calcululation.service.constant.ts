import {
  ElectricityRegion,
  EmissionFactor,
  FossilFactor,
  LubricationMethodType,
} from './downstream-calculation.service.interface';

function createInvertedMap<K, V>(map: Map<K, V>): Map<V, K> {
  const invertedMap = new Map<V, K>();
  map.forEach((value, key) => {
    invertedMap.set(value, key);
  });

  return invertedMap;
}

export const ENERGY_SOURCES_TYPES = new Map<EmissionFactor, string>([
  ['LB_ELECTRIC_ENERGY', 'electric'],
  ['LB_FOSSIL_ENERGY', 'fossil'],
]);

export const ENERGY_SOURCES_VALUES = createInvertedMap(ENERGY_SOURCES_TYPES);

export const LUBRICATION_METHOD_KEY_MAPPING = new Map<
  LubricationMethodType,
  string
>([
  ['LB_GREASE_LUBRICATION', 'grease'],
  ['LB_OIL_BATH_LUBRICATION', 'oilBath'],
  ['LB_OIL_MIST_LUBRICATION', 'oilMist'],
  ['LB_RECIRCULATING_OIL_LUBRICATION', 'recirculatingOil'],
]);

export const LUBRICATION_METHOD_VALUE_MAPPING = createInvertedMap(
  LUBRICATION_METHOD_KEY_MAPPING
);

export const ELECTRICITY_REGION_VALUE_MAPPING = new Map<
  string,
  ElectricityRegion
>([
  ['argentina', 'LB_ARGENTINA'],
  ['australia', 'LB_AUSTRALIA'],
  ['brazil', 'LB_BRAZIL'],
  ['canada', 'LB_CANADA'],
  ['china', 'LB_CHINA'],
  ['europeanUnion', 'LB_EUROPEAN_UNION'],
  ['france', 'LB_FRANCE'],
  ['germany', 'LB_GERMANY'],
  ['greatBritain', 'LB_GREAT_BRITAIN'],
  ['india', 'LB_INDIA'],
  ['indonesia', 'LB_INDONESIA'],
  ['italy', 'LB_ITALY'],
  ['japan', 'LB_JAPAN'],
  ['mexico', 'LB_MEXICO'],
  ['russianFederation', 'LB_RUSSIAN_FEDERATION'],
  ['southAfrica', 'LB_SOUTH_AFRICA'],
  ['southKorea', 'LB_SOUTH_KOREA'],
  ['turkey', 'LB_TURKEY'],
  ['usa', 'LB_USA'],
]);

export const ELECTRICITY_REGION_KEY_MAPPING = createInvertedMap(
  ELECTRICITY_REGION_VALUE_MAPPING
);
export const FOSSIL_FACTORS_VALUE_MAPPING = new Map<string, FossilFactor>([
  ['gasoline', 'LB_GASOLINE_FOSSIL'],
  ['diesel', 'LB_DIESEL_FOSSIL'],
  ['e10', 'LB_GASOLINE_E10'],
  ['dieselB7', 'LB_DIESEL_B7'],
  ['lpg', 'LB_LPG'],
  ['cng', 'LB_CNG'],
  ['cngBiomethane', 'LB_CNG_BIOMETHANE'],
]);

export const FOSSIL_FACTORS_KEY_MAPPING = createInvertedMap(
  FOSSIL_FACTORS_VALUE_MAPPING
);
