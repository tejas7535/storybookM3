import { CatalogCalculationResult, ReportMessage } from '../store/models';
import {
  extractErrorsWarningsAndNotesFromResult,
  extractSubordinatesFromPath,
  extractValues,
  formatErrorsWarningsAndNotesResult,
  formatReportInputResult,
} from './bearinx-helper';
import { BearinxOnlineResult } from './bearinx-result.interface';

export const convertCatalogCalculationResult = (
  originalResult: BearinxOnlineResult
): CatalogCalculationResult => {
  const result: CatalogCalculationResult = {};

  extractBearingBehaviour(originalResult, result);

  extractOverrolling(originalResult, result);

  extractReportInput(originalResult, result);

  extractErrorsWarnings(originalResult, result);

  extractFriction(originalResult, result);

  return result;
};

function extractBearingBehaviour(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult
): void {
  const bearingBeahiourSubordinate = extractSubordinatesFromPath(
    originalResult,
    [
      { titleID: 'STRING_OUTP_RESULTS', identifier: 'block' },
      { titleID: 'STRING_OUTP_BEARING_BEHAVIOUR', identifier: 'variableBlock' },
    ]
  );

  if (!bearingBeahiourSubordinate) {
    return;
  }

  const ratingLifeSubordinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'Lh10' }]
  );
  if (ratingLifeSubordinate) {
    result.lh10 = {
      unit: ratingLifeSubordinate.unit,
      value: ratingLifeSubordinate.value,
    };
  }

  const modifiedRatingLifeSubordinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'Lh_nm' }]
  );
  if (modifiedRatingLifeSubordinate) {
    result.lh_nm = {
      unit: modifiedRatingLifeSubordinate.unit,
      value: modifiedRatingLifeSubordinate.value,
    };
  }

  const dynamicLoadSubordinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'P' }]
  );
  if (dynamicLoadSubordinate) {
    result.p = {
      unit: dynamicLoadSubordinate.unit,
      value: dynamicLoadSubordinate.value,
    };
  }

  const speedSubordinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'n' }]
  );
  if (speedSubordinate) {
    result.n = {
      unit: speedSubordinate.unit,
      value: speedSubordinate.value,
    };
  }

  const staticSafetySubordinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'S0_min' }]
  );
  if (staticSafetySubordinate) {
    result.S0_min = {
      unit: staticSafetySubordinate.unit,
      value: staticSafetySubordinate.value,
    };
  }

  const maximumStaticLoadSuboardinate = extractSubordinatesFromPath(
    bearingBeahiourSubordinate,
    [{ abbreviation: 'P0_max' }]
  );
  if (maximumStaticLoadSuboardinate) {
    result.P0_max = {
      unit: maximumStaticLoadSuboardinate.unit,
      value: maximumStaticLoadSuboardinate.value,
    };
  }
}

function extractOverrolling(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult
): void {
  const basicOverrollingFrequenciesSubordinate = extractSubordinatesFromPath(
    originalResult,
    [
      { titleID: 'STRING_OUTP_RESULTS', identifier: 'block' },
      {
        titleID: 'STRING_OUTP_ROLLOVER_FREQUENCIES',
        identifier: 'variableBlock',
      },
    ]
  );

  if (!basicOverrollingFrequenciesSubordinate) {
    return;
  }

  const overrollingOuterRing = extractSubordinatesFromPath(
    basicOverrollingFrequenciesSubordinate,
    [{ abbreviation: 'BPFO' }]
  );
  if (overrollingOuterRing) {
    result.BPFO = {
      unit: overrollingOuterRing.unit,
      value: overrollingOuterRing.value,
    };
  }

  const overrollingInnerRing = extractSubordinatesFromPath(
    basicOverrollingFrequenciesSubordinate,
    [
      {
        abbreviation: 'BPFI',
      },
    ]
  );
  if (overrollingInnerRing) {
    result.BPFI = {
      unit: overrollingInnerRing.unit,
      value: overrollingInnerRing.value,
    };
  }

  const overrollingRollingElement = extractSubordinatesFromPath(
    basicOverrollingFrequenciesSubordinate,
    [
      {
        abbreviation: 'BSF',
      },
    ]
  );
  if (overrollingRollingElement) {
    result.BSF = {
      value: overrollingRollingElement.value,
      unit: overrollingRollingElement.unit,
    };
  }

  const ringPassFrequency = extractSubordinatesFromPath(
    basicOverrollingFrequenciesSubordinate,
    [
      {
        abbreviation: 'RPFB',
      },
    ]
  );
  if (ringPassFrequency) {
    result.RPFB = {
      value: ringPassFrequency.value,
      unit: ringPassFrequency.unit,
    };
  }

  const rollingElementSetSpeed = extractSubordinatesFromPath(
    basicOverrollingFrequenciesSubordinate,
    [
      {
        abbreviation: 'FTF',
      },
    ]
  );

  if (rollingElementSetSpeed) {
    result.FTF = {
      value: rollingElementSetSpeed.value,
      unit: rollingElementSetSpeed.unit,
    };
  }
}

function extractReportInput(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult
): void {
  const inputData = extractSubordinatesFromPath(originalResult, [
    { titleID: 'STRING_OUTP_INPUT', identifier: 'block' },
  ]);

  if (!inputData) {
    return;
  }

  const formattedInputData = formatReportInputResult(inputData?.subordinates);

  // format basic frequencies
  const basicFrequencies = formattedInputData.find(
    (item) => item.titleID === 'STRING_OUTP_BASIC_FREQUENCIES_FACTOR'
  );
  if (basicFrequencies) {
    basicFrequencies.meaningfulRound = true;
  }

  if (formattedInputData) {
    result.reportInputSuborinates = {
      inputSubordinates: formattedInputData,
    };
  }
}

function extractErrorsWarnings(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult
): void {
  const messages = extractErrorsWarningsAndNotesFromResult(originalResult);

  if (!messages) {
    return;
  }

  const formattedMessages: ReportMessage[] =
    formatErrorsWarningsAndNotesResult(messages);

  if (formattedMessages?.length) {
    result.reportMessages = {
      messages: formattedMessages,
    };
  }
}

function extractFriction(
  originalResult: BearinxOnlineResult,
  result: CatalogCalculationResult
): void {
  const frictionResultSubordinate = extractSubordinatesFromPath(
    originalResult,
    [
      { identifier: 'block', titleID: 'STRING_OUTP_RESULTS' },
      {
        identifier: 'variableBlock',
        titleID: 'STRING_OUTP_FRICTION_AND_THERMALLY_PERMISSABLE_SPEED',
      },
    ]
  );

  if (!frictionResultSubordinate) {
    return;
  }

  extractValues(
    result as Record<string, { unit: string; value: string }>,
    frictionResultSubordinate,
    {
      speedDependentFrictionalTorque: 'M0',
      loadDependentFrictionalTorque: 'M1',
      totalFrictionalTorque: 'MR',
      totalFrictionalPowerLoss: 'NR',
      thermallySafeOperatingSpeed: 'n_theta',
    }
  );
}
