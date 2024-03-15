import {
  BearingBehaviour,
  CatalogCalculationResult,
  LoadcaseStringResultItem,
  OverrollingFrequencyKeys,
  ProductSelectionTemplate,
} from '../store/models';
import {
  extractErrorsFromResult,
  extractNotesFromResult,
  extractSubordinatesFromPath,
  extractTableFromSubordinate,
  extractValues,
  extractWarningsFromResult,
  formatMessageSubordinates,
} from './bearinx-helper';
import {
  BEARING_BEHAVIOUR_ABBREVIATIONS,
  BEARING_BEHAVIOUR_ABBREVIATIONS_KEY_MAPPING,
  BLOCK,
  FACTORS_AND_EQUIVALENT_LOADS_KEY_MAPPING,
  FRICTION_ABBREVIATIONS_KEY_MAPPING,
  LoadcaseValueType,
  LUBRICATION_ABBREVIATIONS_KEY_MAPPING,
  OVERROLLING_FREQUENCIES_ABBREVIATIONS,
  STRING_OUTP_BEARING_BEHAVIOUR,
  STRING_OUTP_FRICTION_AND_THERMALLY_PERMISSABLE_SPEED,
  STRING_OUTP_LOAD_FACTORS_AND_EQUIVALENT_LOADS,
  STRING_OUTP_LUBRICATION,
  STRING_OUTP_RESULTS,
  STRING_OUTP_RESULTS_OF_LOADCASES,
  STRING_OUTP_ROLLOVER_FREQUENCIES,
  TABLE,
  VARIABLE_BLOCK,
} from './bearinx-result.constant';
import { BearinxOnlineResult } from './bearinx-result.interface';
import {
  CatalogServiceTemplateField,
  CatalogServiceTemplateResult,
  SubordinatePathElement,
} from './catalog.service.interface';

export const convertCatalogCalculationResult = (
  originalResult: BearinxOnlineResult,
  calcualtionError: string,
  hasMultipleLoadCases: boolean
): CatalogCalculationResult => {
  const result: CatalogCalculationResult = {};

  extractCalculationError(calcualtionError, result);

  extractBearingBehaviour(originalResult, result);

  extractOverrolling(originalResult, result, hasMultipleLoadCases);

  extractErrorsWarnings(originalResult, result);

  extractFriction(originalResult, result, hasMultipleLoadCases);

  extractLubrication(originalResult, result, hasMultipleLoadCases);

  return result;
};

function getSubordinatePath(
  hasMultipleLoadCases: boolean,
  suffix: SubordinatePathElement[]
): SubordinatePathElement[] {
  const basePath = hasMultipleLoadCases
    ? [
        {
          titleID: STRING_OUTP_RESULTS,
          identifier: BLOCK,
        },
        {
          titleID: STRING_OUTP_RESULTS_OF_LOADCASES,
          identifier: BLOCK,
        },
      ]
    : [{ titleID: STRING_OUTP_RESULTS, identifier: BLOCK }];

  return [...basePath, ...suffix];
}

function extractCalculationError(
  calcualtionError: string | undefined,
  result: CatalogCalculationResult
): void {
  if (!calcualtionError) {
    return;
  }

  result.calculationError = {
    error: calcualtionError,
  };
}

function extractBearingBehaviour(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult
): void {
  const bearingBeahiourSubordinate = extractSubordinatesFromPath(
    originalResult,
    [
      { titleID: STRING_OUTP_RESULTS, identifier: BLOCK },
      { titleID: STRING_OUTP_BEARING_BEHAVIOUR, identifier: VARIABLE_BLOCK },
    ]
  );

  if (!bearingBeahiourSubordinate) {
    result.bearingBehaviour = undefined;

    return;
  }
  result.bearingBehaviour = {};

  for (const abbreviation of BEARING_BEHAVIOUR_ABBREVIATIONS) {
    const extractedValue = extractSubordinatesFromPath(
      bearingBeahiourSubordinate,
      [{ abbreviation }]
    );

    if (extractedValue) {
      result.bearingBehaviour[
        BEARING_BEHAVIOUR_ABBREVIATIONS_KEY_MAPPING.get(
          abbreviation
        ) as keyof BearingBehaviour
      ] = {
        unit: extractedValue.unit,
        value: extractedValue.value,
      };
    }
  }

  const loadFactorsSubordinate = extractSubordinatesFromPath(originalResult, [
    { titleID: STRING_OUTP_RESULTS, identifier: BLOCK },
    { titleID: STRING_OUTP_RESULTS_OF_LOADCASES, identifier: BLOCK },
    {
      titleID: STRING_OUTP_LOAD_FACTORS_AND_EQUIVALENT_LOADS,
      identifier: TABLE,
    },
  ]);

  if (!loadFactorsSubordinate) {
    return;
  }

  extractValues(
    result as Record<string, LoadcaseStringResultItem>,
    loadFactorsSubordinate,
    FACTORS_AND_EQUIVALENT_LOADS_KEY_MAPPING,
    LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS
  );
}

