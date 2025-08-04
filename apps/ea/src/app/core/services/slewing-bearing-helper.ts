import { CatalogCalculationResult } from '../store/models';
import {
  extractSubordinatesFromPath,
  parseValueIfNeeded,
} from './bearinx-helper';
import {
  BLOCK,
  FRICTION_ABBREVIATIONS_KEY_MAPPING,
  IDM_LIFERATING_SLEWING_BEARING,
  LoadcaseValueType,
  MR_MAX,
  SLEWING_BEARING_BEAHAVIOUR,
  SLEWING_BEARING_FACTORS_AND_EQUIVALENT_LOADS_KEY_MAPPING,
  STRING_OUTP_RESULTS,
  VARIABLE_BLOCK,
} from './bearinx-result.constant';
import { BearinxOnlineResult } from './bearinx-result.interface';

export function isSlewingBearing(originalResult: BearinxOnlineResult): boolean {
  return originalResult.methodID === IDM_LIFERATING_SLEWING_BEARING;
}

/**
 * Extracts load case blocks from the original result
 */
function extractLoadCaseBlocks(
  originalResult: BearinxOnlineResult
): any[] | undefined {
  const loadFactorsSubordinate = extractSubordinatesFromPath(originalResult, [
    { titleID: STRING_OUTP_RESULTS, identifier: BLOCK },
  ]);

  if (!loadFactorsSubordinate) {
    return undefined;
  }

  return (
    loadFactorsSubordinate.subordinates?.filter(
      (subordinate) =>
        subordinate.identifier === VARIABLE_BLOCK &&
        (!subordinate.titleID || subordinate.titleID === undefined)
    ) || []
  );
}

/**
 * Creates a value object for extracted slewing bearing data
 */
function createValueObject(
  extractedValue: any,
  key: string,
  loadCaseName: string,
  processValues: boolean
): any {
  const processedValue = parseValueIfNeeded(
    extractedValue.value,
    processValues
  );

  return {
    value: processedValue,
    unit: extractedValue.unit,
    short: extractedValue.abbreviation,
    title: key,
    loadcaseName: loadCaseName,
  };
}

/**
 * Extracts values for a single load case block
 */
function extractValuesForLoadCase(
  loadCaseBlock: any,
  keyMapping: Record<string, string>,
  processValues: boolean
): { [key: string]: any } {
  const loadCaseName = loadCaseBlock.title ?? '';
  const extractedValues: { [key: string]: any } = {};

  for (const [key, abbreviation] of Object.entries(keyMapping)) {
    const extractedValue = extractSubordinatesFromPath(loadCaseBlock, [
      { abbreviation },
    ]);

    if (extractedValue) {
      extractedValues[key] = createValueObject(
        extractedValue,
        key,
        loadCaseName,
        processValues
      );
    }
  }

  return extractedValues;
}

/**
 * Generic function to extract slewing bearing data based on provided mappings
 */
function extractSlewingBearingData(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult,
  loadcaseType: LoadcaseValueType,
  keyMapping: Record<string, string>,
  options: {
    processValues?: boolean;
    onlyPushIfHasValues?: boolean;
  } = {}
): void {
  const { processValues = false, onlyPushIfHasValues = false } = options;

  const loadCaseBlocks = extractLoadCaseBlocks(originalResult);
  if (!loadCaseBlocks) {
    return;
  }

  if (!result[loadcaseType]) {
    result[loadcaseType] = [];
  }

  for (const loadCaseBlock of loadCaseBlocks) {
    const extractedValues = extractValuesForLoadCase(
      loadCaseBlock,
      keyMapping,
      processValues
    );

    const shouldPush = onlyPushIfHasValues
      ? Object.keys(extractedValues).length > 0
      : true;

    if (shouldPush) {
      result[loadcaseType].push(extractedValues);
    }
  }
}

export function extractSlewingBearingFactorsAndEquivalentLoads(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult
): void {
  extractSlewingBearingData(
    originalResult,
    result,
    LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS,
    SLEWING_BEARING_FACTORS_AND_EQUIVALENT_LOADS_KEY_MAPPING,
    { processValues: true, onlyPushIfHasValues: false }
  );
}

export function extractSlewingBearingFriction(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult
): void {
  extractSlewingBearingData(
    originalResult,
    result,
    LoadcaseValueType.FRICTION,
    FRICTION_ABBREVIATIONS_KEY_MAPPING,
    { processValues: false, onlyPushIfHasValues: true }
  );
}

/**
 * Extracts maximum frictional torque from the bearing data block for slewing bearings
 * This value is displayed as a single value in friction section, not per load case
 */
export function extractSlewingBearingMaximumFrictionalTorque(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult
): void {
  const bearingDataSubordinate = extractSubordinatesFromPath(originalResult, [
    { titleID: STRING_OUTP_RESULTS, identifier: BLOCK },
    { titleID: SLEWING_BEARING_BEAHAVIOUR, identifier: VARIABLE_BLOCK },
  ]);

  if (!bearingDataSubordinate) {
    return;
  }

  const maxFrictionalTorqueValue = extractSubordinatesFromPath(
    bearingDataSubordinate,
    [{ abbreviation: MR_MAX }]
  );

  if (!maxFrictionalTorqueValue) {
    return;
  }

  // Store the maximum frictional torque in a dedicated field for friction display
  result.maximumFrictionalTorque = {
    value: maxFrictionalTorqueValue.value,
    unit: maxFrictionalTorqueValue.unit,
  };
}
