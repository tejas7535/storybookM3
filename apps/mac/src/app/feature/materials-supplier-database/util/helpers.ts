import { StringOption } from '@schaeffler/inputs';

import { Co2Classification } from '../constants';
import {
  NONE_OPTION,
  SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION,
  SCHAEFFLER_EXPERTS_OPTION,
  SCHAEFFLER_EXPERTS_PCF_OPTION,
  THIRD_PARTY_VERIFIED_OPTION,
} from '../constants/co2-classification-options';

export const asStringOption = (
  id: string | number,
  title?: string,
  tooltip?: string
): StringOption => ({
  id,
  title: title || id.toString(),
  tooltip,
});

export const asStringOptionOrUndefined = (
  value?: string | number,
  title?: string,
  tooltip?: string,
  data?: any
): StringOption | undefined =>
  value
    ? {
        id: value,
        title: title || value.toString(),
        tooltip,
        data,
      }
    : undefined;

export const useFormData = (
  co2UploadFileId?: number,
  co2UploadFile?: File
): boolean => co2UploadFileId !== undefined || co2UploadFile !== undefined;

export const determineCo2ClassificationNew = (
  co2Classification?: Co2Classification
): StringOption => {
  if (
    co2Classification ===
      Co2Classification.CHECKED_BY_SCHAEFFLER_EXPERTS_CALCULATION_TOOL ||
    co2Classification === Co2Classification.CHECKED_BY_SCHAEFFLER_EXPERTS_PCF
  ) {
    return SCHAEFFLER_EXPERTS_OPTION;
  } else if (
    co2Classification === Co2Classification.NONE ||
    !co2Classification
  ) {
    return NONE_OPTION;
  } else {
    return THIRD_PARTY_VERIFIED_OPTION;
  }
};

export const determineCo2ClassificationNewSecondary = (
  co2Classification?: Co2Classification
): StringOption =>
  co2Classification ===
  Co2Classification.CHECKED_BY_SCHAEFFLER_EXPERTS_CALCULATION_TOOL
    ? SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION
    : SCHAEFFLER_EXPERTS_PCF_OPTION;
