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
    translate(`replacement_type.${val}`);
  const parsedValue = parseToStringLiteralTypeIfPossible(
    value,
    replacementTypeValues,
    localizationKeyCreation
  );
  if (!parsedValue) {
    return translate(
      'internal_material_replacement.error.check_replacement_type'
    );
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
      DisplayFunctions.displayFnUnited(option)
        .replaceAll('\u00A0', ' ')
        .includes(value.replaceAll('\u00A0', ' '))
    );
    if (!foundValue) {
      return translate('generic.validation.check_inputs');
    }

    return undefined;
  };

/**
 * Checks, if two given data are equals.
 *
 * @export
 * @param {*} data1
 * @param {*} data2
 * @return {boolean}
 */
export function isEqual(data1: any, data2: any): boolean {
  if (
    data1 === data2 ||
    (typeof data1 === 'function' && typeof data2 === 'function')
  ) {
    return true;
  }

  if (Array.isArray(data1) && Array.isArray(data2)) {
    if (data1.length !== data2.length) {
      return false;
    }

    return data1.every((elem, index) => isEqual(elem, data2[index]));
  }

  if (
    typeof data1 === 'object' &&
    typeof data2 === 'object' &&
    data1 !== null &&
    data2 !== null
  ) {
    if (Array.isArray(data1) || Array.isArray(data2)) {
      return false;
    }

    const keys1: string[] = Object.keys(data1);
    const keys2: string[] = Object.keys(data2);

    if (
      keys1.length !== keys2.length ||
      !keys1.every((key) => keys2.includes(key))
    ) {
      return false;
    }

    for (const key in data1) {
      if (!isEqual(data1[key], data2[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}
