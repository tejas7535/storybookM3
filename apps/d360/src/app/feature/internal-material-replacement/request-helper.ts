import { translate } from '@jsverse/transloco';
import { formatISO } from 'date-fns';

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
    replacementDate: data.replacementDate
      ? formatISO(data.replacementDate, {
          representation: 'date',
        })
      : null,
    cutoverDate: data.cutoverDate
      ? formatISO(data.cutoverDate, {
          representation: 'date',
        })
      : null,
    startOfProduction: data.startOfProduction
      ? formatISO(data.startOfProduction, {
          representation: 'date',
        })
      : null,
    note: data.note,
  };
}
