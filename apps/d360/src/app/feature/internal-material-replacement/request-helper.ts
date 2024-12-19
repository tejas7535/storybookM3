import { translate } from '@jsverse/transloco';

import { formatISODateToISODateString } from '../../shared/utils/parse-values';
import { IMRSubstitution, IMRSubstitutionRequest } from './model';

export function dataToIMRSubstitutionRequest(
  data: IMRSubstitution
): IMRSubstitutionRequest {
  if (!data.region || !data.replacementType) {
    throw new Error(translate('generic.validation.check_inputs', {}));
  }

  return {
    replacementType: data.replacementType,
    region: data.region,
    salesArea: data.salesArea,
    salesOrg: data.salesOrg,
    customerNumber: data.customerNumber,
    predecessorMaterial: data.predecessorMaterial,
    successorMaterial: data.successorMaterial,
    replacementDate: formatISODateToISODateString(
      data.replacementDate && new Date(data.replacementDate)
    ),
    cutoverDate: formatISODateToISODateString(
      data.cutoverDate && new Date(data.cutoverDate)
    ),
    startOfProduction: formatISODateToISODateString(
      data.startOfProduction && new Date(data.startOfProduction)
    ),
    note: data.note,
  };
}
