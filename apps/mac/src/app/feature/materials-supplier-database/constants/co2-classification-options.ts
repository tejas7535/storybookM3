import { translate } from '@jsverse/transloco';

import { StringOption } from '@schaeffler/inputs';

import { Co2Classification } from './co2-classification.enum';

export const SCHAEFFLER_EXPERTS = 'SCHAEFFLER_EXPERTS';

export const THIRD_PARTY_VERIFIED_TEXT = translate(
  'materialsSupplierDatabase.mainTable.dialog.co2ClassificationNew.thirdPartyVerified'
);
export const SCHAEFFLER_EXPERTS_TEXT = translate(
  'materialsSupplierDatabase.mainTable.dialog.co2ClassificationNew.validatedBySchaefflerExperts'
);
export const NONE_TEXT = translate(
  'materialsSupplierDatabase.mainTable.dialog.co2ClassificationNew.none'
);
export const SCHAEFFLER_EXPERTS_CALCULATION_TOOL_TEXT = translate(
  'materialsSupplierDatabase.mainTable.dialog.co2ClassificationNew.calculationTool'
);
export const SCHAEFFLER_EXPERTS_PCF_TEXT = translate(
  'materialsSupplierDatabase.mainTable.dialog.co2ClassificationNew.pcf'
);

export const NONE_OPTION: StringOption = {
  id: undefined,
  title: NONE_TEXT,
  tooltip: translate(
    'materialsSupplierDatabase.mainTable.dialog.co2ClassificationNew.none'
  ),
};

export const SCHAEFFLER_EXPERTS_OPTION: StringOption = {
  id: SCHAEFFLER_EXPERTS,
  title: SCHAEFFLER_EXPERTS_TEXT,
  tooltip: translate(
    'materialsSupplierDatabase.mainTable.dialog.co2ClassificationNew.validatedBySchaefflerExperts'
  ),
};

export const THIRD_PARTY_VERIFIED_OPTION: StringOption = {
  id: Co2Classification.THIRD_PARTY_VERIFIED,
  title: THIRD_PARTY_VERIFIED_TEXT,
  tooltip: translate(
    'materialsSupplierDatabase.mainTable.dialog.co2ClassificationNew.thirdPartyVerified'
  ),
};

export const SCHAEFFLER_EXPERTS_PCF_OPTION: StringOption = {
  id: Co2Classification.CHECKED_BY_SCHAEFFLER_EXPERTS_PCF,
  title: SCHAEFFLER_EXPERTS_PCF_TEXT,
  tooltip: translate(
    'materialsSupplierDatabase.mainTable.dialog.co2ClassificationNew.validatedBySchaefflerExpertsPCF'
  ),
};

export const SCHAEFFLER_EXPERTS_CALCULATION_TOOL_OPTION: StringOption = {
  id: Co2Classification.CHECKED_BY_SCHAEFFLER_EXPERTS_CALCULATION_TOOL,
  title: SCHAEFFLER_EXPERTS_CALCULATION_TOOL_TEXT,
  tooltip: translate(
    'materialsSupplierDatabase.mainTable.dialog.co2ClassificationNew.validatedBySchaefflerExpertsCalculationTool'
  ),
};
