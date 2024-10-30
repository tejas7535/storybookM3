import { translate } from '@jsverse/transloco';
import { formatISO } from 'date-fns';

import { IMRSubstitution, IMRSubstitutionRequest } from './model';

export function dataToIMRSubstitutionRequest(
  data: IMRSubstitution
): IMRSubstitutionRequest {
  if (!data.region || !data.replacementType) {
    throw new Error(translate('generic.validation.check_inputs', {}));
  }

  const replacementDate = data.replacementDate; // TODO check if this is still necessary, cause startDate can't be a string anymore...
  // typeof data.replacementDate == 'string'
  //   ? parseDate(data.replacementDate)
  //   : data.replacementDate;

  const cutoverDate = data.cutoverDate; // TODO check if this is still necessary, cause startDate can't be a string anymore...
  // typeof data.cutoverDate == 'string' ? parseDate(data.cutoverDate) : data.cutoverDate;

  const startOfProduction = data.startOfProduction; // TODO check if this is still necessary, cause startDate can't be a string anymore...
  // typeof data.startOfProduction == 'string'
  //   ? parseDate(data.startOfProduction)
  //   : data.startOfProduction;

  return {
    replacementType: data.replacementType,
    region: data.region,
    salesArea: data.salesArea,
    salesOrg: data.salesOrg,
    customerNumber: data.customerNumber,
    predecessorMaterial: data.predecessorMaterial,
    successorMaterial: data.successorMaterial,
    replacementDate: replacementDate
      ? formatISO(replacementDate, {
          representation: 'date',
        })
      : null,
    cutoverDate: cutoverDate
      ? formatISO(cutoverDate, {
          representation: 'date',
        })
      : null,
    startOfProduction: startOfProduction
      ? formatISO(startOfProduction, {
          representation: 'date',
        })
      : null,
    note: data.note,
  };
}
