import { translate } from '@jsverse/transloco';
import { formatISO } from 'date-fns';

import { demandCharacteristicOptions } from '../material-customer/model';
import { CMPData } from './cmp-modal-types';
import { CMPWriteRequest } from './model';

export function dataToCMPWriteRequest(cmpData: CMPData): CMPWriteRequest {
  if (!cmpData.portfolioStatus) {
    throw new Error(translate('error.unknown', {}));
  }

  const toDate = (input: any): Date | null =>
    input instanceof Date ? input : null;

  const autoSwitchDate = toDate(cmpData.autoSwitchDate);
  const repDate = toDate(cmpData.repDate);

  // Sometimes SAP sends us empty strings, we want to send null to the backend if that happens
  const demandChar =
    cmpData.demandCharacteristic &&
    demandCharacteristicOptions.includes(cmpData.demandCharacteristic)
      ? cmpData.demandCharacteristic
      : null;

  return {
    customerNumber: cmpData.customerNumber,
    materialNumber: cmpData.materialNumber,
    portfolioStatus: cmpData.portfolioStatus,
    demandCharacteristic: demandChar,
    autoSwitchDate: autoSwitchDate
      ? formatISO(autoSwitchDate, { representation: 'date' })
      : null,
    repDate: repDate ? formatISO(repDate, { representation: 'date' }) : null,
    successorMaterial: cmpData.successorMaterial,
    demandPlanAdoption: cmpData.demandPlanAdoption,
  };
}
