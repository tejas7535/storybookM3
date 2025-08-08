/*
 * Mapping tables for axis values
 */
const MAPPING_TABLE_EN: { [key: string]: string } = {
  PURCHASE: 'Purchase',
  BURDEN: 'Burden',
  LABOUR: 'Labour',
  MOH: 'MOH',
  RAW_MATERIAL: 'Raw Material',
  REMAINDER: 'Remainder',
  TOTAL: 'Total',
};

const MAPPING_TABLE_DE: { [key: string]: string } = {
  PURCHASE: 'Einkauf',
  BURDEN: 'Tragkraft',
  LABOUR: 'Arbeit',
  MOH: 'MOH',
  RAW_MATERIAL: 'Rohmaterial',
  REMAINDER: 'Rest',
  TOTAL: 'Gesamt',
};

export const AXIS_LABEL_MAP: Map<string, { [key: string]: string }> = new Map([
  ['en', MAPPING_TABLE_EN],
  ['de', MAPPING_TABLE_DE],
]);
