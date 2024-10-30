import { translate } from '@jsverse/transloco';

import {
  ReplacementType,
  replacementTypeValues,
} from '../../../feature/internal-material-replacement/model';
import {
  DemandCharacteristic,
  demandCharacteristics,
} from '../../../feature/material-customer/model';
import { parseToStringLiteralTypeIfPossible } from '../parse-values';

export function validateReplacementType(value: string): string | undefined {
  const localizationKeyCreation = (val: ReplacementType) =>
    translate(`replacement_type.${val}`, {});
  const parsedValue = parseToStringLiteralTypeIfPossible(
    value,
    replacementTypeValues,
    localizationKeyCreation
  );
  if (!parsedValue) {
    return translate('generic.validation.check_inputs', {});
  }

  return undefined;
}

export function validateDemandCharacteristicType(
  value: string
): string | undefined {
  const localizationKeyCreation = (val: DemandCharacteristic) =>
    translate(`demand_characterictics.${val}`, {});
  const parsedValue = parseToStringLiteralTypeIfPossible(
    value,
    demandCharacteristics,
    localizationKeyCreation
  );
  if (!parsedValue) {
    return translate('generic.validation.check_inputs', {});
  }

  return undefined;
}
