import { translate } from '@jsverse/transloco';

import {
  ReplacementType,
  replacementTypeValues,
} from '../../../feature/internal-material-replacement/model';
import {
  DemandCharacteristic,
  demandCharacteristicOptions,
} from '../../../feature/material-customer/model';
import { SelectableValue } from '../../components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../components/inputs/display-functions.utils';
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
  if (
    !parseToStringLiteralTypeIfPossible(
      value,
      demandCharacteristicOptions,
      (val: DemandCharacteristic) => translate(`demand_characteristics.${val}`)
    )
  ) {
    return translate('generic.validation.check_inputs');
  }

  return undefined;
}

export const validateSelectableOptions =
  (options: SelectableValue[]) =>
  (value: string): string | undefined => {
    const foundValue = options.find((option) =>
      DisplayFunctions.displayFnUnited(option).includes(value)
    );
    if (!foundValue) {
      return translate('generic.validation.check_inputs', {});
    }

    return undefined;
  };