function extractOverrolling(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult,
  hasMultipleLoadCases: boolean
): void {
  const basicOverrollingFrequenciesSubordinate = extractSubordinatesFromPath(
    originalResult,
    getSubordinatePath(hasMultipleLoadCases, [
      {
        titleID: STRING_OUTP_ROLLOVER_FREQUENCIES,
        identifier: hasMultipleLoadCases ? TABLE : VARIABLE_BLOCK,
      },
    ])
  );

  if (!basicOverrollingFrequenciesSubordinate) {
    return;
  }
  if (hasMultipleLoadCases) {
    result.loadcaseOverrollingFrequencies = extractTableFromSubordinate(
      basicOverrollingFrequenciesSubordinate
    ).map((tableRow) =>
      Object.fromEntries(
        OverrollingFrequencyKeys.filter((key) => tableRow[key]).map(
          (overrollingFrequencyKey) => [
            overrollingFrequencyKey,
            {
              ...tableRow[overrollingFrequencyKey],
              title: overrollingFrequencyKey,
            },
          ]
        )
      )
    );
  } else {
    const loadcaseResult: { [key: string]: LoadcaseStringResultItem } = {};

    for (const abbreviation of OVERROLLING_FREQUENCIES_ABBREVIATIONS) {
      const extractedValue = extractSubordinatesFromPath(
        basicOverrollingFrequenciesSubordinate,
        [{ abbreviation }]
      );
      if (extractedValue) {
        loadcaseResult[abbreviation] = {
          unit: extractedValue.unit,
          value: extractedValue.value,
          title: abbreviation,
          short: abbreviation,
          loadcaseName: '',
        };
      }
    }
    result.loadcaseOverrollingFrequencies = [loadcaseResult];
  }
}

function extractErrorsWarnings(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult
): void {
  const errors = extractErrorsFromResult(originalResult);
  const warnings = extractWarningsFromResult(originalResult);
  const notes = extractNotesFromResult(originalResult);

  const formattedErrors = formatMessageSubordinates(errors);
  const formattedWarnings = formatMessageSubordinates(warnings);
  const formattedNotes = formatMessageSubordinates(notes);

  result.reportMessages = {
    errors: formattedErrors,
    warnings: formattedWarnings,
    notes: formattedNotes,
  };
}

function extractFriction(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult,
  hasMultipleLoadCases: boolean
): void {
  const frictionResultSubordinate = extractSubordinatesFromPath(
    originalResult,
    getSubordinatePath(hasMultipleLoadCases, [
      {
        identifier: hasMultipleLoadCases ? TABLE : VARIABLE_BLOCK,
        titleID: STRING_OUTP_FRICTION_AND_THERMALLY_PERMISSABLE_SPEED,
      },
    ])
  );

  if (!frictionResultSubordinate) {
    return;
  }

  extractValues(
    result as Record<string, LoadcaseStringResultItem>,
    frictionResultSubordinate,
    FRICTION_ABBREVIATIONS_KEY_MAPPING,
    LoadcaseValueType.FRICTION
  );
}

function extractLubrication(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult,
  hasMultipleLoadCases: boolean
): void {
  const resultSubordinate = extractSubordinatesFromPath(
    originalResult,
    getSubordinatePath(hasMultipleLoadCases, [
      {
        identifier: hasMultipleLoadCases ? TABLE : VARIABLE_BLOCK,
        titleID: STRING_OUTP_LUBRICATION,
      },
    ])
  );

  if (!resultSubordinate) {
    return;
  }

  /**
   * Viscosity ratio (symbol: kappa, no unit)
   * Operating viscosity (symbol: ny, unit: mm²/s)
   * Reference viscosity (symbol: ny1, unit: mm²/s)
   * Life adjustment factor (symbol: a_ISO, no unit)
   */
  extractValues(
    result as Record<string, LoadcaseStringResultItem> &
      CatalogCalculationResult,
    resultSubordinate,
    LUBRICATION_ABBREVIATIONS_KEY_MAPPING,
    LoadcaseValueType.LUBRICATION
  );
}

export const convertTemplateResult = (
  rawResult: CatalogServiceTemplateResult
): ProductSelectionTemplate[] => {
  const result: ProductSelectionTemplate[] = rawResult.input.flatMap((input) =>
    extractTemplates(input.fields)
  );

  return result;
};

const extractTemplates = (
  fields: CatalogServiceTemplateField[]
): ProductSelectionTemplate[] =>
  fields.flatMap((field) => {
    const result: ProductSelectionTemplate = {
      id: field.id,
      maximum: Number.parseFloat(field.maximum),
      minimum: Number.parseFloat(field.minimum),
      options: field.range?.map((item) => ({
        value: item.id,
      })),
      defaultValue: field.defaultValue,
      editable: field.conditions.editable,
      visible: field.conditions.visible,
      precision: field.precision,
      unit: field.unit,
    };

    // extract subfields recursively
    const subFields =
      field.range
        ?.map((item) => extractTemplates(item?.subfields || []))
        .flat() || [];

    return [result, ...subFields];
  });
